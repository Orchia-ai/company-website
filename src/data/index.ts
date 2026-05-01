import { PhoneIcon, RobotIcon } from '../icons'
import { createElement } from 'react'

export const whyUs = [
  {
    num: '01',
    title: 'Systems Before Screens',
    description:
      'We start with the substrate: typography, spacing, components, states, hierarchy. A design system aligned to the brand from day one is what lets a product scale across features, releases, and surfaces without drifting.',
  },
  {
    num: '02',
    title: 'Phased Delivery, Not Chaos',
    description:
      'Architecture, product definition, design, implementation, testing, and launch each have a defined role. Structure keeps scope understandable and execution predictable — and keeps the team out of the rework loop.',
  },
  {
    num: '03',
    title: 'Advanced Features, Used Sparingly',
    description:
      'AI assistance, AR, smart notifications, and personalization belong in the product only when they clearly improve the experience. We treat them as leverage, not decoration — restraint is the feature.',
  },
  {
    num: '04',
    title: 'Engineered for Retention',
    description:
      'We do not stop at a storefront. Loyalty, account depth, post-purchase touchpoints, and return flows are designed into the product so that coming back feels native, not nudged.',
  },
]

export const tracks = [
  {
    icon: createElement(PhoneIcon),
    tag: 'Mobile Commerce',
    headline: 'Shopify-native mobile apps built for retention.',
    points: [
      'Product discovery, loyalty, and personalization in one experience',
      'Post-purchase engagement built into the core product',
    ],
  },
  {
    icon: createElement(RobotIcon),
    tag: 'AI & Robotics Interfaces',
    headline: 'Operational interfaces for systems that touch the physical world.',
    points: [
      'Control panels, visualization tools, and dashboards',
      'Real-time feedback for AI and hardware workflows',
    ],
  },
]

export const steps = [
  {
    step: '01',
    title: 'Define the system',
    description:
      'Product structure, user flows, technical constraints, and operational model.',
  },
  {
    step: '02',
    title: 'Design the experience',
    description:
      'Design system, reusable components, states, and interaction patterns.',
  },
  {
    step: '03',
    title: 'Build and test',
    description:
      'Frontend, backend integration, QA, deployment, and launch readiness.',
  },
  {
    step: '04',
    title: 'Extend for growth',
    description:
      'Loyalty, personalization, AI, automation, analytics, and retention features.',
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
