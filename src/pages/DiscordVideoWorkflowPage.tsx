import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import {
  DiscordCommandAnimation,
  DiscordDeliveryExample,
} from './DiscordThreadExamples'
import styles from './discord-video-workflow-page.module.css'

const sections = [
  ['create-a-project', '/newproject'],
  ['give-feedback', '/feedback'],
  ['rerun-efficiently', '/rerun'],
  ['stop-a-run', '/terminate'],
  ['workflow-versions', '/version'],
  ['receive-video', 'Final delivery'],
  ['faq', 'FAQ'],
] as const

const newProjectParameters = [
  {
    parameter: 'title',
    requirement: 'Required',
    description: 'A clear project title.',
    defaultValue: '—',
  },
  {
    parameter: 'brief',
    requirement: 'Required',
    description: 'The video idea, audience, context, and desired outcome.',
    defaultValue: '—',
  },
  {
    parameter: 'language',
    requirement: 'Optional',
    description: 'The language to use throughout the workflow.',
    defaultValue: '—',
  },
  {
    parameter: 'workflow_requirement',
    requirement: 'Optional',
    description: 'Instructions for adapting the workflow before the first run.',
    defaultValue: '—',
  },
  {
    parameter: 'start_version',
    requirement: 'Optional',
    description: 'An existing workflow version to use as the starting point.',
    defaultValue: 'Legacy V1.1',
  },
] as const

const feedbackParameters = [
  ['feedback', 'Required', 'Describe what should change.'],
  ['image_1', 'Optional', 'The first reference image. Start here when adding images.'],
  ['image_2', 'Optional', 'The second reference image.'],
  ['image_3', 'Optional', 'The third reference image.'],
] as const

const questions = [
  {
    question: 'Can I provide several rounds of feedback?',
    answer:
      'The planned workflow supports multiple feedback rounds before a rerun. Each successfully applied round creates a new workflow revision.',
  },
  {
    question: 'Can I provide images?',
    answer:
      'Yes. /feedback is designed to accept up to three reference images. Add them in order beginning with image_1; do not skip directly to image_2 or image_3. Image analysis uses submission order rather than filenames.',
  },
  {
    question: 'Does a rerun always restart from the beginning?',
    answer:
      'No. The reuse planner is designed to find the earliest affected workflow step, reuse successful unchanged upstream outputs, and regenerate affected and downstream work.',
  },
  {
    question: 'Can I stop a bad generation early?',
    answer:
      '/terminate is intended to stop the active run while keeping completed text, images, and video clips. You can then provide more feedback and start another rerun.',
  },
  {
    question: 'Where is the final video delivered?',
    answer:
      'The intended delivery location is the project’s Discord thread after generation finishes.',
  },
  {
    question: 'Can I still see the project in the web workspace?',
    answer:
      'The planned integration keeps the same project and its batches visible in the existing web workspace.',
  },
  {
    question: 'What happens if the final video exceeds Discord’s upload limit?',
    answer:
      'The planned behavior is to post an expiring backend-hosted download link instead of attaching the file. The current intended expiration is seven days and may change before release.',
  },
] as const

