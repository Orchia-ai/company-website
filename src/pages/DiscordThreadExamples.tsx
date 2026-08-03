import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import styles from './discord-video-workflow-page.module.css'

type CommandAnimationProps = {
  caption: string
  channel: string
  command: string
  reply: ReactNode
  attachments?: string[]
  inThread?: boolean
  priorFeedbacks?: Array<{
    feedback: string
    version: string
  }>
  priorVideo?: {
    duration: string
    title: string
  }
}

export function DiscordCommandAnimation({
  caption,
  channel,
  command,
  reply,
  attachments = [],
  inThread = false,
  priorFeedbacks = [],
  priorVideo,
}: CommandAnimationProps) {
  const demoRef = useRef<HTMLElement>(null)
  const [hasStarted, setHasStarted] = useState(() => typeof IntersectionObserver === 'undefined')
  const animationStyle = {
    '--typing-steps': Math.max(1, command.length),
    '--typing-width': `${Math.max(1, command.length)}ch`,
  } as CSSProperties

  useEffect(() => {
    const demo = demoRef.current
    if (!demo || hasStarted || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return

      const availableHeight = entry.rootBounds?.height ?? window.innerHeight
      const panelHeight = entry.boundingClientRect.height
      const fullyVisibleRatio = panelHeight <= availableHeight
        ? 0.96
        : Math.max(0.72, (availableHeight / panelHeight) * 0.94)

      if (entry.intersectionRatio >= fullyVisibleRatio) {
        setHasStarted(true)
        observer.disconnect()
      }
    }, {
      rootMargin: '-76px 0px -12px 0px',
      threshold: [0.72, 0.8, 0.9, 0.96],
    })

    observer.observe(demo)
    return () => observer.disconnect()
  }, [hasStarted])

  return (
    <figure
      ref={demoRef}
      className={`${styles.discordCommandDemo} ${hasStarted ? styles.discordCommandDemoActive : ''} ${priorVideo ? styles.discordCommandDemoWithVideo : ''} ${priorFeedbacks.length ? styles.discordCommandDemoWithHistory : ''}`}
      style={animationStyle}
    >
      <figcaption className={styles.discordDemoHeader}>
        <span className={styles.discordDemoChannel}>
          <b aria-hidden="true">{inThread ? '↳' : '#'}</b>
          {channel}
          {inThread ? <em>Project thread</em> : null}
        </span>
        <span>{caption} · Discord preview</span>
      </figcaption>

      <div className={styles.discordDemoChat} aria-hidden="true">
        <div className={styles.discordDemoMessages}>
          {priorFeedbacks.length ? (
            <div className={styles.discordPriorFeedbackHistory}>
              {priorFeedbacks.map(({ feedback, version }, index) => (
                <div className={styles.discordPriorFeedbackRound} key={version}>
                  <div className={styles.discordPriorFeedbackMessage}>
                    <span className={styles.discordUserAvatar}>R</span>
                    <div>
                      <p className={styles.discordMessageMeta}>
                        <strong>Richard</strong>
                        <span>Today at 10:{22 + (index * 4)} AM</span>
                      </p>
                      <p className={styles.discordSubmittedCommand}>
                        /feedback feedback: &quot;{feedback}&quot;
                      </p>
                    </div>
                  </div>

                  <div className={styles.discordPriorFeedbackAck}>
                    <span className={styles.discordOrchiaAvatar}>O</span>
                    <div>
                      <p className={styles.discordMessageMeta}>
                        <strong>Orchia</strong>
                        <i>App</i>
                        <span>Today at 10:{23 + (index * 4)} AM</span>
                      </p>
                      <p>Feedback saved as workflow version <strong>{version}</strong>.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {priorVideo ? (
            <div className={styles.discordPriorBotMessage}>
              <span className={styles.discordOrchiaAvatar}>O</span>
              <div>
                <p className={styles.discordMessageMeta}>
                  <strong>Orchia</strong>
                  <i>App</i>
                  <span>Today at 10:18 AM</span>
                </p>
                <p className={styles.discordPriorVideoText}>Batch 1 is complete. Your video is ready.</p>
                <div className={styles.discordVideoPlaceholder}>
                  <div className={styles.discordVideoFrame}>
                    <span>▶</span>
                    <small>{priorVideo.duration}</small>
                  </div>
                  <div className={styles.discordVideoMeta}>
                    <strong>{priorVideo.title}</strong>
                    <span>Generated video · MP4</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className={styles.discordAnimatedUserMessage}>
            <span className={styles.discordUserAvatar}>R</span>
            <div>
              <p className={styles.discordMessageMeta}>
                <strong>Richard</strong>
                <span>Today at 10:24 AM</span>
              </p>
              <p className={styles.discordSubmittedCommand}>{command}</p>
              {attachments.length ? (
                <div className={styles.discordSentAttachments}>
                  {attachments.map((attachment) => <span key={attachment}>{attachment}</span>)}
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.discordAnimatedBotMessage}>
            <span className={styles.discordOrchiaAvatar}>O</span>
            <div>
              <p className={styles.discordMessageMeta}>
                <strong>Orchia</strong>
                <i>App</i>
                <span>Today at 10:24 AM</span>
              </p>
              <div className={styles.discordBotReply}>{reply}</div>
            </div>
          </div>
        </div>

        <div className={styles.discordComposeArea}>
          {attachments.length ? (
            <div className={styles.discordDroppingAttachments}>
              {attachments.map((attachment) => (
                <span key={attachment}>
                  <i aria-hidden="true" />
                  {attachment}
                </span>
              ))}
            </div>
          ) : null}

          <div className={styles.discordComposerBar}>
            <span className={styles.discordComposerAdd}>+</span>
            <span className={styles.discordTypingViewport}>
              <span className={styles.discordTypingText}>{command}</span>
              <i className={styles.discordTypingCursor} />
            </span>
            <span className={styles.discordEnterKey}>Send ↵</span>
          </div>
        </div>
      </div>

      <p className={styles.srOnly}>
        {caption}. {priorVideo ? 'A generated video is already available in the project thread. ' : ''}
        {priorFeedbacks.length ? `${priorFeedbacks.length} rounds of feedback are already saved in the project thread. ` : ''}
        In Discord, type {command} in {inThread ? `the ${channel} project thread` : channel},
        send it, and Orchia replies in the chat.
      </p>
    </figure>
  )
}

export function DiscordDeliveryExample() {
  return (
    <figure className={`${styles.discordCommandDemo} ${styles.discordDeliveryDemo}`}>
      <figcaption className={styles.discordDemoHeader}>
        <span className={styles.discordDemoChannel}>
          <b aria-hidden="true">↳</b>
          product-launch-film
          <em>Project thread</em>
        </span>
        <span>Final delivery · Discord preview</span>
      </figcaption>

      <div className={styles.discordDeliveryChat}>
        <span className={styles.discordOrchiaAvatar} aria-hidden="true">O</span>
        <div>
          <p className={styles.discordMessageMeta}>
            <strong>Orchia</strong>
            <i>App</i>
            <span>Today at 11:08 AM</span>
          </p>
          <p>Your final video is ready.</p>
          <div className={styles.discordFileMessage}>
            <span className={styles.discordFileIcon} aria-hidden="true">▶</span>
            <span><strong>product-launch-film.mp4</strong><small>Delivered in this project thread</small></span>
            <span aria-hidden="true">↓</span>
          </div>
        </div>
      </div>
    </figure>
  )
}
