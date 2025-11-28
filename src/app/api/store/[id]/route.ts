import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const store = await prisma.location.findUnique({
      where: { id },
    });

    if (!store) {
      return NextResponse.json({
        error: "Store not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      data: store,
      message: "Store fetched successfully",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch store",
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      shopName,
      banners,
      ownerName,
      ownerEmail,
      ownerPhone,
      address,
      city,
      state,
      zipCode,
      country,
      lat,
      lng,
      status,
      description,
      posId,
      websiteUrl,
    } = body;

    const existingStore = await prisma.location.findUnique({
      where: { id },
    });

    if (!existingStore) {
      return NextResponse.json({
        error: "Store not found",
      }, { status: 404 });
    }

    const updateData: any = {};
    if (shopName) updateData.shopName = shopName;
    if (banners) updateData.banners = banners;
    if (ownerName) updateData.ownerName = ownerName;
    if (ownerEmail) updateData.ownerEmail = ownerEmail;
    if (ownerPhone !== undefined) updateData.ownerPhone = ownerPhone || null;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (country) updateData.country = country;
    if (lat !== undefined) updateData.lat = parseFloat(lat);
    if (lng !== undefined) updateData.lng = parseFloat(lng);
    if (status) updateData.status = status;
    if (description !== undefined) updateData.description = description;
    if (posId !== undefined) updateData.posId = posId || null;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl || null;

    const updatedStore = await prisma.location.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      data: updatedStore,
      message: "Store updated successfully",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to update store",
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingStore = await prisma.location.findUnique({
      where: { id },
    });

    if (!existingStore) {
      return NextResponse.json({
        error: "Store not found",
      }, { status: 404 });
    }

    await prisma.location.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Store deleted successfully",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to delete store",
    }, { status: 500 });
  }
}

