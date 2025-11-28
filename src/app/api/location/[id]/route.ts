import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const location = await prisma.geoLocation.findUnique({
      where: { id },
    });

    if (!location) {
      return NextResponse.json(
        { error: "Geo location not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: location
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
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

    const updatedLocation = await prisma.geoLocation.update({
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
      data: updatedLocation
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update location" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingLocation = await prisma.geoLocation.findUnique({
      where: { id },
    });

    if (!existingLocation) {
      return NextResponse.json(
        { error: "Geo location not found" },
        { status: 404 }
      );
    }

    await prisma.geoLocation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Location deleted successfully"
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete location" },
      { status: 500 }
    );
  }
}
