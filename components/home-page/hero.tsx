"use client"

import React, { useEffect, useState } from "react";

export default function Hero() {

    const [isMdScreen, setIsMdScreen] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMdScreen(window.innerWidth >= 768); // Match Tailwind's `md` breakpoint
      }
    };

    handleResize(); // Check initially
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div>
      <div className="flex flex-col gap-8 items-center">
        {/* Grid container for layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch surface-0 text-800 w-full">
          {/* Left Column: Text */}
          <div className="p-2 text-center md:text-left flex flex-col items-center md:items-start">
            <section>
              <span className="block text-4xl md:text-6xl font-bold mb-4">
                Custom management solutions delivered on{" "}
                <span className="pink-text">your</span> terms
              </span>
              <p className="text-sm md:text-base text-700 leading-relaxed mb-6">
                Pink Carbon specializes in creating personalized tools and
                workflows that adapt to your business needs. Whether you’re
                scaling, optimizing, or starting fresh, we’re here to build the
                solutions that fit you best.
              </p>

              {/* Auth Buttons */}
              <div className="flex flex-col md:flex-row gap-4 justify-center ">
                <a
                  href="/sign-in"
                  className="p-button font-bold inline-block text-center"
                >
                  Sign in
                </a>
                <a
                  href="/sign-up"
                  className="p-button p-button-outlined font-bold inline-block text-center"
                >
                  Sign up
                </a>
              </div>
            </section>
          </div>

          {/* Right Column: Image */}
          <div className="overflow-hidden flex items-center justify-end">
            <img
              src="/assets/pink_carbon_hero.png"
              alt="pink-carbon-hero-image"
              className="block h-full w-full md:w-4/5 object-cover"
              // Apply clipPath conditionally
              style={
                isMdScreen
                  ? { clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)" }
                  : {}
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
