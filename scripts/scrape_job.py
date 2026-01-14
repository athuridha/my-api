"""
OLX Property Scraper Job

Script ini dijalankan oleh GitHub Actions untuk melakukan scraping
data properti dari OLX dan menyimpannya ke Supabase.
"""

import os
import re
import sys
import json
import time
import random
import logging
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager

# Setup logging
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(f"logs/scrape_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Supabase connection - try multiple env var names
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_KEY")

# PostgreSQL direct connection (alternative)
try:
    import psycopg2
    from psycopg2.extras import execute_values
    POSTGRES_URL = os.environ.get("POSTGRES_URL")
except ImportError:
    logger.warning("psycopg2 not installed")
    POSTGRES_URL = None


# =====================================================
# CONFIGURATION
# =====================================================

LOCATIONS = [
    {"slug": "jakarta-dki_g2000007", "name": "DKI Jakarta"},
    {"slug": "jakarta-selatan", "name": "Jakarta Selatan"},
    {"slug": "jakarta-barat", "name": "Jakarta Barat"},
    {"slug": "tangerang", "name": "Tangerang"},
    {"slug": "tangerang-selatan", "name": "Tangerang Selatan"},
    {"slug": "bekasi", "name": "Bekasi"},
    {"slug": "depok", "name": "Depok"},
    {"slug": "bogor", "name": "Bogor"},
    {"slug": "bandung", "name": "Bandung"},
    {"slug": "surabaya", "name": "Surabaya"},
]

MODES = ["jual", "sewa"]
TARGET_PER_LOCATION = 50
MAX_PAGES = 10


# =====================================================
# SELENIUM SETUP
# =====================================================

def create_driver() -> webdriver.Chrome:
    """Create headless Chrome driver."""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    
    ua = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    options.add_argument(f"--user-agent={ua}")
    
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )
    return driver


# =====================================================
# UTILITIES
# =====================================================

def safe_int_from_str(s: str) -> Optional[int]:
    """Convert string to integer."""
    digits = re.sub(r"[^\d]", "", s or "")
    return int(digits) if digits.isdigit() else None


def parse_posting_date(date_text: str) -> str:
    """Parse relative date to absolute date."""
    text = (date_text or "").strip()
    if not text:
        return ""
    
    lower = text.lower()
    today = datetime.now()
    
    if lower == "hari ini":
        dt = today
    elif lower == "kemarin":
        dt = today - timedelta(days=1)
    elif match := re.match(r"(\d+)\s*hari(?:\s*yang)?\s*lalu", lower):
        days = int(match.group(1))
        dt = today - timedelta(days=days)
    else:
        m = re.match(r"(\d{1,2})\s*([A-Za-z]+)", text)
        if m:
            day = int(m.group(1))
            month_name = m.group(2)
            months = {
                "jan": 1, "feb": 2, "mar": 3, "apr": 4, "mei": 5, "jun": 6,
                "jul": 7, "agu": 8, "sep": 9, "okt": 10, "nov": 11, "des": 12,
            }
            month = months.get(month_name.lower()[:3])
            if month:
                year = today.year
                try:
                    dt = datetime(year, month, day)
                except ValueError:
                    return text
            else:
                return text
        else:
            return text
    
    return dt.strftime("%d/%m/%Y")


def extract_price_numeric(price_str: str) -> Optional[int]:
    """Extract numeric value from price string."""
    if not price_str:
        return None
    
    cleaned = re.sub(r"[^\d.,jtJT]", "", price_str)
    
    if "jt" in cleaned.lower():
        num = re.sub(r"[^\d.]", "", cleaned)
        try:
            return int(float(num) * 1_000_000)
        except:
            return None
    else:
        num = re.sub(r"[^\d]", "", cleaned)
        return int(num) if num else None


