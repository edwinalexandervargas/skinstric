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
