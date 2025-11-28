"use client"
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import BlogCard from "./BlogCard";

interface RelatedPostsProps {
  currentBlogId: string;
  currentBlogTags: string[];
}

export default function RelatedPosts({ currentBlogId, currentBlogTags }: RelatedPostsProps) {
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedBlogs();
  }, [currentBlogId, currentBlogTags]);

  const fetchRelatedBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        published: "true",
        limit: "3",
      });

      if (currentBlogTags && currentBlogTags.length > 0) {
        params.append("tag", currentBlogTags[0]);
      }

      const response = await fetch(`/api/blog?${params.toString()}`);
      const result = await response.json();

      if (result.data) {
        const filtered = result.data
          .filter((blog: any) => blog.id !== currentBlogId)
          .slice(0, 3);
        setRelatedBlogs(filtered);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (relatedBlogs.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">Related posts</h2>
        <button className="w-10 h-10 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center justify-center">
          <Icon icon="solar:arrow-right-bold" width={20} height={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </section>
  );
}

