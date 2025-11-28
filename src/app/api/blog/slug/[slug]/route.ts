import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog) {
      return NextResponse.json({
        error: "Blog not found",
      }, { status: 404 });
    }

    if (blog.published) {
      await prisma.blog.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });
    }

    return NextResponse.json({
      data: blog,
      message: "Blog fetched successfully",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch blog",
    }, { status: 500 });
  }
}

