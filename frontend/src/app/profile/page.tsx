"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { VideoCardHorizontal } from "@/components/video/VideoCardHorizontal";
import { getAllVideos } from "@/lib/videos";
import {
    Settings,
    History,
    Heart,
    Bookmark,
    ChevronRight,
    Eye,
    ThumbsUp,
    BookmarkCheck,
} from "lucide-react";



export default function ProfilePage() {
    const suggested = getAllVideos().sort((a, b) => b.views - a.views).slice(0, 3);

    return (
        <PageContainer className="py-6 sm:py-8 space-y-6">
            {/* Profile header */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#111111] border border-[#2A2A2A] p-6 sm:p-8 flex flex-col items-center text-center gap-4 relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#FF3B3B]/10 to-transparent" />

                <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#FF3B3B] to-[#FF7A00] flex items-center justify-center text-3xl font-bold font-syne text-white shadow-[0_0_40px_rgba(255,59,59,0.4)] ring-4 ring-[#1A1A1A]">
                    V
                </div>
                <div className="relative">
                    <h1 className="font-syne text-2xl font-800 text-[#F5F5F5]">Videx User</h1>
                    <p className="text-sm text-[#888888] font-dm mt-1">Sign in to sync your watch history and preferences</p>
                </div>
                <button className="rounded-full bg-gradient-to-r from-[#FF3B3B] to-[#FF7A00] px-10 py-3 text-sm font-600 text-white hover:shadow-[0_0_30px_rgba(255,59,59,0.5)] transition-all duration-300 hover:scale-105">
                    Sign In
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                    { icon: Eye, label: "Watched", value: "0", color: "#FF3B3B" },
                    { icon: ThumbsUp, label: "Liked", value: "0", color: "#FF7A00" },
                    { icon: BookmarkCheck, label: "Saved", value: "0", color: "#00D4FF" },
                ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] p-4 sm:p-5 text-center hover:border-[#FF3B3B]/30 transition-all duration-300 group">
                        <div className="inline-flex items-center justify-center h-10 w-10 rounded-full mb-3" style={{ backgroundColor: `${color}15` }}>
                            <Icon size={20} style={{ color }} />
                        </div>
                        <p className="font-syne text-2xl font-700 text-[#F5F5F5] mb-1">{value}</p>
                        <p className="text-xs text-[#888888] font-dm">{label}</p>
                    </div>
                ))}
            </div>

            {/* Menu */}
            <div className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden divide-y divide-[#1F1F1F]">
                {[
                    { icon: History, label: "Watch History", desc: "Videos you've viewed", color: "#FF3B3B" },
                    { icon: Heart, label: "Liked Videos", desc: "Videos you've liked", color: "#FF7A00" },
                    { icon: Bookmark, label: "Saved", desc: "Your saved collection", color: "#00D4FF" },
                    { icon: Settings, label: "Settings", desc: "App preferences", color: "#888888" },
                ].map(({ icon: Icon, label, desc, color }) => (
                    <button
                        key={label}
                        className="w-full flex items-center gap-4 px-4 py-4 hover:bg-[#222222] transition-all duration-200 group"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#111111] border border-[#2A2A2A] group-hover:border-[#FF3B3B]/30 transition-all">
                            <Icon size={20} className="text-[#888888] group-hover:text-[#FF3B3B] transition-colors" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="font-dm text-sm font-500 text-[#F5F5F5] group-hover:text-[#FF3B3B] transition-colors">{label}</p>
                            <p className="font-dm text-xs text-[#888888]">{desc}</p>
                        </div>
                        <ChevronRight size={18} className="text-[#555555] group-hover:text-[#FF3B3B] group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
            </div>

            {/* Suggested */}
            <section>
                <h2 className="font-syne text-xl font-700 text-[#F5F5F5] mb-4 border-l-[3px] border-[#FF3B3B] pl-3">
                    Suggested For You
                </h2>
                <div className="flex flex-col gap-2">
                    {suggested.map((v) => (
                        <VideoCardHorizontal key={v.id} video={v} />
                    ))}
                </div>
            </section>
        </PageContainer>
    );
}
