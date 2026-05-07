# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js version warning

This project runs **Next.js 16.2.4 with React 19**. APIs, conventions, and file structure differ from training data. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # serve production build
```

There is no lint script and no test suite configured.

## Architecture

### Page and component structure

```
pages/_document.js   # custom HTML shell — fonts + FOUC-prevention script
pages/_app.js        # wraps every page in <ThemeProvider> + <Header> + <Footer>
pages/index.js       # the entire homepage (all sections in one file)
context/ThemeContext.js
components/Header.js / Footer.js / ThemeToggle.js
styles/globals.css           # CSS variables + base reset
styles/Home.module.css       # all homepage section styles
styles/Header.module.css / Footer.module.css / ThemeToggle.module.css
```

### GSAP scroll-pinned scene system (`pages/index.js`)

The homepage is built around **one pinned master container** (`masterRef`) that GSAP pins for 9000px of scroll. Three full-screen scenes (`position: absolute`) are stacked inside it and animated in sequence via a single scrubbed `gsap.timeline`. Scenes are never removed from the DOM — GSAP controls `opacity`, `scale`, `xPercent`, and `yPercent` to transition between them.

| Scene | Trigger range | Technique |
|---|---|---|
| Scene 1 — Hero | 0 → 0.28 | "Elevated" zooms to scale 30, white flash overlay |
| Scene 2 — About | 0.24 → 0.62 | scale + opacity materialise from center, image stack reveals |
| Scene 3 — Capabilities | 0.62 → 1.0 | slides in from right, horizontal card scroll inside pin |

The `useLayoutEffect` runs all `ScrollTrigger` setup and returns a full cleanup (kill + revert). The non-pinned sections (Work, Clients, Contact) use independent `ScrollTrigger` instances outside the master timeline.

### Hero: video-through-text mask technique

The "Elevated" letterform shows live video playing through it. This is achieved with two stacked layers:

- **`maskLayer`** (`z-index: 3`): a full-screen div with `background: #ffffff; mix-blend-mode: screen`. `screen(white, video) = white` everywhere — except where the black `elevatedTextMask` text sits, where `screen(black, video) = video`. The video plays only through the letterform.
- **`overlayLayer`** (`z-index: 6`): holds "Your Brand" and a transparent layout-ghost "Elevated" that anchors "Your Brand" positioning.

**Dark mode** flips the technique: `maskLayer` uses `background: #09080C; mix-blend-mode: multiply` and `elevatedTextMask` uses `color: var(--fg)` (near-white) so `multiply(near-white, video) ≈ video`.

Breaking either the blend mode or the text colour breaks the video reveal. `elevatedTextMask` must be `#000` in light mode and `var(--fg)` in dark mode. `elevatedTextSolid` in `overlayLayer` must stay `color: transparent` — it is a layout spacer only.

Designed background layers (grain, spotlight, rule lines, brand K, compass arc) sit at `z-index 1–4`. The K SVG uses `stroke="currentColor"` so CSS can flip it between dark ink (light mode) and white (dark mode) via `.heroBgK { color: ... }`.

### Theme system

**No-FOUC script** — `pages/_document.js` injects an inline `<script>` that runs before React hydration. It reads `localStorage` (or `prefers-color-scheme`) and sets `data-theme` on `<html>` immediately, preventing any flash of the wrong theme on page load.

**Runtime toggle** — `context/ThemeContext.js` manages the toggle. It plays a GSAP `clip-path` circle ripple that expands from the button's bounding rect. The theme CSS variables are applied (`data-theme` attribute + `localStorage`) only in `onComplete` — after the ripple fully covers the screen. This means the visual switch happens while the ripple overlay covers the page.

**CSS variable scoping** — `styles/globals.css` defines all design tokens as `:root` variables. Dark overrides use `[data-theme="dark"]` on the same root. Component CSS Modules apply dark overrides with `:global([data-theme="dark"]) .localClassName { }`. Using `var(--fg)`, `var(--accent)`, etc. auto-adapts to the active theme without any additional dark override.

### CSS architecture

- All design tokens (colours, type scale, spacing, easing) live in `styles/globals.css` `:root`.
- Component styles use CSS Modules. Shared typographic classes (`titleLarge`, `textBody`, `eyebrowLight`, `ctaLinkLight`) are defined in `Home.module.css` and reused across sections within the homepage.
- To override a shared class within a specific section without affecting others, use a descendant scoped rule inside the same module file: `.capaHeaderSection .titleLarge { ... }`.
- Hard-coded hex values in component CSS files (e.g. `#09080C`) are dark-mode base colours and must stay in sync with `--bg` dark token in `globals.css`.

### Header scroll-awareness

`components/Header.js` listens to `window.scrollY`. Below the `DARK_THRESHOLD` (1500px — inside the hero), the header renders transparent with white text. Above it (About scene and beyond), it switches to `.dark` class: frosted glass background with dark text. In dark mode the header never switches (hero is always dark).
