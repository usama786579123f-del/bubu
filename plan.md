# Bubu Birthday Lounge — Implementation Plan

A warm, intimate, interactive long-distance birthday lounge for Mano Yousfii (Bubu), presented as a shared celebration with Usama. The supplied cartoon birthday video is integrated as the hero/surprise moment.

## Build approach
- React + Vite + TypeScript single-page app with Tailwind dependency, custom CSS tokens, and Lucide icons.
- Frontend-first local experience with localStorage for memories, chosen flavor, quiz progress, and optional voice-note metadata/audio when permitted.
- Web Audio API for unlockable ambient celebration and lightweight party effects; Canvas Confetti for direct-action celebrations.
- A fixed, mobile-first birthday rail uses project-storage audio: a natural Roman Urdu-English birthday wish loop and a low-volume realistic birthday-room crowd loop. Browser autoplay policy is respected: the first gift tap unlocks and starts the mix, while the rail stays available during scrolling.
- CSS/SVG visuals for candles, smoke, cake, radar, hearts, equalizer, wax seals, polaroids, certificate and responsive layout.
- Project-storage video path embedded in the hero and entrance journey, with native controls and graceful skip path.

## Experience
Entrance gift surprise; hero video; virtual cake ceremony with four flavors, wish/candle interaction and cake cutting; presence hub with distance story and Roman Urdu letter; soundboard/player; a separate optional MediaRecorder voice-note feature for a personal microphone message; five Open When letters; draggable memory wall; printable Best Friend certificate; four-question chemistry quiz.

## Design
Editorial romantic celebration lounge: mocha candlelight, champagne-gold foil, blush pink, cream stationery, Playfair Display titles, Caveat notes, Plus Jakarta Sans controls. Asymmetric long-form sections, tactile envelopes/polaroids, restrained motion, confetti only after direct interaction, reduced-motion support, and an always-visible bottom audio rail optimized for small screens.

## Structure
`src/App.tsx` holds the experience and interactions; `src/index.css` holds the visual system; `src/main.tsx` is the entry; `public/manus-routes.json` declares `/`; project storage serves the uploaded MP4, birthday voice WAV and crowd MP3 through the Vite dev/preview storage proxy. No external login, payment, or server database is required in this version.

## Validation and delivery
Register TypeScript diagnostics, install with pnpm, run the Vite preview on port 3000, validate `/`, `/manus-routes.json`, the MP4 route and both audio routes, run the production build, inspect desktop/mobile rendering, and commit/push to the canonical `main` branch.

## Golden journey visual update
The supplied `GoldenBirthdayJourneyforBubu.png` is a lazy-loaded, gold-framed cinematic showcase below the hero/ticker. It mirrors the requested gold/red birthday journey mood while the live cake, presence, letters, memory, voice and quiz controls remain real interactive sections below it. The showcase CTA scrolls directly into the live cake ceremony, so the image adds visual direction without replacing the working experience.
