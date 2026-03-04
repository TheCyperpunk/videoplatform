import Link from "next/link";
import { Home, Frown } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A]">
                <Frown size={36} className="text-[#555555]" />
            </div>
            <div>
                <h1 className="font-syne text-4xl font-800 gradient-text">404</h1>
                <h2 className="font-syne text-xl font-700 text-[#F5F5F5] mt-2">Page Not Found</h2>
                <p className="text-sm text-[#555555] font-dm mt-2 max-w-sm">
                    This page doesn&apos;t exist or may have been removed.
                </p>
            </div>
            <Link
                href="/"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF3B3B] to-[#FF7A00] px-6 py-3 text-sm font-600 text-white hover:opacity-90 transition-opacity"
            >
                <Home size={16} /> Back to Home
            </Link>
        </div>
    );
}
