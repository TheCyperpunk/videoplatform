import { NextResponse } from "next/server";
import { searchVideos } from "@/lib/videos";
import type { SortOption } from "@/types/filters";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") ?? "";
        const category = searchParams.get("category") ?? undefined;
        const sort = (searchParams.get("sort") ?? "date") as SortOption;

        if (!q.trim()) {
            return NextResponse.json({ results: [], total: 0, query: q });
        }

        const results = searchVideos(q, category, sort);
        return NextResponse.json(
            { results, total: results.length, query: q },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
