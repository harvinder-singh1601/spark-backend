"use client"
import React from "react";

export default function KeyMetrics() {
  const metrics = [
    { value: "1", label: "MEMBERSHIP" },
    { value: "10+", label: "BRANDS" },
    { value: "1", label: "COMMUNITY" },
  ];

  return (
    <section className="bg-white dark:bg-dark py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-black text-white p-8 rounded-md text-center aspect-square flex flex-col items-center justify-center"
            >
              <div className="text-5xl md:text-6xl font-bold mb-2">{metric.value}</div>
              <div className="text-sm uppercase tracking-wider">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

