import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Play } from "lucide-react";
import type { Video } from "@/types/video";
import { formatViewsShort, timeAgo, truncate } from "@/lib/utils";

interface VideoCardHorizontalProps {
    video: Video;
    className?: string;
}

export function VideoCardHorizontal({ video, className }: VideoCardHorizontalProps) {
    return (
        <a
            href={video.source_url || `#`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: 'flex',
                gap: '12px',
                padding: '8px',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1A1A1A')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            className={`group ${className ?? ""}`}
        >
            {/* Thumbnail */}
            <div style={{
                position: 'relative',
                flexShrink: 0,
                width: '144px',
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#111'
            }}>
                <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="144px"
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-300"
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                }} className="group-hover:opacity-100">
                    <Play size={18} color="white" fill="white" />
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: '2px 4px',
                    fontSize: '10px',
                    fontWeight: '500',
                    color: 'white'
                }}>
                    {video.duration}
                </div>
            </div>

            {/* Info */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: 0
            }}>
                <h4 style={{
                    fontFamily: 'sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#F5F5F5',
                    margin: '0 0 4px 0',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {truncate(video.title, 60)}
                </h4>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: '#888888'
                }}>
                    <span>{video.channel.name}</span>
                    {video.channel.verified && (
                        <BadgeCheck size={11} color="#FF3B3B" />
                    )}
                </div>
                <p style={{
                    fontSize: '12px',
                    color: '#555555',
                    margin: '2px 0 0 0'
                }}>
                    {formatViewsShort(video.views)} · {timeAgo(video.publishedAt)}
                </p>
            </div>
        </a>
    );
}
