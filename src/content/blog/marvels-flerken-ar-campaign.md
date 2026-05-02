---
title: "Marvel's Flerken — AR Marketing for The Marvels"
slug: "marvels-flerken-ar-campaign"
date: "2024-11-10"
excerpt: "Real-time object detection that turned cats into Flerkens for the official AR marketing campaign behind The Marvels — deployed on TikTok and the Regal Cinema app."
featuredImage: "https://www.lingyizhou.com/assets/spectacles-1771906913985.gif"
---

## Overview

An interactive AR filter built as the official AR marketing campaign for Marvel's *The Marvels*. The filter uses real-time object detection to recognize cats in the camera feed and transforms them into Flerkens — the universe's friendliest tentacled cosmic predator — in real time. Deployed across TikTok and the Regal Cinema app, the campaign reached viral distribution and significant user engagement during the film's launch window.

<div class="post-video">
  <video
    src="https://www.lingyizhou.com/assets/cargo-import/marvel-s-flerken-ar-filter-commercial-ar-campaign/1697673358881.mp4"
    autoplay
    muted
    loop
    playsinline
    preload="metadata"
    aria-label="Marvel's Flerken AR Filter campaign clip"
  ></video>
</div>

## Focus

Real-time object detection and visual overlay pipeline for a cross-platform AR marketing campaign — designed to be immediate, learn-itself-quickly, and survive the constraints of phones in cinemas and on social feeds.

The interesting part of the work was making the interaction feel instant while still respecting device constraints, camera input, and the expectation that a marketing AR experience earns about three seconds before the user swipes.

## Approach

Three constraints shaped the build:

1. **Recognize-first interaction.** A user shouldn't have to tap, frame, or read instructions. Open the filter, point at a cat, see the cat become a Flerken. The object-detection model runs in-camera on each frame and only commits the overlay when confidence holds steady, so the Flerken doesn't pop in and out on shaky frames.
2. **Cross-platform shipping.** The filter targeted both TikTok (Effect House) and the Regal Cinema app (custom AR runtime built on Lens Studio's pipeline). The visual layer and the detection pipeline were authored once and adapted twice — same shaders, same model, different host.
3. **Cinema-screen safety.** Because the filter ran inside the Regal Cinema app — including in low-light theatre lobbies — exposure handling, motion smoothing, and a graceful fallback when no cat was detected all had to be tuned for environments far less forgiving than a sunlit feed shoot.

## Tools and Stack

- **Lens Studio** for the Snap-side build and shared visual pipeline
- **Effect House** for the TikTok deployment
- **JavaScript** for runtime logic and state
- **HLSL** for custom shaders (the Flerken texture, the tentacle materials, the bloom)
- **Object Detection** for cat recognition — the entry trigger of the entire experience

The technology was chosen for fit, not novelty — every layer is the boring, well-supported answer for a campaign that had to ship on a film release schedule.

## Outcome

The campaign launched in 2023 alongside *The Marvels* and ran across TikTok and the Regal Cinema app, achieving viral distribution within the film's launch window. It stands as a practical AR marketing case — a clean execution where the technology stays out of the way and the brand moment lands in under three seconds.

For an e-commerce equivalent, the same pattern applies: a customer points their camera at a couch, a wall, a foot, a ring finger — and the product is there at real-world scale with no instructions, no tutorial, and no app install. The detection and overlay work that made the Flerken filter feel effortless is the same engine that makes a virtual try-on feel like part of the room.

[See more work →](/#case-study)