export default function DiscordVideoWorkflowPage() {
  useEffect(() => {
    document.body.classList.add('discord-docs-mode')
    return () => document.body.classList.remove('discord-docs-mode')
  }, [])

  return (
    <>
      <Helmet>
        <title>Discord video workflow documentation — Orchia Studio</title>
        <meta
          name="description"
          content="Documentation for Orchia Studio’s in-development Discord workflow for creating, refining, rerunning, and receiving AI-generated video projects."
        />
        <link
          rel="canonical"
          href="https://orchia.studio/docs/discord-video-workflow"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Orchia Studio" />
        <meta property="og:title" content="Discord video workflow — Orchia Studio" />
        <meta
          property="og:description"
          content="An in-development workflow for creating and refining complete AI-generated video projects inside Discord."
        />
      </Helmet>

      <a className={styles.skipLink} href="#documentation-content">
        Skip to documentation
      </a>

      <div className={styles.page}>
        <header className={styles.siteHeader}>
          <Link className={styles.brand} to="/" aria-label="Orchia Studio home">
            <span>Orchia</span>
            <span className={styles.brandSuffix}>Studio</span>
          </Link>

          <nav className={styles.headerNav} aria-label="Documentation navigation">
            <Link to="/docs" aria-current="location">Documentation</Link>
            <Link to="/">Home</Link>
          </nav>
        </header>

        <main id="documentation-content">
          <section className={styles.hero} aria-labelledby="docs-title">
            <div className={styles.heroCopy}>
              <div className={styles.breadcrumb}>
                <Link to="/">Orchia Studio</Link>
                <span aria-hidden="true">/</span>
                <Link to="/docs">Documentation</Link>
              </div>

              <span className={styles.statusBadge}>In development · Coming soon</span>
              <h1 id="docs-title">Discord video workflow</h1>
              <p className={styles.subtitle}>
                Create, refine, rerun, and receive complete AI-generated video
                projects directly inside Discord.
              </p>
            </div>

          </section>

          <div className={styles.docsGrid}>
            <aside className={styles.tableOfContents}>
              <nav aria-label="On this page">
                <p>On this page</p>
                <ol>
                  {sections.map(([id, label]) => (
                    <li key={id}>
                      <a href={`#${id}`}>{label}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className={styles.documentation}>
              <section className={styles.docSection} id="create-a-project">
                <SectionHeading title="/newproject" />

                <DiscordCommandAnimation
                  caption="Create a project"
                  channel="video-projects"
                  command={'/newproject title: "Product launch film" brief: "A concise launch video"'}
                  reply={(
                    <>
                      <p>Project created. I opened the <strong>product-launch-film</strong> project thread.</p>
                      <p>Batch 1 started automatically.</p>
                      <p>↻ Image generation · 62%</p>
                    </>
                  )}
                />

                <p>
                  Type <InlineCode>/newproject</InlineCode> in the Discord channel
                  where you start projects. Add a title and brief, then send it.
                  Orchia is designed to create a dedicated thread, prepare the
                  workflow, and start the first batch without another approval
                  step.
                </p>

                <p>
                  Inside the new thread, Orchia is intended to edit one text
                  progress message as the run advances. Generated images appear
                  in that same thread when they are ready.
                </p>

                <h3>Project parameters</h3>
                <div className={styles.tableWrapper} tabIndex={0} role="region" aria-label="New project parameters">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Parameter</th>
                        <th scope="col">Status</th>
                        <th scope="col">What to provide</th>
                        <th scope="col">Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newProjectParameters.map((row) => (
                        <tr key={row.parameter}>
                          <th scope="row"><InlineCode>{row.parameter}</InlineCode></th>
                          <td>{row.requirement}</td>
                          <td>{row.description}</td>
                          <td>{row.defaultValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className={styles.docSection} id="give-feedback">
                <SectionHeading title="/feedback" />

                <DiscordCommandAnimation
                  caption="Send feedback in the project thread"
                  channel="product-launch-film"
                  command={'/feedback feedback: "Use image_3 as the art-style reference"'}
                  attachments={['image_1', 'image_2', 'image_3']}
                  inThread
                  priorVideo={{
                    duration: '0:45',
                    title: 'product-launch-film-batch-1.mp4',
                  }}
                  reply={(
                    <>
                      <p>Feedback saved as workflow version <strong>42.1</strong>.</p>
                      <p>Send <strong>/rerun</strong> when you are ready.</p>
                    </>
                  )}
                />

                <p>
                  Review the generated video, then type <InlineCode>/feedback</InlineCode>{' '}
                  inside the project thread created by <InlineCode>/newproject</InlineCode>.
                  This command is only available in that thread. Describe the
                  change and send it; each successfully applied message is
                  designed to save a new workflow revision.
                </p>

                <h3>Feedback parameters</h3>
                <div className={styles.parameterList}>
                  {feedbackParameters.map(([name, requirement, description]) => (
                    <div key={name}>
                      <InlineCode>{name}</InlineCode>
                      <span>{requirement}</span>
                      <p>{description}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.callout}>
                  <strong>Keep image order explicit.</strong>
                  <p>
                    Add images without gaps, beginning with
                    <InlineCode>image_1</InlineCode>. The image-aware agent is
                    designed to examine them in their submitted order, not by
                    uploaded filename.
                  </p>
                </div>
              </section>

              <section className={styles.docSection} id="rerun-efficiently">
                <SectionHeading title="/rerun" />

                <DiscordCommandAnimation
                  caption="Start the next batch"
                  channel="product-launch-film"
                  command="/rerun"
                  inThread
                  priorFeedbacks={[
                    {
                      feedback: 'Make the opening hook more direct',
                      version: '42.1',
                    },
                    {
                      feedback: 'Use the brighter product shot for the ending',
                      version: '42.2',
                    },
                  ]}
                  reply={(
                    <>
                      <p>Rerun started.</p>
                      <p>Reusing: Story, Visual references</p>
                      <p>Regenerating from: Image generation</p>
                    </>
                  )}
                />

                <p>
                  Type <InlineCode>/rerun</InlineCode> after saving feedback in
                  the project thread created by <InlineCode>/newproject</InlineCode>.
                  This command is only available in that thread. A reuse-planning
                  agent is designed to compare your revised workflow with the
                  previous run and find the first step that actually changed.
                </p>

                <div className={styles.reuseSummary} aria-label="What a rerun reuses and regenerates">
                  <div>
                    <strong>Reuse</strong>
                    <p>Successful work before the first changed step.</p>
                  </div>
                  <div>
                    <strong>Regenerate</strong>
                    <p>The changed step and everything that depends on it.</p>
                  </div>
                </div>

                <p>
                  This avoids repeating unchanged work. Feedback sent during a
                  running batch is intended to remain in a separate draft for
                  the following rerun.
                </p>
              </section>

              <section className={styles.docSection} id="stop-a-run">
                <SectionHeading title="/terminate" />

                <DiscordCommandAnimation
                  caption="Stop an active run"
                  channel="product-launch-film"
                  command="/terminate"
                  inThread
                  reply={(
                    <>
                      <p>Run stopped.</p>
                      <p>Completed text, images, and video clips were kept.</p>
                    </>
                  )}
                />

                <p>
                  Type <InlineCode>/terminate</InlineCode> when an early preview
                  shows that the direction is wrong. Completed outputs are
                  intended to stay available, so you can send more feedback and
                  then use <InlineCode>/rerun</InlineCode>.
                </p>
              </section>

              <section className={styles.docSection} id="workflow-versions">
                <SectionHeading title="/version" />

                <DiscordCommandAnimation
                  caption="Check the version in the project thread"
                  channel="product-launch-film"
                  command="/version"
                  inThread
                  reply={(
                    <>
                      <p>Project number: <strong>42</strong></p>
                      <p>Starting workflow: <strong>V1.1</strong></p>
                      <p>Current workflow: <strong>42.10</strong></p>
                    </>
                  )}
                />

                <p>
                  Type <InlineCode>/version</InlineCode> in the project thread to
                  see where this project started and which saved revision you
                  are using now.
                </p>

                <div className={styles.versionBreakdown} aria-label="How workflow version 42.10 is structured">
                  <div>
                    <code>42</code>
                    <span>Project number</span>
                  </div>
                  <strong aria-hidden="true">.</strong>
                  <div>
                    <code>10</code>
                    <span>Saved revision</span>
                  </div>
                </div>

                <p>
                  <InlineCode>42.0</InlineCode> is the initial workflow for
                  project 42. Feedback then creates <InlineCode>42.1</InlineCode>,
                  <InlineCode>42.2</InlineCode>, and so on. The revision can keep
                  growing past one digit, such as <InlineCode>42.10</InlineCode>.
                </p>
              </section>

              <section className={styles.docSection} id="receive-video">
                <SectionHeading title="Final delivery" />

                <DiscordDeliveryExample />

                <p>
                  When generation finishes, the planned workflow delivers the
                  final video in the project thread.
                </p>

                <div className={styles.deliveryGrid}>
                  <div>
                    <span className={styles.deliveryNumber}>01</span>
                    <h3>Direct attachment</h3>
                    <p>Smaller videos are intended to be attached in the project thread.</p>
                  </div>
                  <div>
                    <span className={styles.deliveryNumber}>02</span>
                    <h3>Expiring link</h3>
                    <p>
                      Videos above Discord’s upload limit are intended to use a
                      backend-hosted download link. The current planned
                      expiration is seven days.
                    </p>
                  </div>
                  <div>
                    <span className={styles.deliveryNumber}>03</span>
                    <h3>Web workspace</h3>
                    <p>The same project and batches are intended to remain visible in the existing web workspace.</p>
                  </div>
                </div>
              </section>

              <section className={styles.docSection} id="faq">
                <SectionHeading title="Frequently asked questions" />

                <div className={styles.faqList}>
                  <details>
                    <summary>How can I request access?</summary>
                    <p>
                      <Link className={styles.faqAccessLink} to="/#contact">
                        Contact us for private access
                      </Link>{' '}
                      and updates about the upcoming Discord workflow.
                    </p>
                  </details>
                  {questions.map(({ question, answer }) => (
                    <details key={question}>
                      <summary>{question}</summary>
                      <p>{formatAnswer(answer)}</p>
                    </details>
                  ))}
                </div>
              </section>

            </article>
          </div>
        </main>

        <footer className={styles.footer}>
          <Link className={styles.brand} to="/" aria-label="Orchia Studio home">
            <span>Orchia</span>
            <span className={styles.brandSuffix}>Studio</span>
          </Link>
          <p>Documentation for the tools we are building with creators.</p>
          <Link to="/docs">All documentation →</Link>
        </footer>
      </div>
    </>
  )
}

function SectionHeading({ title }: { title: string }) {
  return (
    <header className={styles.sectionHeading}>
      <h2>{title}</h2>
    </header>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className={styles.inlineCode}>{children}</code>
}

function formatAnswer(answer: string) {
  const tokens = answer.split(/(\/newproject|\/feedback|\/rerun|\/version|\/terminate|image_[123])/g)
  return tokens.map((token, index) =>
    /^(\/newproject|\/feedback|\/rerun|\/version|\/terminate|image_[123])$/.test(token)
      ? <InlineCode key={`${token}-${index}`}>{token}</InlineCode>
      : token,
  )
}
