"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function AgeVerificationModal() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Policy pages where modal should not show
        const policyPages = ["/terms", "/contact", "/privacy", "/dmca"];
        const isPolicyPage = policyPages.includes(pathname);
        
        if (isPolicyPage) {
            setIsOpen(false);
            document.body.style.overflow = "auto";
            return;
        }

        // Check verification status
        let verified = false;
        try {
            verified = sessionStorage.getItem("videx_age_verified") === "true";
        } catch (e) {
            // If sessionStorage fails, don't show modal
            verified = true;
        }

        setIsOpen(!verified);
        document.body.style.overflow = verified ? "auto" : "hidden";

        // Cleanup
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [pathname]);

    const handleAccept = () => {
        try {
            sessionStorage.setItem("videx_age_verified", "true");
        } catch (e) {
            console.error("Failed to save verification:", e);
        }
        setIsOpen(false);
        document.body.style.overflow = "auto";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
            <div className="relative w-full max-w-[540px] bg-[#0A0A0A] border border-neutral-800 rounded-lg shadow-2xl p-4 sm:p-6 flex flex-col my-4 sm:my-8 font-sans mx-2 sm:mx-0">
                
                {/* Header */}
                <div className="flex items-start sm:items-center gap-3 mb-4 sm:mb-5">
                    <div className="flex-shrink-0 w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] bg-[#d32f2f] rounded-full flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-lg">
                        18+
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                        Desimallu is an ADULTS ONLY website!
                    </h1>
                </div>

                {/* Content */}
                <div className="space-y-3 sm:space-y-4 text-neutral-300 text-xs sm:text-[13px] leading-[1.5] sm:leading-[1.6]">
                    <p>
                        You are about to enter a website that contains explicit material (pornography). 
                        This website should only be accessed if you are at least 18 years old or of legal 
                        age to view such material in your local jurisdiction, whichever is greater. 
                        Furthermore, you represent and warrant that you will not allow any minor access 
                        to this site or services.
                    </p>

                    <p>
                        PARENTS, PLEASE BE ADVISED: If you are a parent, it is your responsibility to 
                        keep any age-restricted content from being displayed to your children or wards. 
                        Protect your children from adult content and block access to this site by using 
                        parental controls. We use the &quot;Restricted To Adults&quot; (RTA) website label to 
                        better enable parental filtering. Parental tools that are compatible with the RTA 
                        label will block access to this site.{" "}
                        <Link 
                            href="https://www.rtalabel.org/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline hover:text-white transition-colors"
                        >
                            More information about the RTA Label and compatible services can be found here.
                        </Link>
                    </p>

                    <p className="pt-1">Other steps you can take to protect your children are:</p>
                    <ul className="list-disc pl-4 sm:pl-5 mt-1 space-y-1">
                        <li>Use family filters of your operating systems and/or browsers;</li>
                        <li>
                            When using a search engine such as Google, Bing or Yahoo; check the safe 
                            search settings where you can exclude adult content sites from your search results;
                        </li>
                        <li>Ask your internet service provider if they offer additional filters;</li>
                    </ul>
                </div>

                {/* Button */}
                <div className="mt-5 sm:mt-6 flex flex-col items-center">
                    <button 
                        onClick={handleAccept}
                        className="w-full bg-[#008f39] hover:bg-[#00732e] text-white font-medium py-2.5 sm:py-3 rounded transition-colors"
                    >
                        <span className="block text-sm sm:text-[15px]">I am 18+</span>
                        <span className="block text-base sm:text-[17px] font-bold mt-0.5">ENTER</span>
                    </button>
                    <p className="mt-3 sm:mt-4 text-neutral-400 text-[11px] sm:text-[12px] text-center px-2 sm:text-left sm:px-0">
                        When accessing this site you agree to <Link href="/terms?from=modal" target="_blank" rel="noopener noreferrer" className="text-[#c18621] hover:underline">our terms of use</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
