import Image from "next/image";
import Link from "next/link";
import type { Video } from "@/types/video";

interface LiveVideoCardProps {
    video: Video;
    className?: string;
}

// Generate a random duration in format "1:01 / 5:08"
const getRandomDuration = () => {
    const mins1 = Math.floor(Math.random() * 5);
    const secs1 = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    const mins2 = mins1 + Math.floor(Math.random() * 10) + 1;
    const secs2 = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    return `${mins1}:${secs1} / ${mins2}:${secs2}`;
};

export function LiveVideoCard({ video, className }: LiveVideoCardProps) {
    const durationStr = video.duration || getRandomDuration();

    return (
        <a
            href={video.source_url || `#`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: 'block',
                textDecoration: 'none',
            }}
            aria-label={`Watch ${video.title}`}
        >
            {/* Thumbnail */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    backgroundColor: '#111',
                    marginBottom: '8px',
                    borderRadius: '12px', // CURVED EDGES
                    overflow: 'hidden'
                }}
            >
                <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                />

                {/* Duration overlay (bottom right) */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '600',
                        fontFamily: 'sans-serif'
                    }}
                >
                    <span style={{ fontWeight: 800, fontStyle: 'italic', letterSpacing: '1px' }}>HD</span>
                    <span>{durationStr}</span>
                </div>
            </div>

            {/* Title only */}
            <h3
                style={{
                    color: '#CCCCCC',
                    fontSize: '14px',
                    margin: '0',
                    padding: '0',
                    fontFamily: 'sans-serif',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}
            >
                {video.title}
            </h3>
        </a>
    );
}
