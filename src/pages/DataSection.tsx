import { useLayoutEffect, useRef, useState } from 'react'

import styles from './home-film-page.module.css'

const DATA_CANVAS_WIDTH = 1600
const DATA_CANVAS_HEIGHT = 900

const CHART_WIDTH = 1504
const CHART_HEIGHT = 680
const PLOT_LEFT = 78
const PLOT_RIGHT = 1484
const PLOT_TOP = 54
const PLOT_BOTTOM = 470

const FOLLOWER_TREND = [
  220, 220, 225, 225, 225, 225, 290, 310, 345, 345,
  380, 455, 500, 550, 560, 615, 870, 1025, 1090, 1130,
  1165, 1180, 1210, 1335, 1425, 1480, 1500, 1535, 1580, 1615,
] as const

type Metric = 'overview' | 'views' | 'likesSaves' | 'ca'
type VideoMetric = Exclude<Metric, 'overview'>

type VideoDatum = {
  date: string
  title: string
  views: number
  viewsDisplay: string
  likes: number
  saves: number
  likesSaves: number
  ca: number
  thumbnail: string
}

type MetricConfig = {
  max: number
  threshold: number | null
  thresholdLabel: string
  ticks: readonly { value: number; label: string }[]
  summary: readonly { value: string; label: string }[]
}

const METRICS: readonly { key: Metric; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'views', label: 'Views' },
  { key: 'likesSaves', label: 'Likes + saves' },
  { key: 'ca', label: 'Completion rate' },
]

const VIDEO_DATA: readonly VideoDatum[] = [
  {
    date: '07-07',
    title: 'She changed one flowerpot, and suddenly everyone was chasing her',
    views: 4563,
    viewsDisplay: '4,563',
    likes: 178,
    saves: 157,
    likesSaves: 335,
    ca: 21,
    thumbnail: '/data-slides/thumbnails/07-07.jpg',
  },
  {
    date: '07-09',
    title: 'The moment my mother-in-law made the cut, I thought I was finished',
    views: 4528,
    viewsDisplay: '4,528',
    likes: 104,
    saves: 76,
    likesSaves: 180,
    ca: 44,
    thumbnail: '/data-slides/thumbnails/07-09.jpg',
  },
  {
    date: '07-12',
    title: 'Was she only a stand-in for his true love?',
    views: 202000,
    viewsDisplay: '202K',
    likes: 1013,
    saves: 387,
    likesSaves: 1400,
    ca: 60,
    thumbnail: '/data-slides/thumbnails/07-12-moon.jpg',
  },
  {
    date: '07-12',
    title: 'He gave my thorn to his sister, so I made him return it in public',
    views: 5214,
    viewsDisplay: '5,214',
    likes: 123,
    saves: 90,
    likesSaves: 213,
    ca: 49,
    thumbnail: '/data-slides/thumbnails/07-12-thorn.jpg',
  },
  {
    date: '07-14',
    title: 'Your brother wants an imported flowerpot',
    views: 1445000,
    viewsDisplay: '1.45M',
    likes: 5515,
    saves: 1348,
    likesSaves: 6863,
    ca: 67,
    thumbnail: '/data-slides/thumbnails/07-14-import.jpg',
  },
  {
    date: '07-14',
    title: 'The money tree paternity test',
    views: 5605,
    viewsDisplay: '5,605',
    likes: 87,
    saves: 33,
    likesSaves: 120,
    ca: 43,
    thumbnail: '/data-slides/thumbnails/07-14-money.jpg',
  },
  {
    date: '07-16',
    title: 'No favor from His Majesty',
    views: 185000,
    viewsDisplay: '185K',
    likes: 1570,
    saves: 387,
    likesSaves: 1957,
    ca: 65,
    thumbnail: '/data-slides/thumbnails/07-16.jpg',
  },
  {
    date: '07-23',
    title: 'I returned with 99 doubles to reclaim my home',
    views: 633000,
    viewsDisplay: '633K',
    likes: 1913,
    saves: 316,
    likesSaves: 2229,
    ca: 40,
    thumbnail: '/data-slides/thumbnails/07-23.jpg',
  },
  {
    date: '07-25',
    title: 'I built this road myself after leaving you',
    views: 605000,
    viewsDisplay: '605K',
    likes: 5299,
    saves: 920,
    likesSaves: 6219,
    ca: 45,
    thumbnail: '/data-slides/thumbnails/07-25.jpg',
  },
  {
    date: '07-28',
    title: 'He said the sun would kill me',
    views: 273000,
    viewsDisplay: '273K',
    likes: 553,
    saves: 86,
    likesSaves: 639,
    ca: 55,
    thumbnail: '/data-slides/thumbnails/07-28.jpg',
  },
]

