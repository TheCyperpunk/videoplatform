import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, BadgeCheck, Heart, Share2, Tag, Clock, Eye } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { fetchVideoById } from "@/lib/api";
import { formatViews, formatSubscribers, timeAgo } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const res = await fetchVideoById(id);
        if (!res.data) return { title: "Video Not Found – Videx" };
        const { video } = res.data;
        return {
            title: `${video.title} – Videx`,
            description: video.description,
            openGraph: {
                title: video.title,
                description: video.description,
                images: [{ url: video.thumbnail }],
            },
        };
    } catch {
        return { title: "Video Not Found – Videx" };
    }
}

export default async function WatchPage({ params }: Props) {
    const { id } = await params;
    let video;
    try {
        const res = await fetchVideoById(id);
        if (!res.data) notFound();
        video = res.data!.video;
    } catch {
        notFound();
    }

    return (
        <PageContainer className="py-4">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Player + metadata */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Player */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[#111111] group">
                        <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 70vw"
                            className="object-cover"
                        />
                        {/* Duration */}
                        <div className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-2 py-1 text-sm font-medium text-white flex items-center gap-1">
                            <Clock size={13} /> {video.duration}
                        </div>
                        {/* Quality */}
                        <div className="absolute top-3 right-3 rounded-md bg-[#FF3B3B] px-2 py-0.5 text-[10px] font-bold text-white uppercase font-syne">
                            {video.quality}
                        </div>
                        {/* Play overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                                <Play size={28} className="text-white ml-1" fill="white" />
                            </div>
                            <span className="rounded-full bg-black/60 px-4 py-1.5 text-xs text-[#888888] font-dm backdrop-blur-sm">
                                Preview only — no video source
                            </span>
                        </div>
                    </div>

                    {/* Title & actions */}
                    <div>
                        <h1 className="font-syne text-xl font-700 text-[#F5F5F5] leading-snug mb-2">
                            {video.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-4 text-sm text-[#888888]">
                                <span className="flex items-center gap-1.5">
                                    <Eye size={14} /> {formatViews(video.views)}
                                </span>
                                <span>{timeAgo(video.publishedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2 text-sm text-[#888888] hover:border-[#FF3B3B]/40 hover:text-[#FF3B3B] transition-all">
                                    <Heart size={14} /> {(video.likes / 1000).toFixed(0)}K
                                </button>
                                <button className="flex items-center gap-1.5 rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-4 py-2 text-sm text-[#888888] hover:border-[#2A2A2A] hover:text-[#F5F5F5] transition-all">
                                    <Share2 size={14} /> Share
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Channel info */}
                    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] p-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src={video.channel.avatar}
                                alt={video.channel.name}
                                width={44}
                                height={44}
                                className="rounded-full"
                            />
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-syne text-[#F5F5F5] font-600">{video.channel.name}</span>
                                    {video.channel.verified && (
                                        <BadgeCheck size={15} className="text-[#FF3B3B]" />
                                    )}
                                </div>
                                <p className="text-xs text-[#555555] font-dm">
                                    {formatSubscribers(video.channel.subscribers)}
                                </p>
                            </div>
                        </div>
                        <button className="rounded-full bg-gradient-to-r from-[#FF3B3B] to-[#FF7A00] px-5 py-2 text-sm font-600 text-white hover:opacity-90 transition-opacity">
                            Subscribe
                        </button>
                    </div>

                    {/* Description */}
                    <div className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] p-4">
                        <p className="text-sm text-[#888888] font-dm leading-relaxed">{video.description}</p>
                        {video.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                <Tag size={13} className="text-[#555555] mt-0.5 shrink-0" />
                                {video.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/search?q=${encodeURIComponent(tag)}`}
                                        className="rounded-full bg-[#111111] border border-[#2A2A2A] px-3 py-1 text-xs text-[#888888] hover:text-[#FF3B3B] hover:border-[#FF3B3B]/40 transition-all"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Related */}
                <div className="lg:w-80 xl:w-96 shrink-0">
                    {/* Related videos removed to match requested UI scope */}
                </div>
            </div>
        </PageContainer>
    );
}
