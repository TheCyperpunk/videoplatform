import { NextResponse } from "next/server";
import { getTrendingVideos } from "@/lib/videos";

export async function GET() {
    try {
        const videos = getTrendingVideos();
        return NextResponse.json(
            { videos, updatedAt: new Date().toISOString() },
            { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" } }
        );
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
