# D&D Character Select

Reusable, dependency-free character selection screen built with plain HTML, CSS, and JavaScript.

## Included demo

- Seven placeholder character SVGs shown at the same time.
- Inactive characters are darkened; hover/focus brightens them.
- Clicking locks a selection and updates the description panel.
- A generated fantasy-style background placeholder lives at `assets/backgrounds/camp.svg`.
- A short generated MP3 test tone lives at `assets/music/demo-theme.mp3` so audio behavior can be tested without copyrighted music.

## Run locally

Open `index.html` in a browser. No install, npm, framework, database, or build step is required.

## Customize the roster

Edit `characters.js`. The app does not assume exactly seven characters. Each entry supports:

```js
{
  id: "my-character",
  name: "My Character",
  subtitle: "Human · Paladin",
  description: "Character description here.",
  image: "assets/characters/my-character.webp",
  music: "assets/music/my-character.mp3",
  x: 50,
  y: 98,
  scale: 1,
  z: 5
}
```

`x` and `y` position the figure, `scale` changes its size, and `z` controls which figures appear in front.

## Replace the demo assets

Put transparent PNG, WebP, or SVG character artwork in `assets/characters/` and update each `image` path. Put local audio in `assets/music/` and update each `music` path. Use only audio and artwork you are permitted to distribute.

The demo background is referenced from `styles.css`:

```css
url('assets/backgrounds/camp.svg')
```

Replace that path with your campaign background when ready.

## GitHub Pages

This repository is a static site, so GitHub Pages can publish it directly from a branch without a build process. After merging this starter into `main`, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.

Important: a normal GitHub Pages site is publicly available on the internet even when its source repository is private. Private-repository Pages support also depends on your GitHub plan. Do not put secrets or private campaign material in the published files if you do not want it publicly accessible.

## File map

```text
├── index.html
├── styles.css
├── characters.js
├── app.js
├── README.md
└── assets/
    ├── backgrounds/
    │   └── camp.svg
    ├── characters/
    │   ├── character-01.svg
    │   └── ... character-07.svg
    └── music/
        └── demo-theme.mp3
```
