import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const geoLocation = await prisma.geoLocation.findUnique({
      where: { id },
    });

    if (!geoLocation) {
      return NextResponse.json(
        { error: "Geo location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: geoLocation
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch geo location" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { city, provinceAbbv, slug, htmlContent, images } = body;

    const existingLocation = await prisma.geoLocation.findUnique({
      where: { id },
    });

    if (!existingLocation) {
      return NextResponse.json(
        { error: "Geo location not found" },
        { status: 404 }
      );
    }

    if (!city || !provinceAbbv || !slug || !htmlContent) {
      return NextResponse.json(
        { error: "City, province abbreviation, slug, and HTML content are required" },
        { status: 400 }
      );
    }

    const updatedGeoLocation = await prisma.geoLocation.update({
      where: { id },
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
      data: updatedGeoLocation
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update geo location" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.geoLocation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Geo location deleted successfully"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete geo location" },
      { status: 500 }
    );
  }
}

