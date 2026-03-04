export default function HomeLoading() {
    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            {/* Header skeleton */}
            <div className="border-b border-[#1A1A1A] bg-[#0A0A0A]/95 backdrop-blur-sm sticky top-14 z-40">
                <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-4">
                    <div className="h-8 bg-[#1A1A1A] rounded-lg w-48 mb-4 shimmer" />

                    {/* Category pills skeleton */}
                    <div className="flex gap-2 overflow-hidden pb-2">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="h-8 bg-[#1A1A1A] rounded-full w-24 shimmer shrink-0" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid skeleton */}
            <div className="max-w-[2000px] mx-auto px-4 sm:px-6 py-6">
                <div className="grid gap-x-3 gap-y-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                    {[...Array(120)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            {/* Thumbnail skeleton */}
                            <div className="aspect-video rounded-md bg-[#1A1A1A] shimmer" />

                            {/* Info skeleton */}
                            <div className="flex gap-2">
                                <div className="h-9 w-9 rounded-full bg-[#1A1A1A] shimmer shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-[#1A1A1A] rounded w-full shimmer" />
                                    <div className="h-3 bg-[#1A1A1A] rounded w-3/4 shimmer" />
                                    <div className="h-3 bg-[#1A1A1A] rounded w-1/2 shimmer" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
