import { NextResponse } from "next/server";
import { getPaginatedVideos } from "@/lib/videos";
import { SearchParamsSchema } from "@/lib/validations";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const parsed = SearchParamsSchema.safeParse({
            page: searchParams.get("page"),
            limit: searchParams.get("limit"),
            category: searchParams.get("category"),
            sort: searchParams.get("sort"),
            quality: searchParams.get("quality"),
        });

        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid query params" }, { status: 400 });
        }

        const { page, limit, category, sort, quality } = parsed.data;
        const result = getPaginatedVideos(page, limit, category, sort, quality);

        return NextResponse.json(
            { data: result.data, total: result.total, page, limit, hasMore: result.hasMore, error: null },
            { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
        );
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
