"use client";
import React, { useContext, useState, useEffect } from "react";
import Header from "./layout/header/Header";
import Sidebar from "./layout/sidebar/Sidebar";
import { Bounce, ToastContainer } from "react-toastify";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex w-full min-h-screen">
        <div className="page-wrapper flex w-full">
          <div className="body-wrapper w-full bg-white dark:bg-dark">
            <div className={`container mx-auto px-6 py-[30px]`}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen" suppressHydrationWarning>
      <div className="page-wrapper flex w-full">
        {/* Header/sidebar */}
         <Sidebar />
        <div className="body-wrapper w-full bg-white dark:bg-dark">
          {/* Top Header  */}
            <Header/>
          {/* Body Content  */}
          <div
            className={`container mx-auto px-6  py-[30px]`}
          >
            {children}
          </div>
        </div>
      </div>
      <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
    </div>
  );
}
