import React from 'react'
import { AbsoluteFill, Audio, Img, useCurrentFrame, useVideoConfig } from 'remotion'

export interface Subtitle {
  word: string
  start: number
  end: number
}

export interface CancanVideoProps {
  audioUrl: string
  subtitles: Subtitle[]
  mascotImageUrl?: string | null
  durationInSeconds: number
}

const WINDOW_BEFORE = 5
const WINDOW_AFTER = 8

export const CancanVideo: React.FC<CancanVideoProps> = ({
  audioUrl,
  subtitles,
  mascotImageUrl,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const currentTime = frame / fps

  const currentIdx = subtitles.findIndex(
    (s) => currentTime >= s.start && currentTime < s.end,
  )

  // Fallback to last spoken word if between words
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
        background: 'linear-gradient(to bottom, #fef9c3, #ffffff)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Mascot */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {mascotImageUrl ? (
          <Img
            src={mascotImageUrl}
            style={{
              width: 280,
              height: 280,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '6px solid #facc15',
            }}
          />
        ) : (
          <div style={{ fontSize: 240, lineHeight: 1 }}>🦆</div>
        )}
      </div>

      {/* Subtitle area */}
      <div
        style={{
          position: 'absolute',
          top: 520,
          left: 60,
          right: 60,
          bottom: 160,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 14px',
          alignContent: 'flex-start',
          overflow: 'hidden',
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
                fontSize: isCurrent ? 72 : 62,
                fontWeight: 900,
                color: isCurrent ? '#1a1a1a' : isPast ? '#0f172a' : '#94a3b8',
                backgroundColor: isCurrent ? '#facc15' : 'transparent',
                padding: isCurrent ? '4px 14px' : '4px 4px',
                borderRadius: 12,
                lineHeight: 1.25,
                display: 'inline-block',
              }}
            >
              {sub.word}
            </span>
          )
        })}
      </div>

      {audioUrl ? <Audio src={audioUrl} /> : null}
    </AbsoluteFill>
  )
}
