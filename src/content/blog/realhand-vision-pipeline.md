---
title: "From Robot Hands to Showrooms: Real-Time 3D in the Browser"
slug: "realhand-vision-pipeline"
date: "2026-04-30"
excerpt: "Browser-based hand tracking that drives 31 robotic hand models from a webcam — and the same engine that turns a flat product photo into a showroom you can rotate and place."
featuredImage: "https://img.youtube.com/vi/xwrGzC8Z14s/maxresdefault.jpg"
---

A product photo stops working the moment a customer wants to know how thick the cushion is, what the back joinery looks like, or whether the brass leg is satin or polished. They reach for "more photos." If there aren't more photos, they leave.

The fix is not more photos. The fix is the product itself, in the browser, that they can pick up and turn over.

This is the same engineering pattern we used to ship Realhand's real-time teleoperation interface — and it is what we now bring into commerce.

## Realhand — the proof case

A real-time 3D visualization platform that uses webcam-based hand tracking to control robotic hand models entirely in the browser. Built with MediaPipe and Three.js, it tracks 21 hand keypoints via AI and maps them to 31 different robotic hand models with zero installation required.

The product question behind the work was straightforward: how do you let an operator inspect, calibrate, and demonstrate a robotic hand without shipping hardware to every prospective customer or engineer? Putting the simulator in the browser collapses the entire onboarding loop — open a URL, allow the camera, the robot moves with your hand.

<div class="post-video">
  <iframe
    src="https://www.youtube.com/embed/xwrGzC8Z14s?autoplay=1&mute=1&loop=1&playlist=xwrGzC8Z14s"
    title="Real-Time 3D Robot Hand Teleoperation"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

### Approach

Three constraints shaped the architecture:

1. **Camera-first input.** MediaPipe Hands runs in the browser and emits 21 keypoints per frame. The pipeline normalizes those keypoints into a joint-angle vector that any URDF-described hand can consume — input is hand-agnostic, output is hand-specific. That is what unlocks 31-model coverage from a single pipeline.
2. **Real-time 3D rendering.** Three.js (via React Three Fiber and Drei) handles the scene graph, the URDF loader, lighting, and orbit controls. Every frame has to do CV inference, joint mapping, and a render — the React tree stays shallow and most state lives in Zustand outside React's render path.
3. **Zero install.** A static web app. No native binaries, no plugins, no marketplace approvals. A prospective customer can scan a QR code on a trade-show floor and be teleoperating a robotic hand on their phone within seconds.

### Stack

- **React 18** for the application shell
- **Zustand** for high-frequency state outside the render path
- **Three.js** as the 3D engine
- **React Three Fiber** to bind Three.js into React idioms
- **React Three Drei** for orbit controls, environment, and helpers
- **MediaPipe Hands** for the 21-keypoint webcam pipeline
- **URDF** parsing for the 31 hand models

Chosen for fit, not novelty. Every layer is the boring, well-supported answer to its slot — which is what real-time work needs.

[Try the live build →](https://www.realhand.com/demo)

## What this means for commerce

The difference between rotating a robotic hand at 60 frames per second and rotating a side table at 60 frames per second is the model and the lighting rig — not the engine. The technical work is already done. We adapt a system that already runs at frame rate against camera input, and point it at a catalogue.

What 3D actually does on a product page comes down to three things, and only one of them is "looks cool."

1. **Eliminates the photo-deficit gap.** A 3D model is every angle, simultaneously. The customer who wants to see the seam under the armrest gets it without commissioning another shoot. On furniture sites where photo coverage was the constraint, this collapses the bounce-off-PDP rate.
2. **Sets honest expectations.** Real-scale rendering with accurate materials means fewer returns. Brands like **Crate & Barrel**, **Pottery Barn**, and **Burrow** ship `<model-viewer>` on their PDPs for exactly this reason — the return cost of a sofa that's "smaller than I expected" is worse than the engineering cost of giving people the truth up front.
3. **Becomes the AR entry point for free.** Once you have a clean glTF model, the same asset launches a native AR session on iOS (Quick Look) and Android (Scene Viewer). One file, two surfaces.

Imagine the kind of brand that takes its photography seriously — **Muji**, **Hay**, **Menu**, **Common Projects**. Their product pages already do most of the work through composition. What 3D adds is the next half-inch of confidence:

- A walnut stool the customer can flip over to see the join.
- A linen napkin that picks up real light on its weave when you orbit it.
- A ceramic vase that, with two taps, drops onto your living room floor at real scale through the camera.

None of that requires changing the brand voice. The 3D viewer slots into the existing PDP layout. The photography stays. The 3D is what happens when the customer is hovering on the buy button and not quite sure.

## What we hand off

- A reusable React 3D viewer component (orbit controls, restrained interaction prompts, brand-tinted lighting environment).
- A glTF/USDZ asset pipeline — Blender or Reality Composer to a binary `.glb` and a paired `.usdz` for iOS AR Quick Look — sized for fast first paint (~2 MB target).
- AR fallback via Google's `<model-viewer>` so the same model launches the native AR session on both iOS and Android.
- A QR bridge for desktop visitors so they can scan-to-continue on phone with the AR session pre-armed.
- Asset CMS plumbing — uploading a new `.glb` should not require a deploy.

## The pitch, plainly

If you are a lifestyle or furniture brand whose product page is doing 80% of the conversion work and the last 20% is "I can't quite tell from the photos," 3D is the cheapest 20% you can add. The engineering is solved. The asset cost is one-time per SKU. The conversion lift, where it matters, is on items where uncertainty is the actual obstacle to checkout.

If that sounds like your catalogue — sofas, lighting, ceramics, furniture, anything tactile — [start a conversation](/#contact). We will show you a working viewer with one of your products inside a week.