def parse_card(card) -> Optional[Dict[str, Any]]:
    """Parse a property card element."""
    href = card.get_attribute("href") or ""
    if "iid-" not in href:
        return None
    
    text = (card.text or "").replace("\n", " ").strip()
    if not text:
        return None
    
    # Price
    price_match = re.search(r"(Rp\s*[0-9\.\,]+(?:\s*[A-Za-z]+)?)", text)
    price = price_match.group(1).strip() if price_match else ""
    
    # Specs
    bedrooms = bathrooms = building_area = None
    metrics_match = re.search(r"(\d+)\s*KT\s*-\s*(\d+)\s*KM\s*-\s*([0-9]+)\s*m2", text, re.IGNORECASE)
    if metrics_match:
        bedrooms = safe_int_from_str(metrics_match.group(1))
        bathrooms = safe_int_from_str(metrics_match.group(2))
        building_area = safe_int_from_str(metrics_match.group(3))
    
    # Location
    location = ""
    try:
        loc_el = card.find_element(By.CSS_SELECTOR, "span[data-aut-id='item-location']")
        location = loc_el.text.strip()
    except NoSuchElementException:
        pass
    
    # Posting date
    posting_date = ""
    try:
        date_el = card.find_element(By.CSS_SELECTOR, "span._2jcGx")
        raw_date = date_el.text.strip()
        posting_date = parse_posting_date(raw_date)
    except NoSuchElementException:
        pass
    
    # Image
    image_url = ""
    try:
        img = card.find_element(By.TAG_NAME, "img")
        image_url = img.get_attribute("src") or ""
    except NoSuchElementException:
        pass
    
    # Title
    if metrics_match:
        tail = text[metrics_match.end():].strip()
    elif price_match:
        tail = text[price_match.end():].strip()
    else:
        tail = text
    
    title = tail[:200] if tail else text[:200]
    
    return {
        "title": title,
        "url": href,
        "price": price,
        "price_numeric": extract_price_numeric(price),
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "building_area": building_area,
        "location": location,
        "posting_date": posting_date,
        "image_url": image_url,
    }


# =====================================================
# SCRAPER
# =====================================================

def scrape_location(driver: webdriver.Chrome, slug: str, mode: str) -> List[Dict[str, Any]]:
    """Scrape properties for a specific location and mode."""
    if mode == "jual":
        category = "dijual-rumah-apartemen_c5158"
    else:
        category = "disewakan-rumah-apartemen_c5160"
    
    base_url = f"https://www.olx.co.id/{slug}/{category}?sorting=desc-creation"
    logger.info(f"Scraping: {base_url}")
    
    records = []
    seen_urls = set()
    
    try:
        driver.get(base_url)
        time.sleep(4)
        
        for page in range(MAX_PAGES):
            if len(records) >= TARGET_PER_LOCATION:
                break
            
            time.sleep(random.uniform(2, 4))
            
            cards = driver.find_elements(By.CSS_SELECTOR, "a[href*='iid-']")
            
            for card in cards:
                if len(records) >= TARGET_PER_LOCATION:
                    break
                
                url = card.get_attribute("href") or ""
                if url in seen_urls:
                    continue
                
                rec = parse_card(card)
                if rec:
                    rec["mode"] = mode
                    rec["slug"] = slug
                    records.append(rec)
                    seen_urls.add(url)
            
            logger.info(f"Page {page + 1}: {len(records)} records")
            
            # Click load more
            try:
                btn = driver.find_element(By.CSS_SELECTOR, "button[data-aut-id='btnLoadMore']")
                if btn.is_displayed() and btn.is_enabled():
                    driver.execute_script("arguments[0].click();", btn)
                    time.sleep(3)
                else:
                    break
            except NoSuchElementException:
                break
    
    except Exception as e:
        logger.error(f"Error scraping {slug}/{mode}: {e}")
    
    return records