const METRIC_CONFIGS: Record<VideoMetric, MetricConfig> = {
  views: {
    max: 1500000,
    threshold: 100000,
    thresholdLabel: '100K benchmark',
    ticks: [
      { value: 0, label: '0' },
      { value: 500000, label: '500K' },
      { value: 1000000, label: '1M' },
      { value: 1500000, label: '1.5M' },
    ],
    summary: [
      { value: '10', label: 'videos' },
      { value: '3.36M', label: 'total views' },
      { value: '6 / 10', label: 'reached 100K+' },
    ],
  },
  likesSaves: {
    max: 7000,
    threshold: 1000,
    thresholdLabel: '1,000 benchmark',
    ticks: [
      { value: 0, label: '0' },
      { value: 2000, label: '2,000' },
      { value: 4000, label: '4,000' },
      { value: 6000, label: '6,000' },
    ],
    summary: [
      { value: '10', label: 'videos' },
      { value: '20,155', label: 'likes + saves' },
      { value: '5 / 10', label: 'reached 1,000+' },
    ],
  },
  ca: {
    max: 100,
    threshold: null,
    thresholdLabel: '',
    ticks: [
      { value: 0, label: '0%' },
      { value: 25, label: '25%' },
      { value: 50, label: '50%' },
      { value: 75, label: '75%' },
      { value: 100, label: '100%' },
    ],
    summary: [
      { value: '10', label: 'videos' },
      { value: '48.9%', label: 'average completion' },
      { value: '67%', label: 'highest' },
    ],
  },
}

const numberFormatter = new Intl.NumberFormat('en-US')

function valueFor(item: VideoDatum, metric: VideoMetric) {
  if (metric === 'views') return item.views
  if (metric === 'likesSaves') return item.likesSaves
  return item.ca
}

function displayFor(item: VideoDatum, metric: VideoMetric) {
  if (metric === 'views') return item.viewsDisplay
  if (metric === 'likesSaves') return numberFormatter.format(item.likesSaves)
  return `${item.ca}%`
}

function FollowerTrendChart() {
  const width = 1504
  const height = 560
  const left = 88
  const right = 1470
  const top = 30
  const bottom = 504
  const max = 2000
  const xFor = (index: number) => left + (index / (FOLLOWER_TREND.length - 1)) * (right - left)
  const yFor = (value: number) => bottom - (value / max) * (bottom - top)
  const points = FOLLOWER_TREND.map((value, index) => ({ x: xFor(index), y: yFor(value) }))
  const linePath = points.slice(1).reduce((path, point, index) => {
    const previous = points[index]
    const midX = (previous.x + point.x) / 2
    return `${path} C ${midX} ${previous.y}, ${midX} ${point.y}, ${point.x} ${point.y}`
  }, `M ${points[0].x} ${points[0].y}`)
  const areaPath = `${linePath} L ${points.at(-1)?.x} ${bottom} L ${points[0].x} ${bottom} Z`
  const yTicks = [0, 500, 1000, 1500, 2000] as const
  const xTicks = [0, 5, 10, 15, 20, 25, 29] as const
  const keyPoints = new Set([0, 15, 17, 23, 29])

  return (
    <svg
      className={styles.followerTrendChart}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby="follower-trend-title follower-trend-description"
    >
      <title id="follower-trend-title">Follower growth from July 1 through July 30</title>
      <desc id="follower-trend-description">
        Approximate account growth from 220 followers on July 1 to 1,615 on July 30, with the largest increase around July 17.
      </desc>
      <defs>
        <linearGradient id="follower-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff4fa3" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ff4fa3" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {yTicks.map((tick) => {
        const y = yFor(tick)
        return (
          <g key={tick}>
            <line className={styles.trendGrid} x1={left} x2={right} y1={y} y2={y} />
            <text className={styles.trendTick} x={left - 18} y={y + 5} textAnchor="end">
              {numberFormatter.format(tick)}
            </text>
          </g>
        )
      })}

      {xTicks.map((index) => (
        <text className={styles.trendTick} key={index} x={xFor(index)} y={bottom + 35} textAnchor="middle">
          07-{String(index + 1).padStart(2, '0')}
        </text>
      ))}

      <path className={styles.trendArea} d={areaPath} />
      <path className={styles.trendLineOutline} d={linePath} />
      <path className={styles.trendLine} d={linePath} />

      {points.map((point, index) => keyPoints.has(index) ? (
        <circle className={styles.trendPoint} cx={point.x} cy={point.y} key={index} r="6" />
      ) : null)}

      <g transform={`translate(${points.at(-1)?.x ?? 0} ${points.at(-1)?.y ?? 0})`}>
        <rect className={styles.trendEndLabelBox} x="-76" y="-46" width="76" height="30" />
        <text className={styles.trendEndLabel} x="-38" y="-26" textAnchor="middle">1,615</text>
      </g>
    </svg>
  )
}

