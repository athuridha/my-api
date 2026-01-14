import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get API key from header
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

    // Check rate limit
    if (keyData.requests_count >= keyData.requests_limit) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `You have exceeded your monthly limit of ${keyData.requests_limit} requests. Please upgrade your plan.`,
          current_usage: keyData.requests_count,
          limit: keyData.requests_limit,
        },
        { status: 429 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");
    const mode = searchParams.get("mode"); // jual or sewa
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const bedrooms = searchParams.get("bedrooms");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query
    let query = supabase
      .from("properties")
      .select("*", { count: "exact" });

    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    if (mode && (mode === "jual" || mode === "sewa")) {
      query = query.eq("mode", mode);
    }

    if (minPrice) {
      query = query.gte("price_numeric", parseInt(minPrice));
    }

    if (maxPrice) {
      query = query.lte("price_numeric", parseInt(maxPrice));
    }

    if (bedrooms) {
      query = query.eq("bedrooms", parseInt(bedrooms));
    }

    // Execute query
    const { data: properties, count, error } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        {
          error: "Database error",
          message: error.message,
        },
        { status: 500 }
      );
    }

    // Increment request count
    await supabase
      .from("api_keys")
      .update({ requests_count: keyData.requests_count + 1 })
      .eq("id", keyData.id);

    return NextResponse.json({
      success: true,
      data: {
        properties: properties || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          has_more: (count || 0) > offset + limit,
        },
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
