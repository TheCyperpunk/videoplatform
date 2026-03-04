import { PageContainer } from "@/components/layout/PageContainer";

export default function WatchLoading() {
    return (
        <PageContainer className="py-4">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Player + metadata skeleton */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Player skeleton */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[#111111] shimmer" />

                    {/* Title skeleton */}
                    <div className="space-y-2">
                        <div className="h-6 bg-[#1A1A1A] rounded-lg w-3/4 shimmer" />
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                                <div className="h-4 bg-[#1A1A1A] rounded w-20 shimmer" />
                                <div className="h-4 bg-[#1A1A1A] rounded w-24 shimmer" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-9 bg-[#1A1A1A] rounded-full w-24 shimmer" />
                                <div className="h-9 bg-[#1A1A1A] rounded-full w-24 shimmer" />
                            </div>
                        </div>
                    </div>

                    {/* Channel skeleton */}
                    <div className="flex items-center gap-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] p-4">
                        <div className="h-11 w-11 rounded-full bg-[#111111] shimmer" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-[#111111] rounded w-32 shimmer" />
                            <div className="h-3 bg-[#111111] rounded w-24 shimmer" />
                        </div>
                        <div className="h-9 bg-[#111111] rounded-full w-28 shimmer" />
                    </div>

                    {/* Description skeleton */}
                    <div className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] p-4 space-y-2">
                        <div className="h-4 bg-[#111111] rounded w-full shimmer" />
                        <div className="h-4 bg-[#111111] rounded w-5/6 shimmer" />
                        <div className="h-4 bg-[#111111] rounded w-4/6 shimmer" />
                    </div>
                </div>

                {/* Right: Related videos skeleton */}
                <div className="w-full lg:w-80 xl:w-96 space-y-3">
                    <div className="h-5 bg-[#1A1A1A] rounded w-32 shimmer mb-4" />
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex gap-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] p-2">
                            <div className="w-40 aspect-video rounded-lg bg-[#111111] shimmer shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-[#111111] rounded w-full shimmer" />
                                <div className="h-3 bg-[#111111] rounded w-4/5 shimmer" />
                                <div className="h-3 bg-[#111111] rounded w-20 shimmer" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
}
