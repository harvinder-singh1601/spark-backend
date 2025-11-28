"use client"
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Spinner } from "flowbite-react";
import RelatedPosts from "../../components/homepage/RelatedPosts";
import HomeFooter from "../../components/homepage/HomeFooter";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const resolvedParams = await Promise.resolve(params);
        const slug = resolvedParams.slug as string;
        const response = await fetch(`/api/blog/slug/${slug}`);
        const result = await response.json();

        if (result.data) {
          setBlog(result.data);
        } else {
          router.push("/");
        }
      } catch (error) {
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [params, router]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "TODAY";
    if (diffDays === 1) return "1 DAY AGO";
    return `${diffDays} DAYS AGO`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
        <span className="ml-3 text-muted">Loading blog...</span>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">Blog not found</p>
          <Link href="/" className="text-primary hover:underline">
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      {/* Header */}
      <header className="border-b border-border bg-white dark:bg-dark">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Logo - Left */}
            <div>
              <Link href="/" className="text-3xl font-bold hover:text-primary transition-colors inline-block">
                spark
                <span className="block text-sm font-normal uppercase tracking-wider mt-1">
                  DELIVERY
                </span>
              </Link>
            </div>

            {/* Title and Meta - Right */}
            <div className="flex-1 md:max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {blog.title}
              </h1>
              
              {/* Author and Date */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-semibold uppercase">{blog.author}</span>
                <span className="text-sm text-muted dark:text-darklink">
                  {formatDate(blog.publishedAt || blog.createDate)}
                </span>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="text-xs uppercase px-4 py-2 border border-black dark:border-white rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <article className="container mx-auto px-6 py-12">
        {/* Hero Image - Below header */}
        {blog.featuredImage && (
          <div className="mb-12 rounded-lg overflow-hidden">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/products/empty-shopping-bag.gif";
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-dark dark:prose-headings:text-white prose-p:text-base prose-p:leading-relaxed prose-ul:list-disc prose-ol:list-decimal prose-li:my-2 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Related Posts */}
          {blog.tags && blog.tags.length > 0 && (
            <RelatedPosts currentBlogId={blog.id} currentBlogTags={blog.tags} />
          )}
        </div>
      </article>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}

