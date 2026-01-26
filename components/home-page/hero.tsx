"use client"

import { useEffect, useState } from "react"

export default function Hero() {
  const [isMdScreen, setIsMdScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMdScreen(window.innerWidth >= 768)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center py-16 md:py-24 overflow-hidden">
      {/* Background Image - Full Width */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/pink_carbon_hero.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex items-center justify-center">
        {/* Content taking 2/3 of the width */}
        <div className="max-w-4xl space-y-8 text-center">
          {/* Glass container for main content */}
          <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl p-6 shadow-2xl">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
                Streamline Your <span className="text-pink-300">Tax Processing</span> Workflow
              </h1>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
                Pink Carbon transforms chaotic tax season into an organized, efficient process. Track every return, manage
                client expectations, and never lose sight of deadlines again.
              </p>
            </div>
          </div>

          {/* Key Benefits with glass effect */}
          <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div
                  className="w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  aria-hidden="true"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Real-time Queue Management</h3>
                  <p className="text-sm text-white/80">Track every return from receipt to completion</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className="w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  aria-hidden="true"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Client Transparency</h3>
                  <p className="text-sm text-white/80">Automated status updates keep clients informed</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className="w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  aria-hidden="true"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Team Collaboration</h3>
                  <p className="text-sm text-white/80">Multiple team members, one unified system</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div
                  className="w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  aria-hidden="true"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"
                    >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Performance Analytics</h3>
                  <p className="text-sm text-white/80">Data-driven insights to optimize your workflow</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons with glass effect */}
          <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/sign-up"
                className="px-8 py-4 bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold rounded-lg hover:from-pink-500 hover:to-pink-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-pink-400/50 text-center backdrop-blur-sm"
              >
                Start Free Trial
              </a>
              <a
                href="/sign-in"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 text-center backdrop-blur-sm"
              >
                Sign In
              </a>
            </div>
          </div>

          {/* Social Proof with glass effect */}
          <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl p-6 shadow-2xl">
            <p className="text-sm text-white/80 mb-4">Trusted by tax professionals nationwide</p>
            <div className="flex items-center justify-center lg:justify-start space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-300">500+</div>
                <div className="text-xs text-white/70">Returns Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-300">50+</div>
                <div className="text-xs text-white/70">Tax Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-300">99%</div>
                <div className="text-xs text-white/70">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
