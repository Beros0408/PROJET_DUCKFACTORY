import React from 'react'
import { AbsoluteFill, Audio, Img, useCurrentFrame, useVideoConfig } from 'remotion'

export interface Subtitle {
  word: string
  start: number
  end: number
}

const MASCOT_URL =
  'https://jcsrirxscnazngyjufai.supabase.co/storage/v1/object/public/assets/cancan-mascot.png'

export interface CancanVideoProps {
  audioUrl: string
  subtitles: Subtitle[]
  mascotImageUrl?: string
}

const WINDOW_BEFORE = 5
const WINDOW_AFTER = 8

export const CancanVideo: React.FC<CancanVideoProps> = ({
  audioUrl,
  subtitles,
  mascotImageUrl = MASCOT_URL,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  // Subtle oscillation: slight rotation + gentle vertical bob
  const oscillationY = Math.sin(frame * 0.08) * 6
  const oscillationRot = Math.sin(frame * 0.06) * 2

  const currentIdx = subtitles.findIndex(
    (s) => currentTime >= s.start && currentTime < s.end,
  )

  const refIdx = (() => {
    if (currentIdx >= 0) return currentIdx
    let last = -1
    for (let i = 0; i < subtitles.length; i++) {
      if (subtitles[i].end <= currentTime) last = i
    }
    return last
  })()

  const startIdx = Math.max(0, refIdx - WINDOW_BEFORE)
  const endIdx = Math.min(subtitles.length, refIdx + WINDOW_AFTER + 1)
  const visibleWords = subtitles.slice(startIdx, endIdx)

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #fef3c7, #ffffff)',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
      }}
    >
      {/* Mascot image (500px wide, centered, animated) */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `translateY(${oscillationY}px) rotate(${oscillationRot}deg)`,
        }}
      >
        {mascotImageUrl ? (
          <Img
            src={mascotImageUrl}
            style={{
              width: 500,
              height: 'auto' as unknown as number,
              borderRadius: 24,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
          />
        ) : (
          <span style={{ fontSize: 300, lineHeight: 1 }}>🦆</span>
        )}
      </div>

      {/* Subtitle area — starts 80px below mascot (~500px tall) */}
      <div
        style={{
          position: 'absolute',
          top: 660,
          left: 40,
          right: 40,
          bottom: 120,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px 16px',
          alignContent: 'flex-start',
          overflow: 'hidden',
          padding: '0 40px',
        }}
      >
        {visibleWords.map((sub, i) => {
          const globalIdx = startIdx + i
          const isCurrent = globalIdx === currentIdx
          const isPast = currentTime >= sub.end && globalIdx !== currentIdx

          return (
            <span
              key={globalIdx}
              style={{
                fontSize: 56,
                fontWeight: 800,
                lineHeight: 1.4,
                color: isCurrent ? '#1a1a1a' : isPast ? '#0f172a' : '#94a3b8',
                backgroundColor: isCurrent ? '#facc15' : 'transparent',
                padding: isCurrent ? '4px 16px' : '4px 4px',
                borderRadius: 14,
                display: 'inline-block',
                transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                transformOrigin: 'left center',
              }}
            >
              {sub.word}
            </span>
          )
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 24,
          fontWeight: 400,
          color: '#cbd5e1',
          letterSpacing: 1,
        }}
      >
        DuckFactory.app
      </div>

      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  )
}
