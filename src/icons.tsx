const svgProps = {
  width: 22,
  height: 22,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
}

export const PhoneIcon = () => (
  <svg {...svgProps}>
    <rect x="5" y="2" width="14" height="20" rx="3" />
    <circle cx="12" cy="17.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
)

export const StoreIcon = () => (
  <svg {...svgProps}>
    <path d="M3 9l1-5h16l1 5" />
    <path d="M3 9a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0" />
    <path d="M5 9v11h14V9" />
    <rect x="9" y="14" width="6" height="6" rx="0.5" />
  </svg>
)

export const SparkleIcon = () => (
  <svg {...svgProps}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
)

export const ArrowRight = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const RobotIcon = () => (
  <svg {...svgProps}>
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M12 8V4" />
    <circle cx="12" cy="3" r="1" />
    <circle cx="8.5" cy="14" r="1.5" />
    <circle cx="15.5" cy="14" r="1.5" />
    <path d="M10 17h4" />
  </svg>
)
