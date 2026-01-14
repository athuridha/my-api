import { NextRequest, NextResponse } from "next/server";

const locations = [
  { slug: "jakarta-dki_g2000007", name: "DKI Jakarta", region: "Jakarta" },
  { slug: "jakarta-pusat", name: "Jakarta Pusat", region: "Jakarta" },
  { slug: "jakarta-selatan", name: "Jakarta Selatan", region: "Jakarta" },
  { slug: "jakarta-barat", name: "Jakarta Barat", region: "Jakarta" },
  { slug: "jakarta-timur", name: "Jakarta Timur", region: "Jakarta" },
  { slug: "jakarta-utara", name: "Jakarta Utara", region: "Jakarta" },
  { slug: "tangerang", name: "Tangerang", region: "Banten" },
  { slug: "tangerang-selatan", name: "Tangerang Selatan", region: "Banten" },
  { slug: "bekasi", name: "Bekasi", region: "Jawa Barat" },
  { slug: "depok", name: "Depok", region: "Jawa Barat" },
  { slug: "bogor", name: "Bogor", region: "Jawa Barat" },
  { slug: "bandung", name: "Bandung", region: "Jawa Barat" },
  { slug: "surabaya", name: "Surabaya", region: "Jawa Timur" },
  { slug: "semarang", name: "Semarang", region: "Jawa Tengah" },
  { slug: "yogyakarta", name: "Yogyakarta", region: "DIY" },
  { slug: "bali", name: "Bali", region: "Bali" },
  { slug: "denpasar", name: "Denpasar", region: "Bali" },
  { slug: "medan", name: "Medan", region: "Sumatera Utara" },
  { slug: "makassar", name: "Makassar", region: "Sulawesi Selatan" },
  { slug: "palembang", name: "Palembang", region: "Sumatera Selatan" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region");

  let filteredLocations = locations;

  if (region) {
    filteredLocations = locations.filter(
      (loc) => loc.region.toLowerCase() === region.toLowerCase()
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      locations: filteredLocations,
      total: filteredLocations.length,
    },
  });
}
