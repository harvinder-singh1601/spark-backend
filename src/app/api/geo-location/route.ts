import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const geoLocations = await prisma.geoLocation.findMany({
      orderBy: {
        createDate: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: geoLocations
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch geo locations" },
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


