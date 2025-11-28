import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({
        error: "Blog not found",
      }, { status: 404 });
    }

    await prisma.blog.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({
      data: { ...blog, views: blog.views + 1 },
      message: "Blog fetched successfully",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch blog",
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
    const { title, slug, content, excerpt, author, featuredImage, tags, published } = body;

    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json({
        error: "Blog not found",
      }, { status: 404 });
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingBlog.slug) {
      const slugExists = await prisma.blog.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json({
          error: "Blog with this slug already exists",
        }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (slug) updateData.slug = slug;
    if (content) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (author) updateData.author = author;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (tags) updateData.tags = tags;
    if (published !== undefined) {
      updateData.published = published;
      if (published && !existingBlog.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      data: updatedBlog,
      message: "Blog updated successfully",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to update blog",
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json({
        error: "Blog not found",
      }, { status: 404 });
    }

    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Blog deleted successfully",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to delete blog",
    }, { status: 500 });
  }
}

