import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const locations = await prisma.geoLocation.findMany({
      where: {
        provinceAbbv: { not: null },
        slug: { not: null },
        htmlContent: { not: null }
      },
      orderBy: {
        createDate: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: locations
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, provinceAbbv, slug, htmlContent, images } = body;

    if (!city || !provinceAbbv || !slug || !htmlContent) {
      return NextResponse.json(
        { error: "City, province abbreviation, slug, and HTML content are required" },
        { status: 400 }
      );
    }

    const newGeoLocation = await prisma.geoLocation.create({
      data: {
        city,
        provinceAbbv,
        slug,
        htmlContent,
        images: images || [],
      },
    });

    return NextResponse.json({
      success: true,
      data: newGeoLocation
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create geo location" },
      { status: 500 }
    );
  }
}

