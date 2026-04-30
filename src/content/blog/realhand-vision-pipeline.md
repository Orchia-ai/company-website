---
title: "Building Realhand's Vision Pipeline"
slug: "realhand-vision-pipeline"
date: "2026-04-15"
excerpt: "How we shipped a real-time hand-tracking pipeline on-device using a custom WebGPU inference path."
featuredImage: "/logos/realhand.svg"
---

## The Problem

Realhand needed sub-30ms hand pose estimation running entirely on-device, with no cloud round-trip. Existing solutions either required a beefy GPU server or shipped a 50MB model that destroyed first-load performance.

## The Approach

We took a three-part bet:

1. **Distill the model** — Knowledge distillation from MediaPipe Hands into a custom 4MB architecture tuned for the keypoint set Realhand actually uses.
2. **WebGPU compute path** — A WebGPU shader pipeline for the hot loop (NMS + landmark regression), falling back to WebGL where unavailable.
3. **Frame skipping with motion prediction** — Run full inference at 30fps, interpolate the off-frames using a Kalman filter on prior keypoints.

```ts
const session = await ort.InferenceSession.create(modelUrl, {
  executionProviders: ['webgpu', 'webgl'],
  graphOptimizationLevel: 'all',
})
```

## Results

- **22ms median latency** on a 2022 MacBook Air
- **4.1MB model bundle**, lazy-loaded after first interaction
- **94.2% keypoint accuracy** retained vs. teacher model

## What's Next

Streaming model updates, multi-hand tracking, and a wasm fallback for browsers without WebGPU/WebGL2.
