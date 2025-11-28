import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const city = searchParams.get("city");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius");

    const where: any = {};

    if (status) {
      where.status = status;
    }
    if (city) {
      where.city = city;
    }

    let stores = await prisma.location.findMany({
      where,
      orderBy: { createDate: "desc" },
    });

    if (lat && lng && radius) {
      const centerLat = parseFloat(lat);
      const centerLng = parseFloat(lng);
      const radiusKm = parseFloat(radius);

      stores = stores.filter((store: any) => {
        const distance = calculateDistance(
          centerLat,
          centerLng,
          store.lat,
          store.lng
        );
        return distance <= radiusKm;
      });
    }

    return NextResponse.json({
      data: stores,
      message: "Stores fetched successfully",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch stores",
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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

    if (
      !shopName ||
      !ownerName ||
      !ownerEmail ||
      !address ||
      !city ||
      lat === undefined ||
      lng === undefined
    ) {
      return NextResponse.json({
        error: "Please provide all required fields",
      }, { status: 400 });
    }

    const store = await prisma.location.create({
      data: {
        shopName,
        banners: banners || [],
        ownerName,
        ownerEmail,
        ownerPhone: ownerPhone || null,
        address,
        city,
        state,
        zipCode,
        country: country || "USA",
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        openingTimes: {},
        status: status || "active",
        description: description || null,
        posId: posId || null,
        websiteUrl: websiteUrl || null,
      },
    });

    return NextResponse.json({
      data: store,
      message: "Store created successfully",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to create store",
    }, { status: 500 });
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

