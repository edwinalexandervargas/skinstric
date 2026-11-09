# Decision Log

Short notes on the choices I made while building this project and why.
Each entry: what I did, why, what else I considered, and what it costs.

## Template

### Title of the decision

- **What:**
- **Why:**
- **Alternative I rejected:**
- **Trade-off:**

---

## 1. Vite + React instead of Next.js

- **What:** A Vite single-page app with React Router.
- **Why:** Nothing here needs SEO or server code: the two APIs are public, with no secrets to hide.
  Almost everything the app does is a browser API (camera, FileReader, canvas, localStorage),
  which all just work in a single-page app. In Next.js they'd all need `"use client"`.
- **Alternative I rejected:** Next.js. Its main strengths (server rendering, server routes) go unused here.
- **Trade-off:** Blank page until the JavaScript loads, and routing is set up by hand. Vercel needs
  a rewrite (`vercel.json`) so refreshing `/demographics` doesn't 404.

## 2. Tailwind, plus a little plain CSS for the diamonds

- **What:** Tailwind for layout and type, using tokens copied from Figma (`@theme` in `index.css`).
  The dotted rotated squares are one small `.diamond` class.
- **Why:** The design is minimal and very consistent, which is what Tailwind is good at. A dotted,
  rotated, layered shape is clearer as plain CSS than as a long class string.
- **Alternative I rejected:** All plain CSS (more naming, easier to drift off the tokens).
- **Trade-off:** Two styling approaches to know about, though the CSS part is tiny.

## 3. Icons exported from Figma

- **What:** The arrow diamond, camera, gallery and shutter icons are SVGs copied from the Figma file.
- **Why:** They're custom shapes, and "UI matches Figma" is a requirement. React Icons has nothing close.
- **Trade-off:** If the design changes, they have to be exported again by hand.

## 4. Zustand, saved to localStorage

- **What:** One small store (`src/store/useSkinstric.ts`) holds the name, location, results and the
  user's corrections, and persists them to localStorage. The photo itself is kept in memory only.
- **Why:** Six screens share this data. The spec asks for local storage, and Zustand's `persist`
  does that in one line. A photo can be hundreds of KB, which is too much for localStorage's ~5 MB.
- **Alternative I rejected:** Context (re-renders every reader), Redux (too much setup for this).
- **Trade-off:** Refreshing the page loses the photo, but not the results.

## 5. Corrections stored separately from the A.I.'s answer

- **What:** `results` is exactly what the API sent; `picks` holds only what the user changed.
  The sidebar shows `picks[category] ?? topLabel(results[category])`.
- **Why:** Reset is just "empty `picks`", and the A.I.'s original answer is never overwritten.
- **Trade-off:** One extra lookup when displaying.

## 6. Age buckets sorted by score, not by age

- **What:** The age list uses the API's real buckets (0-2, 3-9, ...) sorted highest score first.
- **Why:** The spec says "descending order". The Figma mockup lists ages in age order with a
  0-9 bucket, but that bucket doesn't exist in the API.
- **Trade-off:** The list doesn't look exactly like the mockup.

## 7. Shrink the photo before sending it

- **What:** Every photo is resized (longest side 800 px, JPEG) before going to the API.
- **Why:** Phone photos are 5 to 10 MB, which is slow to send and can be over the server's
  request limit. 800 px is plenty for a face. The camera and the gallery share the same step.
- **Trade-off:** Slight quality loss, and the canvas step has to be written and tested by hand.

## 8. Lowercase "image" key for the Phase 2 API

- **What:** `analyzeImage` sends `{ image: <base64> }`, not `{ Image: ... }` as the PDF shows.
- **Why:** Probing the live endpoint showed only the lowercase key works. The `data:image/...;base64,`
  prefix makes no difference either way; we strip it anyway so the body is plain base64.
- **Alternative I rejected:** Following the PDF's capital "Image". It looked right on paper but
  failed against the real API.
- **Trade-off:** The code disagrees with the spec PDF, so the test comment points here.

## 9. Letters-only validation, with a few punctuation marks allowed

- **What:** Name allows letters, spaces, hyphens, apostrophes and periods. Location allows the
  same plus commas. Both are trimmed first and can't be empty.
- **Why:** The PDF says no numbers or broken values. Real names include things like
  "O'Brien", "Mary-Jane" and "Jr.", and locations like "Los Angeles, CA", so plain a-z was too strict.
  `\p{L}` accepts letters from any language (José, Zoë).
- **Alternative I rejected:** Only `a-z` and spaces. Simpler, but it blocks real names.
- **Trade-off:** It still lets through odd input like "---", which is good enough for this app.

## 10. Selfie preview is mirrored, the saved photo is not

- **What:** The live camera preview is flipped with CSS (`-scale-x-100`). `captureFrame` draws
  the raw video, so the photo sent to the API is not flipped.
- **Why:** A mirrored preview feels natural, like looking in a mirror. The photo itself should
  show the face the way other people see it.
- **Alternative I rejected:** Flipping the captured photo too. It adds canvas code for no benefit
  to the A.I. result.
- **Trade-off:** The photo can look "backwards" compared to the preview, the same as most phone cameras.

## 11. Camera logic in plain functions, the hook just wires them up

- **What:** `openFrontCamera` and `stopStream` live in `src/lib/camera.ts` with tests.
  `useCamera` only stores the stream, attaches it to the `<video>`, and sets the status.
- **Why:** The tests run in Node without React Testing Library. Plain functions can be tested
  with a fake `navigator`, the same way the API tests fake `fetch`.
- **Alternative I rejected:** Putting everything in the hook and adding React Testing Library
  plus a browser-like test setup just for this.
- **Trade-off:** The hook's own wiring isn't covered by tests, so it was checked by hand in the browser.

## 12. Front camera only, no microphone, clear error when unsupported

- **What:** The camera asks for `facingMode: 'user'` and `audio: false`. If the browser has no
  `navigator.mediaDevices` (plain http or an old browser), it throws "Camera is not available in
  this browser", which the page shows.
- **Why:** It's a selfie, so the front camera is the right default, and asking for the mic would
  add a scary extra permission. Without the check, users would see a confusing crash message.
- **Alternative I rejected:** A switch-camera button. Not in the design or the PDF.
- **Trade-off:** Testing on a phone needs https, so it has to go through the Vercel link.


## 13. Only Demographics is built; the other analysis tiles stay disabled

- **What:** On the analysis menu, Cosmetic concerns, Skin type details and Weather show as
  disabled tiles with no page behind them. Only Demographics opens.
- **Why:** The PDF's three phases only cover demographics (race, age, gender), and the Phase 2 API
  only returns those three. There's no real data to show for the other sections.
- **Alternative I rejected:** Building those pages with made-up data. It would look finished
  but be fake, and it's outside the spec.
- **Trade-off:** The menu has tiles that don't do anything yet, but they match the design and
  leave room for those features later.
