"use client"

import type React from "react"
import { useRouter } from "next/navigation"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <div className="min-h-screen relative flex overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/pink_carbon_hero.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Auth Form with Glassmorphism */}
      <div className="w-full flex items-center justify-center p-8 relative z-10">
         
          <div className="backdrop-blur-xl bg-white/30 border border-white/30 rounded-2xl shadow-2xl p-8">
             {/* PinkCarbon Title - Clickable to Home */}
             <button 
            className="flex items-center p-button p-button-outlined border-none hover:bg-white/25 rounded-full text-4xl md:text-5xl mb-6 text-center"
            onClick={() => router.push('/')}
            aria-label="Go to home page"
          >
              <h1 className="text-pink-500 text-4xl md:text-5xl font-bold">PINK</h1>
              <h1 className="text-white text-4xl md:text-5xl font-bold">CARBON</h1>
          </button>
          {/* Carbon Chain Divider */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-1">
              {/* Carbon atoms and bonds */}
              <div className="w-3 h-3 bg-white/60 rounded-full"></div>
              <div className="w-4 h-0.5 bg-white/40"></div>
              <div className="w-3 h-3 bg-pink-300/70 rounded-full"></div>
              <div className="w-4 h-0.5 bg-white/40"></div>
              <div className="w-3 h-3 bg-white/60 rounded-full"></div>
              <div className="w-4 h-0.5 bg-white/40"></div>
              <div className="w-3 h-3 bg-pink-300/70 rounded-full"></div>
              <div className="w-4 h-0.5 bg-white/40"></div>
              <div className="w-3 h-3 bg-white/60 rounded-full"></div>
              <div className="w-4 h-0.5 bg-white/40"></div>
              <div className="w-3 h-3 bg-pink-300/70 rounded-full"></div>
              <div className="w-4 h-0.5 bg-white/40"></div>
              <div className="w-3 h-3 bg-white/60 rounded-full"></div>
            </div>
          </div>
          
            {children}
          </div>
        </div>
      </div>
  )
}
