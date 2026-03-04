import { NextResponse } from "next/server";
import { getVideoById, getRelatedVideos } from "@/lib/videos";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const video = getVideoById(id);
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }
        const related = getRelatedVideos(video, 10);
        return NextResponse.json(
            { video, related },
            { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
        );
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
