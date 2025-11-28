import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/config/constants";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const city = searchParams.get("city");
    const provinceAbbv = searchParams.get("provinceAbbv");
    const slug = searchParams.get("slug");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500);
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sortBy") || "city";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Build where clause - only return locations with new schema fields
    const where: any = {
      provinceAbbv: { not: null },
      slug: { not: null },
      htmlContent: { not: null }
    };

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    if (provinceAbbv) {
      where.provinceAbbv = { contains: provinceAbbv.toUpperCase(), mode: 'insensitive' };
    }
    if (slug) {
      where.slug = { contains: slug, mode: 'insensitive' };
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === "city" || sortBy === "provinceAbbv" || sortBy === "slug" || sortBy === "createDate") {
      orderBy[sortBy] = sortOrder === "asc" ? "asc" : "desc";
    } else {
      orderBy.city = "asc";
    }

    // Fetch locations from database
    const locations = await prisma.geoLocation.findMany({
      where,
      orderBy,
      take: limit,
      skip: offset,
    });

    // Get total count for pagination
    const total = await prisma.geoLocation.count({ where });

    // Build response
    return NextResponse.json({
      success: true,
      data: locations,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      filters: {
        city: city || null,
        provinceAbbv: provinceAbbv || null,
        slug: slug || null,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching public locations:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch locations",
      message: error.message,
    }, { status: 500 });
  }
}
