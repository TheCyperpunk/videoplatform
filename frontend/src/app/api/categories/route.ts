import { NextResponse } from "next/server";
import { getAllCategories } from "@/lib/videos";

export async function GET() {
    try {
        const categories = getAllCategories();
        return NextResponse.json(
            categories,
            { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
        );
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
