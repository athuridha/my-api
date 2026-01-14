import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const region = searchParams.get("region");
    const province = searchParams.get("province");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("locations")
      .select("slug, name, region, province", { count: "exact" })
      .eq("is_active", true)
      .order("name");

    // Filter by search (name)
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Filter by region
    if (region) {
      query = query.ilike("region", `%${region}%`);
    }

    // Filter by province
    if (province) {
      query = query.ilike("province", `%${province}%`);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: locations, count, error } = await query;

    if (error) {
      throw error;
    }

    // Get unique regions and provinces for filtering
    const { data: regions } = await supabase
      .from("locations")
      .select("region")
      .eq("is_active", true);

    const { data: provinces } = await supabase
      .from("locations")
      .select("province")
      .eq("is_active", true);

    const uniqueRegions = [...new Set(regions?.map((r) => r.region))].sort();
    const uniqueProvinces = [...new Set(provinces?.map((p) => p.province))].sort();

    return NextResponse.json({
      success: true,
      data: {
        locations: locations || [],
        total: count || 0,
        limit,
        offset,
        filters: {
          regions: uniqueRegions,
          provinces: uniqueProvinces,
        },
      },
      usage: {
        tip: "Use the 'slug' value when querying /api/v1/properties?location=<slug>",
        example: "/api/v1/properties?location=jakarta-selatan_g4000030",
      },
    });
  } catch (error: unknown) {
    console.error("Locations API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "LOCATIONS_ERROR",
          message: error instanceof Error ? error.message : "Failed to fetch locations",
        },
      },
      { status: 500 }
    );
  }
}