def save_to_database(records: List[Dict[str, Any]]) -> int:
    """Save records to Supabase via REST API or direct PostgreSQL."""
    if not records:
        return 0
    
    # Try Supabase REST API first
    if SUPABASE_URL and SUPABASE_KEY:
        return save_via_supabase_api(records)
    
    # Fallback to PostgreSQL direct connection
    if POSTGRES_URL:
        return save_via_postgres(records)
    
    logger.error("No database connection configured!")
    logger.error(f"SUPABASE_URL: {'set' if SUPABASE_URL else 'not set'}")
    logger.error(f"SUPABASE_KEY: {'set' if SUPABASE_KEY else 'not set'}")
    logger.error(f"POSTGRES_URL: {'set' if POSTGRES_URL else 'not set'}")
    return 0


def save_via_supabase_api(records: List[Dict[str, Any]]) -> int:
    """Save records via Supabase REST API."""
    import urllib.request
    import urllib.error
    
    url = f"{SUPABASE_URL}/rest/v1/properties"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    saved = 0
    batch_size = 50
    
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        data = json.dumps(batch).encode('utf-8')
        
        try:
            req = urllib.request.Request(url, data=data, headers=headers, method='POST')
            with urllib.request.urlopen(req) as response:
                saved += len(batch)
                logger.info(f"Batch {i // batch_size + 1}: Saved {len(batch)} records")
        except urllib.error.HTTPError as e:
            logger.error(f"HTTP Error {e.code}: {e.read().decode()}")
        except Exception as e:
            logger.error(f"Error saving batch: {e}")
    
    return saved


def save_via_postgres(records: List[Dict[str, Any]]) -> int:
    """Save records via direct PostgreSQL connection."""
    try:
        conn = psycopg2.connect(POSTGRES_URL)
        cur = conn.cursor()
        
        # Prepare data
        values = []
        for r in records:
            values.append((
                r["title"],
                r["url"],
                r["price"],
                r["price_numeric"],
                r["bedrooms"],
                r["bathrooms"],
                r["building_area"],
                r["location"],
                r["posting_date"],
                r["image_url"],
                r["mode"],
                r["slug"],
            ))
        
        # Upsert
        query = """
            INSERT INTO properties (
                title, url, price, price_numeric, bedrooms, bathrooms,
                building_area, location, posting_date, image_url, mode, slug
            ) VALUES %s
            ON CONFLICT (url) DO UPDATE SET
                title = EXCLUDED.title,
                price = EXCLUDED.price,
                price_numeric = EXCLUDED.price_numeric,
                bedrooms = EXCLUDED.bedrooms,
                bathrooms = EXCLUDED.bathrooms,
                building_area = EXCLUDED.building_area,
                location = EXCLUDED.location,
                posting_date = EXCLUDED.posting_date,
                image_url = EXCLUDED.image_url,
                updated_at = NOW()
        """
        
        execute_values(cur, query, values)
        conn.commit()
        
        affected = cur.rowcount
        cur.close()
        conn.close()
        
        return affected
    
    except Exception as e:
        logger.error(f"Database error: {e}")
        return 0


# =====================================================
# MAIN
# =====================================================

def main():
    """Main entry point."""
    logger.info("=" * 50)
    logger.info("Starting OLX Property Scraper Job")
    logger.info(f"Timestamp: {datetime.now().isoformat()}")
    logger.info("=" * 50)
    
    all_records = []
    driver = None
    
    try:
        driver = create_driver()
        
        for location in LOCATIONS:
            for mode in MODES:
                logger.info(f"\n--- {location['name']} ({mode}) ---")
                records = scrape_location(driver, location["slug"], mode)
                all_records.extend(records)
                logger.info(f"Collected {len(records)} records")
                
                # Random delay between locations
                time.sleep(random.uniform(5, 10))
    
    except Exception as e:
        logger.error(f"Fatal error: {e}")
    
    finally:
        if driver:
            driver.quit()
    
    # Save to database
    logger.info(f"\n{'=' * 50}")
    logger.info(f"Total records collected: {len(all_records)}")
    
    if all_records:
        saved = save_to_database(all_records)
        logger.info(f"Records saved/updated in database: {saved}")
    
    logger.info("Scraper job completed")
    logger.info("=" * 50)


if __name__ == "__main__":
    main()