function VideoChart({ metric }: { metric: VideoMetric }) {
  const config = METRIC_CONFIGS[metric]
  const plotHeight = PLOT_BOTTOM - PLOT_TOP
  const slot = (PLOT_RIGHT - PLOT_LEFT) / VIDEO_DATA.length
  const barWidth = 92
  const thumbnailWidth = 84
  const thumbnailHeight = 112
  const thumbnailY = PLOT_BOTTOM + 18

  const yFor = (value: number) => PLOT_BOTTOM - (value / config.max) * plotHeight

  return (
    <div className={styles.chartPanel}>
      <svg
        className={styles.dataChart}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        role="img"
        aria-labelledby="data-chart-title data-chart-description"
      >
        <title id="data-chart-title">Performance comparison across 10 videos</title>
        <desc id="data-chart-description">
          Videos run chronologically from left to right. Each bar represents one video. Switch among views, likes and saves, and completion rate; thumbnails and dates identify each post.
        </desc>

        {config.ticks.map((tick) => {
          const y = yFor(tick.value)
          return (
            <g key={tick.value}>
              <line
                className={tick.value === 0 ? styles.chartBaseline : styles.chartGrid}
                x1={PLOT_LEFT}
                x2={PLOT_RIGHT}
                y1={y}
                y2={y}
              />
              <text className={styles.chartTick} x={PLOT_LEFT - 14} y={y + 5} textAnchor="end">
                {tick.label}
              </text>
            </g>
          )
        })}

        {config.threshold !== null ? (
          <g>
            <line
              className={styles.chartThreshold}
              x1={PLOT_LEFT}
              x2={PLOT_RIGHT}
              y1={yFor(config.threshold)}
              y2={yFor(config.threshold)}
            />
            <text
              className={styles.chartThresholdLabel}
              x={PLOT_LEFT + 8}
              y={yFor(config.threshold) - 10}
              textAnchor="start"
            >
              {config.thresholdLabel}
            </text>
          </g>
        ) : null}

        {VIDEO_DATA.map((item, index) => {
          const value = valueFor(item, metric)
          const centerX = PLOT_LEFT + slot * index + slot / 2
          const y = yFor(value)
          const belowThreshold = config.threshold !== null && value < config.threshold
          const ariaLabel = `${item.date}, ${item.title}: ${item.viewsDisplay} views, ${numberFormatter.format(item.likes)} likes, ${numberFormatter.format(item.saves)} saves, ${item.ca}% completion rate.`

          return (
            <g key={`${item.date}-${item.title}`} role="group" aria-label={ariaLabel}>
              <title>{item.title}</title>
              <rect
                className={styles.chartBar}
                x={centerX - barWidth / 2}
                y={y}
                width={barWidth}
                height={PLOT_BOTTOM - y}
                opacity={belowThreshold ? 0.34 : 1}
              />
              <text
                className={styles.chartValue}
                x={centerX}
                y={Math.max(22, y - 12)}
                textAnchor="middle"
              >
                {displayFor(item, metric)}
              </text>
              <image
                href={item.thumbnail}
                x={centerX - thumbnailWidth / 2}
                y={thumbnailY}
                width={thumbnailWidth}
                height={thumbnailHeight}
                preserveAspectRatio="xMidYMid slice"
                aria-label={item.title}
              />
              <rect
                className={styles.chartThumbnailFrame}
                x={centerX - thumbnailWidth / 2}
                y={thumbnailY}
                width={thumbnailWidth}
                height={thumbnailHeight}
              />
              <text className={styles.chartDate} x={centerX} y={thumbnailY + thumbnailHeight + 24} textAnchor="middle">
                {item.date}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function AccessibleDataTable() {
  return (
    <div className={styles.srOnly}>
      <table>
        <caption>Performance data for 10 videos</caption>
        <thead>
          <tr>
            <th>Published</th>
            <th>Title</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Saves</th>
            <th>Likes + saves</th>
            <th>Completion rate</th>
          </tr>
        </thead>
        <tbody>
          {VIDEO_DATA.map((item) => (
            <tr key={`${item.date}-${item.title}`}>
              <td>{item.date}</td>
              <td>{item.title}</td>
              <td>{item.viewsDisplay}</td>
              <td>{numberFormatter.format(item.likes)}</td>
              <td>{numberFormatter.format(item.saves)}</td>
              <td>{numberFormatter.format(item.likesSaves)}</td>
              <td>{item.ca}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DataSection() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [metric, setMetric] = useState<Metric>('overview')
  const metricConfig = metric === 'overview' ? null : METRIC_CONFIGS[metric]

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    if (!canvas || !host) return

    const fitCanvas = () => {
      const scale = Math.min(
        host.clientWidth / DATA_CANVAS_WIDTH,
        host.clientHeight / DATA_CANVAS_HEIGHT,
      )
      canvas.style.setProperty('--data-scale', String(scale))
    }

    fitCanvas()
    const observer = new ResizeObserver(fitCanvas)
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.dataSection} id="data" aria-label="Production data">
      <article className={styles.slideMount}>
        <div className={styles.dataCanvas} ref={canvasRef}>
          <header className={styles.dataSlideHeader}>
            <span className={styles.dataSlideTitle}>Production data / Social performance · July 2026</span>
            <div className={styles.dataFreshness}>
              <span className={styles.dataFreshnessDot} aria-hidden="true" />
              <span className={styles.dataFreshnessText}>
                Synced directly from our RedNote account · <time dateTime="2026-08-01">Updated Aug 1, 2026</time>
              </span>
              <span className={styles.dataInfo}>
                <button
                  className={styles.dataInfoButton}
                  type="button"
                  aria-label="About this data source"
                  aria-describedby="data-source-note"
                >
                  i
                </button>
                <span className={styles.dataInfoTooltip} id="data-source-note" role="tooltip">
                  First-party performance data synced directly from Orchia&apos;s RedNote account. Figures reflect the latest account snapshot from Aug 1, 2026; the follower curve is a visual reconstruction of the source chart.
                </span>
              </span>
            </div>
          </header>

          <div className={styles.dataTopbar}>
            <div className={styles.metricControls} role="group" aria-label="Choose a performance metric">
              {METRICS.map((item) => {
                const active = metric === item.key
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`${styles.metricButton} ${active ? styles.metricButtonActive : ''}`}
                    aria-pressed={active}
                    onClick={() => setMetric(item.key)}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div className={styles.dataSummary} aria-live="polite">
              {metricConfig?.summary.map((item, index) => (
                <span className={styles.dataSummaryItem} key={item.label}>
                  {index > 0 ? <span className={styles.dataSummaryDot}>·</span> : null}
                  <strong>{item.value}</strong> {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.dataContent}>
            {metric === 'overview' ? (
              <section className={styles.overviewGrid} aria-label="Account performance overview">
                <div className={styles.overviewStat}>
                  <span className={styles.overviewLabel}>Total views</span>
                  <strong className={styles.overviewValue}>3.3M</strong>
                </div>
                <div className={styles.overviewStat}>
                  <span className={styles.overviewLabel}>New followers</span>
                  <strong className={styles.overviewValue}>1,423</strong>
                </div>
                <div className={styles.overviewStat}>
                  <span className={styles.overviewLabel}>Active followers</span>
                  <strong className={styles.overviewValue}>73.5%</strong>
                </div>

                <figure className={styles.overviewTrend}>
                  <FollowerTrendChart />
                  <figcaption>Follower growth · Jul 1–30</figcaption>
                </figure>
              </section>
            ) : (
              <section className={styles.videoMetricView} aria-label={`${METRICS.find((item) => item.key === metric)?.label} performance by video`}>
                <VideoChart metric={metric} />
                <AccessibleDataTable />
              </section>
            )}
          </div>

          <div className={styles.dataViewRail} aria-hidden="true">
            {METRICS.map((item) => (
              <span key={item.key} className={metric === item.key ? styles.dataViewRailActive : ''} />
            ))}
          </div>
        </div>
      </article>
    </section>
  )
}
