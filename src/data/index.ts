import { PhoneIcon, RobotIcon } from '../icons'
import { createElement } from 'react'

export const whyUs = [
  {
    num: '01',
    title: 'Design Systems That Scale',
    description:
      'We build reusable systems from the start: typography, spacing, components, states, and hierarchy aligned to your brand and built to scale across features, releases, and future product expansion.',
  },
  {
    num: '02',
    title: 'Phased Delivery, Not Chaos',
    description:
      'Architecture, product definition, design, implementation, testing, and launch each have a clear role. The process stays structured, which keeps scope understandable and execution predictable.',
  },
  {
    num: '03',
    title: 'Advanced Features, Used Carefully',
    description:
      'AI assistance, augmented reality, smart notifications, and richer personalization only belong in the product when they clearly improve the user experience. We treat them as leverage, not decoration.',
  },
  {
    num: '04',
    title: 'Built for Retention',
    description:
      'We do not stop at shipping a storefront. We design for repeat use through loyalty, account depth, post-purchase touchpoints, and product flows that make returning feel natural.',
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
    headline: 'Mobile commerce products that turn browsing into retention.',
    points: [
      'Discovery, cart, checkout, and account flows designed as one connected journey',
      'Content-led shopping experiences with collections, campaigns, and editorial surfaces',
      'Loyalty, rewards, and membership designed into the core product experience',
      'Post-purchase engagement and account depth built for repeat customer behavior',
    ],
  },
]

export const steps = [
  {
    step: '01',
    title: 'Architecture & Product Definition',
    description:
      'We define the system before we decorate it: product structure, critical flows, technical constraints, and the operational model behind the experience.',
  },
  {
    step: '02',
    title: 'Design System & Experience',
    description:
      'We turn the product direction into a disciplined interface language, with reusable components and interaction patterns that can scale without losing coherence.',
  },
  {
    step: '03',
    title: 'Build, Test & Launch',
    description:
      'Implementation follows a clear release path: engineering, QA, refinement, deployment, and launch readiness handled as one coordinated delivery cycle.',
  },
  {
    step: '04',
    title: 'Retention & Growth Features',
    description:
      'Once the foundation is stable, we layer in loyalty, personalization, notifications, and other higher-leverage capabilities that deepen repeat engagement.',
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
