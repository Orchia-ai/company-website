export type DemoChapter = 'Generate' | 'Improve' | 'Grow' | 'Collaborate'

export type DemoBeatId =
  | 'ready'
  | 'run_v1'
  | 'play_v1'
  | 'human_feedback'
  | 'feedback_sent'
  | 'evolve'
  | 'run_v2'
  | 'play_v2'
  | 'growth'
  | 'team'
  | 'final_hold'
  | 'loop_reset'

export type DemoBeat = {
  id: DemoBeatId
  chapter: DemoChapter
  start: number
  end: number
  eyebrow: string
  headline: string
  detail: string
}

export const DEMO_BEATS: readonly DemoBeat[] = [
  {
    id: 'ready',
    chapter: 'Generate',
    start: 0,
    end: 1_200,
    eyebrow: 'Feature 01 · End-to-end generation',
    headline: 'One workflow. One finished video.',
    detail: 'A simple production graph takes the project from brief to final output.',
  },
  {
    id: 'run_v1',
    chapter: 'Generate',
    start: 1_200,
    end: 5_200,
    eyebrow: 'Version 1 · Running',
    headline: 'Every step runs in one connected flow.',
    detail: 'Story, frames, and video generation complete in sequence.',
  },
  {
    id: 'play_v1',
    chapter: 'Generate',
    start: 5_200,
    end: 9_500,
    eyebrow: 'Version 1 · Ready',
    headline: 'The output is a video, not another handoff.',
    detail: 'The finished result plays directly from the Output node.',
  },
  {
    id: 'human_feedback',
    chapter: 'Improve',
    start: 9_500,
    end: 12_500,
    eyebrow: 'Feature 02 · Human feedback',
    headline: 'The person decides what should change.',
    detail: 'No agent action appears before the feedback is visibly sent.',
  },
  {
    id: 'feedback_sent',
    chapter: 'Improve',
    start: 12_500,
    end: 14_000,
    eyebrow: 'Feedback received',
    headline: 'Orchia turns direction into a workflow change.',
    detail: 'Character consistency becomes an explicit production step.',
  },
  {
    id: 'evolve',
    chapter: 'Improve',
    start: 14_000,
    end: 16_800,
    eyebrow: 'Workflow v2',
    headline: 'A new Character Lock step joins the graph.',
    detail: 'The same canvas evolves without becoming a different system.',
  },
  {
    id: 'run_v2',
    chapter: 'Improve',
    start: 16_800,
    end: 20_500,
    eyebrow: 'Version 2 · Rerunning',
    headline: 'The revised workflow generates the next version.',
    detail: 'The new identity constraint now participates in every downstream shot.',
  },
  {
    id: 'play_v2',
    chapter: 'Improve',
    start: 20_500,
    end: 25_000,
    eyebrow: 'Version 2 · Ready',
    headline: 'Feedback becomes a visible result.',
    detail: 'The regenerated video plays with a more consistent cinematic treatment.',
  },
  {
    id: 'growth',
    chapter: 'Grow',
    start: 25_000,
    end: 32_500,
    eyebrow: 'Feature 03 · Results over time',
    headline: 'The workflow improves. The numbers do too.',
    detail: 'Later projects earn more views and likes—shown with the original Demo 2 chart language.',
  },
  {
    id: 'team',
    chapter: 'Collaborate',
    start: 32_500,
    end: 38_500,
    eyebrow: 'Feature 04 · Shared production',
    headline: 'Bring more people into the same workflow.',
    detail: 'The workflow stays clean while the team grows in a dedicated list beside it.',
  },
  {
    id: 'final_hold',
    chapter: 'Collaborate',
    start: 38_500,
    end: 41_000,
    eyebrow: 'Orchia',
    headline: 'One workflow. More people in control.',
    detail: 'The production stays simple while the team grows beside it.',
  },
  {
    id: 'loop_reset',
    chapter: 'Collaborate',
    start: 41_000,
    end: 42_000,
    eyebrow: 'Orchia',
    headline: 'Ready for the next project.',
    detail: 'Resetting beneath the grid cover.',
  },
] as const

export const DEMO_DURATION = DEMO_BEATS.at(-1)?.end ?? 42_000

export const DEMO_CHAPTERS = [
  { label: 'Generate', start: 0, end: 9_500 },
  { label: 'Improve', start: 9_500, end: 25_000 },
  { label: 'Grow', start: 25_000, end: 32_500 },
  { label: 'Collaborate', start: 32_500, end: DEMO_DURATION },
] as const

export type GrowthProject = {
  id: 1 | 2 | 3
  date: string
  title: string
  thumbnail: string
  views: number
  likes: number
}

export const GROWTH_PROJECTS: readonly GrowthProject[] = [
  {
    id: 1,
    date: '07-07',
    title: 'The flowerpot reveal',
    thumbnail: '/data-slides/thumbnails/07-07.jpg',
    views: 4_563,
    likes: 178,
  },
  {
    id: 2,
    date: '07-12',
    title: 'The moon reveal',
    thumbnail: '/data-slides/thumbnails/07-12-moon.jpg',
    views: 202_000,
    likes: 1_013,
  },
  {
    id: 3,
    date: '07-14',
    title: 'The imported flowerpot',
    thumbnail: '/data-slides/thumbnails/07-14-import.jpg',
    views: 1_450_000,
    likes: 5_515,
  },
] as const

export const VERSION_MEDIA = {
  1: {
    src: 'https://tm9ilj7n5ftxczdh.public.blob.vercel-storage.com/company-site/videos/workflow/batch-1-JQykqHAIbhOuw2t7gs0W2Aoe6psV5e.mp4',
    poster: '/workflow-iteration-demo/batch-1-poster.jpg',
    label: 'Version 1',
  },
  2: {
    src: 'https://tm9ilj7n5ftxczdh.public.blob.vercel-storage.com/company-site/videos/workflow/batch-2-preview-4XqSpZKJ2JvvivbkD5CsLXQkQhbSRk.mp4',
    poster: '/workflow-iteration-demo/batch-2-preview-poster.jpg',
    label: 'Version 2',
  },
} as const
