import React from 'react'
import { Composition } from 'remotion'
import { CancanVideo } from './CancanVideo'

const DEFAULT_FPS = 30
const DEFAULT_DURATION_SECONDS = 60

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CancanVideo"
    component={CancanVideo}
    durationInFrames={DEFAULT_DURATION_SECONDS * DEFAULT_FPS}
    fps={DEFAULT_FPS}
    width={1080}
    height={1920}
    defaultProps={{
      audioUrl: '',
      subtitles: [],
    }}
  />
)
