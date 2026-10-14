# Rezerv Frontend Assessment - Part 1

Responsive single-page animation challenge built with React, TypeScript,
Tailwind CSS, and Framer Motion. The page uses original playful character
concepts instead of copying the reference site's branding or NFT artwork.

## Links

- **Live Demo:** https://rezerv-frontend-assessment.vercel.app/
- **GitHub Repository:** https://github.com/nguwah-khaing/rezerv-frontend-assessment/tree/main/part-1-animation

## Setup

```bash
npm install
npm run dev
```

The local development server runs with Vite. After starting the server, open the
URL printed in the terminal.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

- `npm run dev` starts the local development server.
- `npm run build` runs TypeScript checks and creates the production build.
- `npm run preview` serves the production build locally.

## Implemented Sections

The assessment asks for any three sections from the reference page. I implemented
the recommended set:

1. **Loading screen / preloader** - animated loader, progress track, and fade-out
   transition into the page.
2. **Hero section** - staggered entrance reveal, floating character objects,
   animated decorative elements, CTA hover states, and responsive navigation.
3. **Collection / story section** - scroll-triggered reveals, collectible cards,
   hover interactions, marquee motion, and a follow-up content block.

## Libraries Chosen

- **React + TypeScript** - componentized UI with type-safe props and predictable
  state handling.
- **Tailwind CSS** - utility styling foundation and responsive helpers.
- **Custom CSS** - detailed art direction, layout, breakpoints, and animation
  surfaces that are easier to tune outside utility classes.
- **Framer Motion** - preloader transition, entrance animation, viewport reveals,
  looping object motion, and hover interactions.
- **Lucide React** - lightweight icons for navigation and CTA affordances.

## Animation Approach

- The preloader covers the initial load and fades into the main page.
- Hero content uses staggered opacity and translate reveals.
- Character objects use transform-based floating, rotation, scale, and hover
  motion.
- Scroll sections use a reusable `Reveal` component with `whileInView` and
  `viewport.once` so animations do not keep replaying unnecessarily.
- Buttons, cards, links, and character elements include hover states to match the
  interactive feel of the reference.
- Smooth scrolling is handled with native CSS `scroll-behavior`; no extra smooth
  scroll library was added because the page scope is small.

## Responsiveness

The layout supports the required desktop, tablet, and mobile breakpoints:

- Desktop uses a two-column hero and four-column collection grid.
- Tablet reduces object sizes and changes the collection grid to two columns.
- Mobile stacks the hero, uses a compact menu, tightens spacing, and keeps the
  cards readable on narrow viewports.

## Performance Notes

- Most motion is based on `transform` and `opacity`, which avoids expensive layout
  recalculation during animation.
- Scroll reveal animations run once per element.
- There are no large videos, canvas scenes, or heavy third-party visual assets.
- The only image asset is the preloader GIF.
- CSS marquee uses transform animation.
- `prefers-reduced-motion` is respected in both CSS and Framer Motion paths.
- Production build check passes with `npm run build`.

## Assumptions

- The assessment allows replacing the reference branding/artwork with original
  assets and character concepts.
- The goal is a polished single-page prototype, not a full production website.
- CTAs and navigation can use same-page anchors because the brief says real
  navigation and working CTAs are not required.
- The collection and story content are treated as one content area for the third
  implemented section.

## Deployment

This app can be deployed as a static Vite site.

Recommended Vercel settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Recommended Netlify settings:

- Build command: `npm run build`
- Publish directory: `dist`
