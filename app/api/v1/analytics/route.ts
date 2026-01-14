import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("X-API-Key");

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Missing API key",
          message: "Please provide your API key in the X-API-Key header",
        },
        { status: 401 }
      );
    }

    // Validate API key
    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select("*")
      .eq("key", apiKey)
      .eq("is_active", true)
      .single();

    if (keyError || !keyData) {
      return NextResponse.json(
        {
          error: "Invalid API key",
          message: "The provided API key is invalid or inactive",
        },
        { status: 401 }
      );
    }

    // Only pro and enterprise tiers can access analytics
    if (keyData.tier !== "pro" && keyData.tier !== "enterprise") {
      return NextResponse.json(
        {
          error: "Upgrade required",
          message: "Analytics are only available for Pro and Enterprise plans",
          current_tier: keyData.tier,
        },
        { status: 403 }
      );
    }

    // Check rate limit
    if (keyData.requests_count >= keyData.requests_limit) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `You have exceeded your monthly limit of ${keyData.requests_limit} requests`,
        },
        { status: 429 }
      );
    }

    // Get analytics data
    const { data: totalProperties } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true });

    const { data: jualCount } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("mode", "jual");

    const { data: sewaCount } = await supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("mode", "sewa");

    // Get price statistics
    const { data: priceStats } = await supabase
      .from("properties")
      .select("price_numeric")
      .not("price_numeric", "is", null)
      .order("price_numeric", { ascending: true });

    let avgPrice = 0;
    let medianPrice = 0;
    let minPrice = 0;
    let maxPrice = 0;

    if (priceStats && priceStats.length > 0) {
      const prices = priceStats.map((p) => p.price_numeric).filter(Boolean);
      avgPrice = Math.round(
        prices.reduce((a, b) => a + b, 0) / prices.length
      );
      medianPrice = prices[Math.floor(prices.length / 2)];
      minPrice = prices[0];
      maxPrice = prices[prices.length - 1];
    }

    // Get top locations
    const { data: locationData } = await supabase
      .from("properties")
      .select("location");

    const locationCounts: Record<string, number> = {};
    locationData?.forEach((item) => {
      const loc = item.location || "Unknown";
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    const topLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([location, count]) => ({ location, count }));

    // Increment request count
    await supabase
      .from("api_keys")
      .update({ requests_count: keyData.requests_count + 1 })
      .eq("id", keyData.id);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          total_properties: totalProperties || 0,
          for_sale: jualCount || 0,
          for_rent: sewaCount || 0,
        },
        price_statistics: {
          average: avgPrice,
          median: medianPrice,
          min: minPrice,
          max: maxPrice,
          currency: "IDR",
        },
        top_locations: topLocations,
        last_updated: new Date().toISOString(),
      },
      meta: {
        requests_remaining: keyData.requests_limit - keyData.requests_count - 1,
        tier: keyData.tier,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
