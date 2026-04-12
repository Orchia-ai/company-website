import { PhoneIcon, RobotIcon } from '../icons'
import { createElement } from 'react'

export const whyUs = [
  {
    num: '01',
    title: 'Design System & Brand Cohesion',
    description:
      'We build with a complete design system from the start — typography, color, spacing, and component hierarchy all grounded in your brand. The result is an interface that feels intentional at every scale, not assembled.',
  },
  {
    num: '02',
    title: 'Reliable Technology, Thoughtfully Applied',
    description:
      'We adopt new frontend technologies when they are stable and purposeful — not because they are new. Every tool we choose is vetted for production, maintainability, and real-world performance.',
  },
  {
    num: '03',
    title: 'Details Are the Product',
    description:
      'Transition curves, interaction states, spacing rhythm, loading behavior — we treat these as core deliverables, not polish. The details are what users remember, and what separates craft from output.',
  },
  {
    num: '04',
    title: 'Vision-Driven Development',
    description:
      'We build toward a product vision, not just a spec. Every engineering decision is weighed against where the product is going — so the foundation we lay today supports the version you ship two years from now.',
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
