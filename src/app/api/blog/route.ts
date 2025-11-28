import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get("published");
    const author = searchParams.get("author");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "0");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    
    if (published !== null) {
      where.published = published === "true";
    }
    if (author) {
      where.author = author;
    }
    if (tag) {
      where.tags = { has: tag };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { createDate: "desc" },
      take: limit > 0 ? limit : undefined,
      skip: offset > 0 ? offset : undefined,
    });

    const total = await prisma.blog.count({ where });

    return NextResponse.json({
      data: blogs,
      total,
      message: "Blogs fetched successfully",
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to fetch blogs",
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, content, excerpt, author, featuredImage, tags, published } = body;

    if (!title || !slug || !content || !author) {
      return NextResponse.json({ 
        error: "Please provide title, slug, content, and author" 
      }, { status: 400 });
    }

    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingBlog) {
      return NextResponse.json({ 
        error: "Blog with this slug already exists" 
      }, { status: 400 });
    }

    const blogData: any = {
      title,
      slug,
      content,
      author,
      tags: tags || [],
      published: published || false,
    };

    if (excerpt) blogData.excerpt = excerpt;
    if (featuredImage) blogData.featuredImage = featuredImage;
    if (published) {
      blogData.publishedAt = new Date();
    }

    const blog = await prisma.blog.create({
      data: blogData,
    });

    return NextResponse.json({
      data: blog,
      message: "Blog created successfully",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to create blog",
    }, { status: 500 });
  }
}

