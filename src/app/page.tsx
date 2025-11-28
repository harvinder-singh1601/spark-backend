import React from "react";
import HeroSection from "./components/homepage/HeroSection";
import KeyMetrics from "./components/homepage/KeyMetrics";
import BlogsSection from "./components/homepage/BlogsSection";
import HomeFooter from "./components/homepage/HomeFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <HeroSection />
      <KeyMetrics />
      <BlogsSection />
      <HomeFooter />
    </div>
  );
}

