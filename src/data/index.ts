import { PhoneIcon, RobotIcon } from '../icons'
import { createElement } from 'react'

export const whyUs = [
  {
    num: '01',
    title: 'Design × Engineering',
    description:
      'Aesthetic intuition and engineering precision are the same discipline here. Every product decision is both visual and structural — neither compromised for the other.',
  },
  {
    num: '02',
    title: 'Strong Technical Foundation',
    description:
      'Clean architecture from the first commit. We write for the engineer who inherits this codebase — not just for the demo. Scalable, documented, and production-ready.',
  },
  {
    num: '03',
    title: 'Version-First Development',
    description:
      'Full versioning from day one. Structured release cycles, clear changelogs, and a codebase that grows cleanly across every iteration without accumulating debt.',
  },
  {
    num: '04',
    title: 'Details That Matter',
    description:
      'Micro-interactions, animation curves, transition timing — the craft that separates a product people use from one they remember. We treat these as first-class concerns, not afterthoughts.',
  },
]

export const tracks = [
  {
    icon: createElement(RobotIcon),
    tag: 'AI & Robotics',
    headline: 'Intelligent systems that interact with the physical world.',
    points: [
      'Human-machine interface design for robotic platforms',
      'AI-driven perception and decision logic',
      'Real-time control systems with safety-critical UX',
      'Hardware-software co-design from prototype to production',
    ],
  },
  {
    icon: createElement(PhoneIcon),
    tag: 'E-Commerce & Mobile',
    headline: 'Native apps that make buying feel effortless.',
    points: [
      'iOS & Android apps built on React Native',
      'Shopify-native commerce: Storefront API, Customer Accounts, POS',
      'Loyalty and membership programs, cloud-synced via Metafields',
      'Push engagement wired directly to inventory and order webhooks',
    ],
  },
]

export const steps = [
  {
    step: '01',
    title: 'Design',
    description:
      'We consolidate your design system and visual language into a coherent concept — ensuring every interface element communicates the right idea before a single line of production code is written.',
  },
  {
    step: '02',
    title: 'Build',
    description:
      'Solid technical implementation with clean architecture from day one. Structured release cycles, clear changelogs, and versioned delivery — so the codebase grows without accumulating debt.',
  },
  {
    step: '03',
    title: 'Launch & Maintain',
    description:
      'Deployment, monitoring, and post-launch support. Issues are resolved as soon as they surface. We stay engaged well past handoff — your product is maintained, not abandoned.',
  },
  {
    step: '04',
    title: 'Advanced Technology',
    description:
      'Once the foundation is stable, we layer in technologies that expand what your product can do — AI recommendation systems, augmented reality interactions, 3D interfaces — opening new revenue streams and use cases.',
  },
]

export const techStack = [
  'React Native',
  'Shopify Storefront API',
  'Expo',
  'TypeScript',
  'GraphQL',
  'ROS 2',
  'Python',
  'Three.js',
]
