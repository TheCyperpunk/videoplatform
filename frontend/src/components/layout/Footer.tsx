"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] mt-auto">
      <div className="max-w-[1800px] mx-auto px-5 py-6">
        
        {/* Top Section: RTA Notice */}
        <div className="mb-6">
          <div className="bg-[#0A0A0A] border border-white rounded-2xl p-4 max-w-md">
            <div className="flex items-start gap-3">
              <div>
                <h3 className="text-white font-semibold text-base mb-2 flex items-center gap-2">
                  <span className="text-lg">⚠</span> Parents
                </h3>
                <p className="text-white text-sm leading-relaxed">
                  Desimallu.com uses the "Restricted To Adults" (RTA) website label to better enable parental filtering. 
                  Protect your children from adult content and block access to this site by using parental controls.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Logo/Copyright Left, Links Right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Left: Logo and Copyright */}
          <div className="flex flex-col">
            <Link href="/" className="inline-flex items-center no-underline mb-2 w-fit">
              <img 
                src="/large-Photoroom.png" 
                alt="Desimallu" 
                className="h-5 sm:h-6 md:h-6.5 lg:h-7 w-auto"
              />
            </Link>
            <p className="text-white text-xs">
              © {new Date().getFullYear()} Desimallu.com. All rights reserved.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
            <Link 
              href="/terms"
              className="text-white hover:underline hover:scale-105 transition-all duration-200"
            >
              Terms of Service
            </Link>
            <Link 
              href="/dmca"
              className="text-white hover:underline hover:scale-105 transition-all duration-200"
            >
              DMCA / Content Removal
            </Link>
            <Link 
              href="/contact"
              className="text-white hover:underline hover:scale-105 transition-all duration-200"
            >
              Contact Us
            </Link>
            <Link 
              href="/privacy"
              className="text-white hover:underline hover:scale-105 transition-all duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
