import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import styles from './discord-video-workflow-page.module.css'

const sections = [
  ['typical-workflow', 'Typical workflow'],
  ['create-a-project', 'Create a project'],
  ['follow-progress', 'Follow progress'],
  ['give-feedback', 'Give feedback'],
  ['workflow-versions', 'Workflow versions'],
  ['rerun-efficiently', 'Rerun efficiently'],
  ['stop-a-run', 'Stop a run'],
  ['receive-video', 'Receive the final video'],
  ['command-reference', 'Command reference'],
  ['faq', 'Frequently asked questions'],
] as const

const workflowStages = [
  '/newproject',
  'Automatic first batch',
  'Image previews',
  '/feedback',
  '/rerun',
  'Final video',
  'Further revisions',
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

const plannerInputs = [
  'Accumulated feedback',
  'Ordered reference images',
  'The current and revised workflows',
  'The previous run state',
  'Existing image and video outputs',
  'Original generation prompts',
] as const

const commands = [
  {
    command: '/newproject',
    location: 'A Discord channel where you start a project',
    parameters: 'Required: title, brief. Optional: language, workflow_requirement, start_version.',
    action: 'Designed to create a project thread, prepare its workflow, and start the first batch automatically.',
  },
  {
    command: '/feedback',
    location: 'The project thread',
    parameters: 'Required: feedback. Optional: image_1, image_2, image_3, supplied in order.',
    action: 'Designed to apply requested changes to a new, immutable workflow revision.',
  },
  {
    command: '/rerun',
    location: 'The project thread',
    parameters: 'None',
    action: 'Designed to plan which outputs can be reused, then start the next batch from the earliest affected step.',
  },
  {
    command: '/version',
    location: 'The project thread',
    parameters: 'None',
    action: 'Designed to report the project number, starting workflow version, and current workflow version.',
  },
  {
    command: '/terminate',
    location: 'The project thread during an active run',
    parameters: 'None',
    action: 'Designed to stop the active run while preserving outputs that are already complete.',
  },
] as const

const questions = [
  {
    question: 'Can I use this feature now?',
    answer:
      'Not yet. Discord video workflow is in development and has not been redeployed or verified.',
  },
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
            <span aria-current="page">Documentation</span>
            <Link to="/">Home</Link>
          </nav>
        </header>

        <main id="documentation-content">
          <section className={styles.hero} aria-labelledby="docs-title">
            <div className={styles.heroCopy}>
              <div className={styles.breadcrumb}>
                <Link to="/">Orchia Studio</Link>
                <span aria-hidden="true">/</span>
                <span>Documentation</span>
              </div>

              <span className={styles.statusBadge}>In development</span>
              <h1 id="docs-title">Discord video workflow</h1>
              <p className={styles.subtitle}>
                Create, refine, rerun, and receive complete AI-generated video
                projects directly inside Discord.
              </p>
            </div>

            <aside className={styles.releaseNote} aria-label="Feature status">
              <span className={styles.releaseIndex}>Preview documentation</span>
              <p>
                This workflow has been implemented in code, but it has not yet
                been redeployed or verified. The experience described here is
                the intended behavior and may change before release.
              </p>
              <dl className={styles.statusList}>
                <div>
                  <dt>Code</dt>
                  <dd>Implemented</dd>
                </div>
                <div>
                  <dt>Redeployment</dt>
                  <dd>Pending</dd>
                </div>
                <div>
                  <dt>Verification</dt>
                  <dd>Pending</dd>
                </div>
              </dl>
            </aside>
          </section>

          <div className={styles.docsGrid}>
            <aside className={styles.tableOfContents}>
              <nav aria-label="On this page">
                <p>On this page</p>
                <ol>
                  {sections.map(([id, label], index) => (
                    <li key={id}>
                      <a href={`#${id}`}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        {label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className={styles.documentation}>
              <section className={styles.docSection} id="typical-workflow">
                <SectionHeading
                  index="01"
                  title="Typical workflow"
                  description="One project thread holds the run, its previews, feedback, versions, and final delivery."
                />

                <ol className={styles.workflow} aria-label="Typical Discord video workflow">
                  {workflowStages.map((stage, index) => (
                    <li key={stage}>
                      <span className={styles.workflowNumber}>{index + 1}</span>
                      <span className={stage.startsWith('/') ? styles.commandLabel : undefined}>
                        {stage}
                      </span>
                    </li>
                  ))}
                </ol>

                <p>
                  Use <InlineCode>/feedback</InlineCode> one or more times before
                  <InlineCode>/rerun</InlineCode>. After the next video arrives,
                  you can continue refining it through further feedback and
                  workflow versions.
                </p>
              </section>

              <div className={styles.chapterHeading}>
                <span>How the workflow is designed to work</span>
              </div>

              <section className={styles.docSection} id="create-a-project">
                <SectionHeading
                  index="02"
                  title="Create a project"
                  description="Start in Discord with one command and a clear creative brief."
                />

                <p>
                  Enter <InlineCode>/newproject</InlineCode> in Discord. The
                  planned backend flow is designed to create a project, open a
                  dedicated thread, prepare the workflow, create the first
                  batch, and start generation automatically. The planned flow
                  does not require manual approval after the workflow is
                  adapted.
                </p>

                <CodeExample label="Example /newproject command">
                  {'/newproject\n  title: "Product launch film"\n  brief: "Create a concise launch video for a new creative tool."\n  language: "English"\n  workflow_requirement: "Use a grounded documentary style."\n  start_version: "V1.1"'}
                </CodeExample>

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

              <section className={styles.docSection} id="follow-progress">
                <SectionHeading
                  index="03"
                  title="Follow progress in the project thread"
                  description="See the run move forward without a stream of repetitive status messages."
                />

                <p>
                  Progress and outputs are intended to stay inside the new
                  project thread. The backend continuously edits one
                  checklist-style message. Generated images are intended to be
                  shared as they become available.
                </p>

                <div className={styles.progressCard} aria-label="Example progress update">
                  <div className={styles.cardHeader}>
                    <span>Example progress update</span>
                    <span>62%</span>
                  </div>
                  <ul>
                    <li><span aria-hidden="true">✓</span> Story</li>
                    <li><span aria-hidden="true">✓</span> Visual references</li>
                    <li className={styles.activeProgress}><span aria-hidden="true">↻</span> Image generation</li>
                    <li className={styles.waitingProgress}><span aria-hidden="true">◷</span> Video generation</li>
                    <li className={styles.waitingProgress}><span aria-hidden="true">◷</span> Final assembly</li>
                  </ul>
                  <div className={styles.progressTrack} aria-hidden="true">
                    <span />
                  </div>
                  <p>Overall percentage: 62%</p>
                </div>

                <p className={styles.note}>
                  This example shows the format. The exact checklist uses the
                  real step names from that project’s workflow.
                </p>
              </section>

              <section className={styles.docSection} id="give-feedback">
                <SectionHeading
                  index="04"
                  title="Give feedback"
                  description="Describe the change in plain language and add ordered visual references when they help."
                />

                <p>
                  Enter <InlineCode>/feedback</InlineCode> inside the project
                  thread. Every successfully applied feedback round is designed
                  to create a new immutable workflow version. Several rounds can
                  accumulate before you rerun the project.
                </p>

                <CodeExample label="Example /feedback command">
                  {'/feedback\n  feedback: "Replace the character in image_1 with the person shown in image_2, while using image_3 as the art-style reference."\n  image_1: [first reference image]\n  image_2: [second reference image]\n  image_3: [third reference image]'}
                </CodeExample>

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

              <section className={styles.docSection} id="workflow-versions">
                <SectionHeading
                  index="05"
                  title="Understand workflow versions"
                  description="Each project gets a durable version history instead of overwriting earlier work."
                />

                <p>
                  New Discord projects use the format
                  <InlineCode>&lt;project number&gt;.&lt;revision&gt;</InlineCode>.
                  The revision is not limited to one digit, and an existing
                  workflow version can be selected as the starting point for a
                  new project.
                </p>

                <div className={styles.versionGrid} aria-label="Workflow version examples">
                  <div><code>42.0</code><span>Initial workflow for project 42</span></div>
                  <div><code>42.1</code><span>First feedback revision</span></div>
                  <div><code>42.9</code><span>Ninth feedback revision</span></div>
                  <div><code>42.10</code><span>Tenth feedback revision</span></div>
                </div>

                <div className={styles.commandStrip}>
                  <InlineCode>/version</InlineCode>
                  <p>
                    Reports the current project number, starting workflow
                    version, and current workflow version.
                  </p>
                </div>
              </section>

              <section className={styles.docSection} id="rerun-efficiently">
                <SectionHeading
                  index="06"
                  title="Rerun efficiently"
                  description="Regenerate the work affected by feedback while retaining successful work that has not changed."
                />

                <p>
                  Enter <InlineCode>/rerun</InlineCode> after applying feedback.
                  Before the next batch starts, a reuse-planning agent is
                  designed to compare:
                </p>

                <ul className={styles.inputGrid}>
                  {plannerInputs.map((input) => <li key={input}>{input}</li>)}
                </ul>

                <div className={styles.reuseDiagram} aria-label="Reuse planning sequence">
                  <div>
                    <span>Before the change</span>
                    <strong>Reuse</strong>
                    <p>Successful, unchanged upstream outputs</p>
                  </div>
                  <span className={styles.diagramArrow} aria-hidden="true">→</span>
                  <div className={styles.affectedStep}>
                    <span>Earliest affected step</span>
                    <strong>Rebuild from here</strong>
                    <p>Affected steps and downstream work</p>
                  </div>
                </div>

                <p>
                  This planning is intended to avoid unnecessary token usage,
                  provider calls, and generation time. If new feedback arrives
                  while a batch is running, the feedback command is designed to
                  remain available and those changes accumulate in a separate
                  workflow draft for the following rerun.
                </p>
              </section>

              <section className={styles.docSection} id="stop-a-run">
                <SectionHeading
                  index="07"
                  title="Stop a run"
                  description="End the active generation early without discarding everything already completed."
                />

                <div className={styles.commandStrip}>
                  <InlineCode>/terminate</InlineCode>
                  <p>
                    Stops the active run while preserving completed text,
                    images, and video clips.
                  </p>
                </div>

                <p>
                  This is useful when an early image preview shows that the
                  creative direction is wrong. After stopping, you can submit
                  more feedback and enter <InlineCode>/rerun</InlineCode>.
                </p>
              </section>

              <section className={styles.docSection} id="receive-video">
                <SectionHeading
                  index="08"
                  title="Receive the final video"
                  description="Delivery returns to the same thread where the project began."
                />

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

              <section className={styles.docSection} id="command-reference">
                <SectionHeading
                  index="09"
                  title="Command reference"
                  description="A compact reference for the five commands in the planned Discord workflow."
                />

                <div className={styles.tableWrapper} tabIndex={0} role="region" aria-label="Discord command reference">
                  <table className={styles.commandTable}>
                    <thead>
                      <tr>
                        <th scope="col">Command</th>
                        <th scope="col">Use it in</th>
                        <th scope="col">Parameters</th>
                        <th scope="col">What it does</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commands.map((row) => (
                        <tr key={row.command}>
                          <th scope="row"><InlineCode>{row.command}</InlineCode></th>
                          <td>{row.location}</td>
                          <td>{row.parameters}</td>
                          <td>{row.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className={styles.docSection} id="faq">
                <SectionHeading
                  index="10"
                  title="Frequently asked questions"
                  description="What creators should know before the workflow is released."
                />

                <div className={styles.faqList}>
                  {questions.map(({ question, answer }) => (
                    <details key={question}>
                      <summary>{question}</summary>
                      <p>{formatAnswer(answer)}</p>
                    </details>
                  ))}
                </div>
              </section>

              <aside className={styles.finalStatus} aria-label="Release status reminder">
                <span className={styles.statusBadge}>In development</span>
                <div>
                  <h2>Not yet ready for production use</h2>
                  <p>
                    This page documents the intended creator experience. The
                    Discord workflow still needs to be redeployed and verified
                    before it is presented as available.
                  </p>
                </div>
              </aside>
            </article>
          </div>
        </main>

        <footer className={styles.footer}>
          <Link className={styles.brand} to="/" aria-label="Orchia Studio home">
            <span>Orchia</span>
            <span className={styles.brandSuffix}>Studio</span>
          </Link>
          <p>Documentation for the tools we are building with creators.</p>
          <Link to="/">Return home →</Link>
        </footer>
      </div>
    </>
  )
}

function SectionHeading({
  index,
  title,
  description,
}: {
  index: string
  title: string
  description: string
}) {
  return (
    <header className={styles.sectionHeading}>
      <span>{index}</span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </header>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return <code className={styles.inlineCode}>{children}</code>
}

function CodeExample({ label, children }: { label: string; children: string }) {
  return (
    <figure className={styles.codeExample}>
      <figcaption>{label}</figcaption>
      <pre tabIndex={0}><code>{children}</code></pre>
    </figure>
  )
}

function formatAnswer(answer: string) {
  const tokens = answer.split(/(\/newproject|\/feedback|\/rerun|\/version|\/terminate|image_[123])/g)
  return tokens.map((token, index) =>
    /^(\/newproject|\/feedback|\/rerun|\/version|\/terminate|image_[123])$/.test(token)
      ? <InlineCode key={`${token}-${index}`}>{token}</InlineCode>
      : token,
  )
}
