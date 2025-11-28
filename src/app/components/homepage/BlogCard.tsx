"use client"
import React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

interface BlogCardProps {
  blog: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    author: string;
    featuredImage?: string;
    tags: string[];
    createDate: string;
    publishedAt?: string;
  };
  featured?: boolean;
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "TODAY";
    if (diffDays === 1) return "1 DAY AGO";
    return `${diffDays} DAYS AGO`;
  };

  const displayDate = blog.publishedAt || blog.createDate;

  if (featured) {
    return (
      <Link href={`/blog/${blog.slug}`} className="block group">
        <div className="bg-white dark:bg-dark border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Image */}
            <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px] rounded-md overflow-hidden">
              {blog.featuredImage ? (
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/products/empty-shopping-bag.gif";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Icon icon="solar:gallery-bold" className="text-4xl text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                {blog.title}
              </h3>
              {blog.excerpt && (
                <p className="text-sm text-muted dark:text-darklink mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-semibold uppercase">{blog.author}</span>
                <span className="text-xs text-muted dark:text-darklink">
                  {formatDate(displayDate)}
                </span>
              </div>
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs uppercase px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${blog.slug}`} className="block group">
      <div className="bg-white dark:bg-dark border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden">
          {blog.featuredImage ? (
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/products/empty-shopping-bag.gif";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Icon icon="solar:gallery-bold" className="text-4xl text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <div className="flex items-center gap-3 mb-2 text-xs">
            <span className="font-semibold uppercase">{blog.author}</span>
            <span className="text-muted dark:text-darklink">
              {formatDate(displayDate)}
            </span>
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-auto">
              <span className="text-xs uppercase px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-medium">
                {blog.tags[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

