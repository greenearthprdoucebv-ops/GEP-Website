# GreenEarth Produce — Project Structure

```
HomePagePrototype/
├── index.html          ← HTML only (no inline styles or scripts)
│
├── css/
│   ├── base.css        ← Reset, CSS variables, shared .btn styles
│   ├── navbar.css      ← Fixed navbar + frosted-glass scroll state
│   ├── hero.css        ← Full-viewport hero, parallax bg, scroll hint
│   ├── features.css    ← Product blocks with slide-in animations
│   ├── why.css         ← Green card grid with stagger fade-in
│   └── footer.css      ← 4-column footer grid
│
├── js/
│   └── main.js         ← All JS: parallax, navbar, fade observers
│
└── assets/
    ├── hero_bg.png     ← Hero background image
    ├── img1.png        ← Brazilian Peru Ginger product photo
    └── img2.png        ← Chinese Ginger product photo
```

## How to use

Open `index.html` in a browser directly — no build step needed.

## CSS variable reference (defined in base.css)

| Variable        | Value     | Usage                        |
|----------------|-----------|------------------------------|
| `--green`       | #2ecc8a   | Brand primary, buttons       |
| `--green-dark`  | #27a874   | Hover states                 |
| `--green-light` | #e6f9f1   | Backgrounds (reserved)       |
| `--text`        | #1a1a1a   | Body text                    |
| `--muted`       | #666666   | Secondary text               |
| `--bg`          | #f5f4f0   | Page background (off-white)  |
| `--white`       | #ffffff   | Cards, footer background     |

## JS behaviour summary (main.js)

| Section | Trigger | What it does |
|---------|---------|--------------|
| Hero parallax | `scroll` | Moves `.hero-bg` at 35% scroll speed |
| Navbar | `scroll` past 85% of hero height | Adds `.scrolled` → frosted glass + opacity:1 |
| Feature blocks | `IntersectionObserver` @ 75% | Adds `.visible` / `.fade-out` on enter/leave |
| Why cards | `IntersectionObserver` @ 15% | Adds `.visible` with staggered delay (fires once) |
