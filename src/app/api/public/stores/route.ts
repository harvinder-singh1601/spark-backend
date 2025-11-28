import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/config/constants";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract query parameters
    const status = searchParams.get("status") || "active";
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const country = searchParams.get("country");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius");
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(config.pagination.defaultLimit)), 
      config.pagination.maxLimit
    );
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sortBy") || "createDate";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const where: any = {
      status: status,
    };

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    if (state) {
      where.state = { contains: state, mode: 'insensitive' };
    }
    if (country) {
      where.country = country;
    }

    const isProximitySearch = lat && lng;
    const orderBy: any = {};
    if (!isProximitySearch) {
      if (sortBy === "shopName" || sortBy === "city" || sortBy === "createDate") {
        orderBy[sortBy] = sortOrder === "asc" ? "asc" : "desc";
      } else {
        orderBy.createDate = "desc";
      }
    }

    let stores = await prisma.location.findMany({
      where,
      orderBy: !isProximitySearch ? orderBy : undefined,
      take: !isProximitySearch ? limit : undefined,
      skip: !isProximitySearch ? offset : undefined,
      select: {
        id: true,
        shopName: true,
        banners: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        lat: true,
        lng: true,
        openingTimes: true,
        status: true,
        description: true,
        ownerPhone: true,
        // Exclude sensitive owner information
        ownerName: false,
        ownerEmail: false,
      },
    });

    // Filter out placeholder phone numbers for non-proximity searches
    if (!isProximitySearch) {
      stores = stores.map((store) => ({
        ...store,
        ownerPhone: store.ownerPhone && store.ownerPhone !== '+1-000-000-0000' ? store.ownerPhone : null,
      }));
    }

    let total = await prisma.location.count({ where });
    if (lat && lng) {
      const centerLat = parseFloat(lat);
      const centerLng = parseFloat(lng);
      const radiusKm = radius ? parseFloat(radius) : null;
      let storesWithDistance = stores.map((store) => {
        const distance = calculateDistance(
          centerLat,
          centerLng,
          store.lat,
          store.lng
        );
        return {
          ...store,
          distance: parseFloat(distance.toFixed(2)),
          // Filter out placeholder phone numbers
          ownerPhone: store.ownerPhone && store.ownerPhone !== '+1-000-000-0000' ? store.ownerPhone : null,
        };
      });

      if (radiusKm !== null) {
        storesWithDistance = storesWithDistance.filter(
          (store: any) => store.distance <= radiusKm
        );
      }

      if (sortBy === "distance") {
        storesWithDistance.sort((a: any, b: any) => {
          return sortOrder === "asc" 
            ? a.distance - b.distance 
            : b.distance - a.distance;
        });
      } else if (sortBy === "shopName") {
        storesWithDistance.sort((a: any, b: any) => {
          return sortOrder === "asc"
            ? a.shopName.localeCompare(b.shopName)
            : b.shopName.localeCompare(a.shopName);
        });
      } else if (sortBy === "city") {
        storesWithDistance.sort((a: any, b: any) => {
          return sortOrder === "asc"
            ? a.city.localeCompare(b.city)
            : b.city.localeCompare(a.city);
        });
      } else {
        storesWithDistance.sort((a: any, b: any) => a.distance - b.distance);
      }

      total = storesWithDistance.length;
      stores = storesWithDistance.slice(offset, offset + limit);
    }

    // Build response
    return NextResponse.json({
      success: true,
      data: stores,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      filters: {
        status,
        city: city || null,
        state: state || null,
        country: country || null,
        proximity: lat && lng ? {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          radius: radius ? parseFloat(radius) : null
        } : null,
      },
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching public stores:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch stores",
      message: error.message,
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

