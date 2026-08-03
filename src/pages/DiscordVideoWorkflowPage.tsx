import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import {
  DiscordCommandAnimation,
  DiscordDeliveryExample,
} from './DiscordThreadExamples'
import styles from './discord-video-workflow-page.module.css'
import StudioSiteHeader from './StudioSiteHeader'

const newProjectCommand =
  '/newproject title: "Aurora smart lamp launch" idea_details: "Create a 60-second launch film for design-conscious renters. Show the lamp transforming a dark apartment through work, dinner, and wind-down moments. Keep the visual style cinematic and minimal, then end on the product and launch date."'

const newProjectReply = (
  <>
    <p>Project created. I opened the <strong>aurora-smart-lamp-launch</strong> workspace thread.</p>
    <p>Your video is now being created.</p>
    <p>↻ Creating your video · 62%</p>
  </>
)

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
    parameter: 'idea_details',
    requirement: 'Required',
    description: 'The video idea, audience, context, and desired outcome.',
    defaultValue: '—',
  },
  {
    parameter: 'language',
    requirement: 'Optional',
    description: 'The language for the video and project updates.',
    defaultValue: '—',
  },
  {
    parameter: 'workflow_requirement',
    requirement: 'Optional',
    description: 'Any additional production instructions to follow.',
    defaultValue: '—',
  },
  {
    parameter: 'start_version',
    requirement: 'Optional',
    description: 'A saved project setup to start from.',
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
      'Yes. Send /feedback as many times as needed, then use /rerun when you are ready to create an updated video.',
  },
  {
    question: 'Can I provide images?',
    answer:
      'Yes. Attach up to three reference images with /feedback. Add them in order beginning with image_1, followed by image_2 and image_3.',
  },
  {
    question: 'Does a rerun always restart from the beginning?',
    answer:
      'No. /rerun applies the feedback saved in the workspace thread and creates an updated video.',
  },
  {
    question: 'Can I stop a bad generation early?',
    answer:
      'Yes. Use /terminate to stop the current creation. Anything already posted in the thread remains available, and you can add feedback before using /rerun again.',
  },
  {
    question: 'Where is the final video delivered?',
    answer:
      'The final video appears in the project’s Discord thread when it is ready.',
  },
  {
    question: 'Can I still see the project in the web workspace?',
    answer:
      'Yes. You can open the same project and its latest video in the web workspace.',
  },
  {
    question: 'What happens if the final video exceeds Discord’s upload limit?',
    answer:
      'Orchia posts a download link instead of attaching the file. The link remains available for seven days.',
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
        <title>Discord video workflow — Orchia Studio</title>
        <meta
          name="description"
          content="See how Orchia Studio creates, refines, reruns, and delivers complete AI-generated video projects directly inside Discord."
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
          content="See how Orchia Studio creates, refines, reruns, and delivers complete AI-generated video projects directly inside Discord."
        />
        <meta property="og:url" content="https://orchia.studio/docs/discord-video-workflow" />
        <meta property="og:image" content="https://orchia.studio/og-discord-video-workflow-2026-08-v2.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Orchia Studio Discord video workflow documentation" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Discord video workflow — Orchia Studio" />
        <meta
          name="twitter:description"
          content="See how Orchia Studio creates, refines, reruns, and delivers complete AI-generated video projects directly inside Discord."
        />
        <meta name="twitter:image" content="https://orchia.studio/og-discord-video-workflow-2026-08-v2.png" />
        <meta name="twitter:image:alt" content="Orchia Studio Discord video workflow documentation" />
      </Helmet>

      <a className={styles.skipLink} href="#documentation-content">
        Skip to documentation
      </a>

      <div className={styles.page}>
        <StudioSiteHeader sticky />

        <main id="documentation-content">
          <section className={styles.hero} aria-labelledby="docs-title">
            <div className={styles.heroCopy}>
              <div className={styles.breadcrumb}>
                <Link to="/">Orchia Studio</Link>
                <span aria-hidden="true">/</span>
                <Link to="/docs">Documentation</Link>
              </div>

              <span className={styles.statusBadge}>In development · Coming soon</span>
              <h1 id="docs-title">Start creating with one command.</h1>
              <p className={styles.subtitle}>
                Add a title, then use <InlineCode>idea_details</InlineCode> to share
                the audience, story, visual direction, references, and delivery goal.
              </p>
            </div>

            <div className={styles.heroCommand}>
              <DiscordCommandAnimation
                caption="Create a project"
                channel="video-projects"
                command={newProjectCommand}
                reply={newProjectReply}
              />
            </div>

            <a className={styles.heroScrollCue} href="#create-a-project">
              <span>Scroll down to do more</span>
              <span className={styles.heroScrollArrow} aria-hidden="true">↓</span>
            </a>
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
                  command={newProjectCommand}
                  reply={newProjectReply}
                />

                <p>
                  Type <InlineCode>/newproject</InlineCode> in the Discord channel
                  where you start projects. Add a title and{' '}
                  <InlineCode>idea_details</InlineCode>, then send it. Orchia creates
                  a dedicated workspace thread and starts creating your video.
                </p>

                <p>
                  Follow progress in that thread. Previews and the finished video
                  appear there as soon as they are ready.
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
                <SectionHeading title="/feedback" availability="Workspace thread only" />

                <DiscordCommandAnimation
                  caption="Send feedback in the workspace thread"
                  channel="aurora-smart-lamp-launch"
                  command={'/feedback feedback: "Keep the opening apartment shot, make the middle section feel faster, use image_3 as the visual reference, and hold the final product shot for two more seconds."'}
                  attachments={[
                    'image_1 · opening-frame.png',
                    'image_2 · lifestyle-lighting.jpg',
                    'image_3 · visual-reference.jpg',
                  ]}
                  inThread
                  workspaceThreadOnly
                  priorVideo={{
                    duration: '0:45',
                    title: 'aurora-smart-lamp-launch.mp4',
                  }}
                  reply={(
                    <>
                      <p>Feedback saved.</p>
                      <p>Add more feedback, or send <strong>/rerun</strong> when you are ready.</p>
                    </>
                  )}
                />

                <p>
                  Review the generated video, then type <InlineCode>/feedback</InlineCode>{' '}
                  inside the project’s workspace thread created by <InlineCode>/newproject</InlineCode>.
                  Describe the changes you want and attach up to three reference images
                  if needed. You can send more than one feedback message before{' '}
                  <InlineCode>/rerun</InlineCode>.
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
                  <strong>Attach images in order.</strong>
                  <p>
                    Start with <InlineCode>image_1</InlineCode>. If you add more,
                    continue with <InlineCode>image_2</InlineCode> and then{' '}
                    <InlineCode>image_3</InlineCode> without skipping a number.
                  </p>
                </div>
              </section>

              <section className={styles.docSection} id="rerun-efficiently">
                <SectionHeading title="/rerun" availability="Workspace thread only" />

                <DiscordCommandAnimation
                  caption="Create an updated video"
                  channel="aurora-smart-lamp-launch"
                  command="/rerun"
                  inThread
                  workspaceThreadOnly
                  priorFeedbacks={[
                    {
                      feedback: 'Show the lamp turning on in the first three seconds so the opening hook is immediate',
                      version: '42.1',
                    },
                    {
                      feedback: 'Use the brighter lifestyle image for the ending and hold the launch date for two more seconds',
                      version: '42.2',
                    },
                  ]}
                  reply={(
                    <>
                      <p>Rerun started with your latest feedback.</p>
                      <p>The updated video will appear in this thread.</p>
                    </>
                  )}
                />

                <p>
                  Type <InlineCode>/rerun</InlineCode> after saving feedback in
                  the project’s workspace thread created by <InlineCode>/newproject</InlineCode>.
                  It creates an updated video using the feedback saved in that thread.
                </p>

                <p>
                  Feedback sent while a rerun is active will be used the next time
                  you run <InlineCode>/rerun</InlineCode>.
                </p>
              </section>

              <section className={styles.docSection} id="stop-a-run">
                <SectionHeading title="/terminate" />

                <DiscordCommandAnimation
                  caption="Stop an active run"
                  channel="aurora-smart-lamp-launch"
                  command="/terminate"
                  inThread
                  reply={(
                    <>
                      <p>Current creation stopped.</p>
                      <p>Anything already posted in this thread is still available.</p>
                    </>
                  )}
                />

                <p>
                  Use <InlineCode>/terminate</InlineCode> to stop the current creation.
                  You can then add feedback and use <InlineCode>/rerun</InlineCode>{' '}
                  when you are ready.
                </p>
              </section>

              <section className={styles.docSection} id="workflow-versions">
                <SectionHeading title="/version" />

                <DiscordCommandAnimation
                  caption="Check the version in the project thread"
                  channel="aurora-smart-lamp-launch"
                  command="/version"
                  inThread
                  reply={(
                    <>
                      <p>Project number: <strong>42</strong></p>
                      <p>Starting version: <strong>V1.1</strong></p>
                      <p>Current version: <strong>42.10</strong></p>
                    </>
                  )}
                />

                <p>
                  Type <InlineCode>/version</InlineCode> in the project thread to
                  check the current saved version before rerunning.
                </p>

                <p>
                  The version number changes when feedback is saved, so you can
                  confirm which changes the next rerun will use.
                </p>
              </section>

              <section className={styles.docSection} id="receive-video">
                <SectionHeading title="Final delivery" />

                <DiscordDeliveryExample />

                <p>
                  When your video is ready, Orchia posts it in the project thread.
                </p>

                <div className={styles.deliveryGrid}>
                  <div>
                    <span className={styles.deliveryNumber}>01</span>
                    <h3>Direct attachment</h3>
                    <p>Smaller videos appear as attachments in the thread.</p>
                  </div>
                  <div>
                    <span className={styles.deliveryNumber}>02</span>
                    <h3>Expiring link</h3>
                    <p>
                      Larger videos arrive as download links that remain available
                      for seven days.
                    </p>
                  </div>
                  <div>
                    <span className={styles.deliveryNumber}>03</span>
                    <h3>Web workspace</h3>
                    <p>You can also open the project and its latest video in the web workspace.</p>
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
                      </Link>.
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

function SectionHeading({
  title,
  availability,
}: {
  title: string
  availability?: string
}) {
  return (
    <header className={styles.sectionHeading}>
      <h2>{title}</h2>
      {availability ? (
        <span className={styles.commandAvailability}>{availability}</span>
      ) : null}
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
