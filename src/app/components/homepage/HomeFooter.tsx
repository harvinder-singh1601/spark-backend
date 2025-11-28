"use client"
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";

export default function HomeFooter() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/location");
      const result = await response.json();
      if (result.data) {
        setLocations(result.data.slice(0, 10));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white dark:bg-dark border-t border-border">
      {/* Top Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo */}
          <div>
            <h3 className="text-2xl font-bold mb-2">
              spark
              <span className="block text-sm font-normal uppercase tracking-wider mt-1">
                REWARDS
              </span>
            </h3>
          </div>

          {/* Links */}
          <div>
            <ul className="space-y-2">
              <li>
                <Link href="/brands" className="text-sm hover:text-primary transition-colors">
                  Discover Our Brands
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-sm hover:text-primary transition-colors">
                  Become a Member
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-sm font-semibold mb-3 uppercase">Locations</h4>
            {loading ? (
              <p className="text-xs text-muted">Loading locations...</p>
            ) : locations.length > 0 ? (
              <ul className="space-y-1">
                {locations
                  .filter((location) => location.city && location.city.trim() !== '')
                  .map((location) => (
                    <li key={location.id}>
                      <span className="text-xs text-muted dark:text-darklink">
                        {location.city}{location.provinceAbbv ? `, ${location.provinceAbbv}` : ''}
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-xs text-muted">No locations available</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Icon icon="mdi:instagram" width={18} height={18} />
              </a>
            </div>

            {/* Legal Info */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
              <span>Proudly owned & operated in Canada</span>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span>© 2025 Spark Rewards</span>
              <span>4.19.1</span>
            </div>

            {/* App Badges */}
            <div className="flex items-center gap-2">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:opacity-80 transition-opacity"
              >
                Download on the App Store
              </a>
              <span className="text-gray-600">|</span>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:opacity-80 transition-opacity"
              >
                GET IT ON Google Play
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

