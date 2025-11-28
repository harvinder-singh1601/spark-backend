import React from "react";
import type { Metadata } from "next";
import {Plus_Jakarta_Sans } from "next/font/google";
import "./css/globals.css";
import { Flowbite, ThemeModeScript } from "flowbite-react";
import customTheme from "@/utils/theme/custom-theme";
const plus_jakarta_sans = Plus_Jakarta_Sans({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Spark Delivery",
  description: "Modern delivery and store locator platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <ThemeModeScript />
      </head>
      <body className={`${plus_jakarta_sans.className}`}>
        <Flowbite theme={{ theme: customTheme }}>
            {children}
        </Flowbite>
      </body>
    </html>

  );
}



