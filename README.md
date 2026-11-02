# Skinstric

Frontend Simplified internship project: an A.I. skin-analysis intro flow built from the Figma design.
The user enters a name and location, uploads or takes a photo, and gets the A.I.'s demographic
estimate (race, age, sex), which they can correct.

**Stack:** Vite, React 19, TypeScript, Tailwind CSS v4, Zustand, React Router. Deployed on Vercel.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run test:watch   # the logic tests, re-run on save
npm run build        # type-check + production build
```

## Screens

| Route           | Figma frame   | What it is                                    |
| --------------- | ------------- | --------------------------------------------- |
| `/`             | 000, 001      | Landing, "Take test" hover                    |
| `/testing`      | 002, 504, 505 | Name, then location (Phase 1)                 |
| `/result`       | 005, 006      | Camera or gallery choice                      |
| `/camera`       | 007, 009, 010 | Selfie (Phase 3)                              |
| loader          | 011           | "Preparing your analysis ..."                 |
| `/select`       | 012           | Analysis menu (only Demographics is in scope) |
| `/demographics` | 013, 014      | Results and corrections (Phase 2)             |

## Where things live

```
src/
  pages/        one file per screen (UI)
  components/   shared UI: Header, DiamondButton, Diamonds, Loader, icons
  store/        Zustand store, saved to localStorage
  hooks/        useAnalyze (shared upload flow), useCamera (camera logic)
  lib/          logic: validation, api, image, demographics (+ tests)
```

See `TODO.md` for the logic still to write, and `DECISIONS.md` for why things are built this way.
