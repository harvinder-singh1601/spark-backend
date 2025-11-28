"use client"
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import BlogCard from "./BlogCard";
import { TextInput } from "flowbite-react";

const FILTER_TAGS = [
  "CANNABIS 101",
  "CANNABIS CULTURE",
  "STRAINS",
  "GROW YOUR OWN",
  "HEALTH",
  "INDUSTRY",
  "LIFESTYLE",
  "RECIPES",
];

const BLOGS_PER_PAGE = 9;

export default function BlogsSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [displayedCount, setDisplayedCount] = useState(BLOGS_PER_PAGE);
  const [totalBlogs, setTotalBlogs] = useState(0);

  useEffect(() => {
    fetchBlogs();
  }, [activeTag, searchQuery]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        published: "true",
        limit: displayedCount.toString(),
        offset: "0",
      });

      if (activeTag) {
        params.append("tag", activeTag);
      }

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const response = await fetch(`/api/blog?${params.toString()}`);
      const result = await response.json();

      if (result.data) {
        setBlogs(result.data);
        setTotalBlogs(result.total || result.data.length);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + BLOGS_PER_PAGE);
    setTimeout(() => {
      fetchBlogs();
    }, 100);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setDisplayedCount(BLOGS_PER_PAGE); // Reset pagination on search
  };

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
    }
    setDisplayedCount(BLOGS_PER_PAGE); // Reset pagination on filter
  };

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const gridBlogs = blogs.slice(1);

  return (
    <section className="bg-white dark:bg-dark py-12 md:py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-0">Blogs</h2>
          <div className="relative max-w-md w-full">
            <TextInput
              type="text"
              placeholder="SEARCH BLOGS"
              value={searchQuery}
              onChange={handleSearch}
              className="form-control search"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2">
              <Icon icon="lucide:search" width={20} height={20} className="text-muted" />
            </span>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {FILTER_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium uppercase transition-colors ${
                activeTag === tag
                  ? "bg-black text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-darklink hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Icon icon="svg-spinners:ring-resize" className="text-4xl mx-auto mb-4" />
            <p className="text-muted">Loading blogs...</p>
          </div>
        )}

        {/* Blogs Content */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted text-lg">No blogs found.</p>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <>
            {/* Featured Blog */}
            {featuredBlog && (
              <div className="mb-12">
                <BlogCard blog={featuredBlog} featured={true} />
              </div>
            )}

            {/* Blog Grid */}
            {gridBlogs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {gridBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {displayedCount < totalBlogs && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium uppercase"
                >
                  LOAD MORE
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

