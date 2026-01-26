"use client"

import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {/* TODO: Add actual logo */}
          <button 
            className="flex items-center p-button p-button-outlined border-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Go to top of page"
          >
              <h1 className="text-pink-500 text-2xl md:text-3xl font-bold">PINK</h1>
              <h1 className="text-slate-600 text-2xl md:text-3xl font-bold">CARBON</h1>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2" role="navigation" aria-label="Main navigation">
            <button
              onClick={() => scrollToSection("features")}
              className="p-button p-button-outlined border-none text-slate-600 font-bold inline-block text-center hover:bg-pink-50 transition-all duration-200"
              >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="p-button p-button-outlined border-none text-slate-600 font-bold inline-block text-center hover:bg-pink-50 transition-all duration-200"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="p-button p-button-outlined border-none text-slate-600 font-bold inline-block text-center hover:bg-pink-50 transition-all duration-200"
            >
              About
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 p-button p-button-outlined border-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/sign-in"
              className="p-button p-button-outlined hover:bg-white/90 hover:font-bold transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full"
            >
              Sign In
            </a>
            <a
              href="/sign-up"
              className="p-button bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-gray-200/50">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("features")}
                className="p-button  border-none text-slate-600 font-bold inline-block text-center hover:bg-pink-50 transition-all duration-200"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="p-button border-none text-slate-600 font-bold inline-block text-center hover:bg-pink-50 transition-all duration-200"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="p-button border-none text-slate-600 font-bold inline-block text-center hover:bg-pink-50 transition-all duration-200"
              >
                About
              </button>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200/50">
                <a
                  href="/sign-in"
                  className="p-button p-button-outlined bg-white/90 hover:font-bold transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-full inline-block text-center "
                >
                  Sign In
                </a>
                <a
                  href="/sign-up"
                  className="p-button bg-pink-500 text-white font-medium rounded-full hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 text-center inline-block"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
