import { PageContainer } from "@/components/layout/PageContainer";

export default function ProfileLoading() {
    return (
        <PageContainer className="py-6 sm:py-8 space-y-6">
            {/* Profile header skeleton */}
            <div className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-6 sm:p-8 flex flex-col items-center text-center gap-4">
                <div className="h-24 w-24 rounded-full bg-[#111111] shimmer" />
                <div className="space-y-2">
                    <div className="h-6 bg-[#111111] rounded w-32 mx-auto shimmer" />
                    <div className="h-4 bg-[#111111] rounded w-48 shimmer" />
                </div>
                <div className="h-11 bg-[#111111] rounded-full w-32 shimmer" />
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] p-4 sm:p-5 text-center">
                        <div className="h-10 w-10 rounded-full bg-[#111111] shimmer mx-auto mb-3" />
                        <div className="h-6 bg-[#111111] rounded w-8 mx-auto mb-1 shimmer" />
                        <div className="h-3 bg-[#111111] rounded w-16 mx-auto shimmer" />
                    </div>
                ))}
            </div>

            {/* Menu skeleton */}
            <div className="rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] overflow-hidden divide-y divide-[#1F1F1F]">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-4">
                        <div className="h-11 w-11 rounded-xl bg-[#111111] shimmer" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-[#111111] rounded w-32 shimmer" />
                            <div className="h-3 bg-[#111111] rounded w-40 shimmer" />
                        </div>
                        <div className="h-4 w-4 bg-[#111111] rounded shimmer" />
                    </div>
                ))}
            </div>

            {/* Suggested skeleton */}
            <section>
                <div className="h-6 bg-[#1A1A1A] rounded w-40 mb-4 shimmer" />
                <div className="flex flex-col gap-2">
                    {[...Array(3)].map((_, i) => (
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
            </section>
        </PageContainer>
    );
}
