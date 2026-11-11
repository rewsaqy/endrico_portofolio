# DESIGN.md — Endrico Persona Portfolio (rewsaqy)

## Visual Identity
- **Theme:** *Yofukashi no Uta (Call of the Night)* Manga Noir
- **Dials:** `ENERGY 3 / RHYTHM 3 / MOTION 2`
- **Identity Motif:** Diagonal halftone ink slashes (`yofu-slash-bg`), comic screentone dots (`manga-screentone`), skewed rectangular badges (`yofu-badge-skew`), twin 5-point hollow wireframe manga stars, rotating dashed moon ring, kanji stamps (`夜更かし`, `よふかしのうた`), and solid offset hard shadows (`box-shadow: 4px 4px 0px #ffffff` / `#000000`).

## Color Palette
- **Core Neutrals & Canvas:**
  - Deep Night Canvas: `#040407` / `#050508`
  - Obsidian Surface: `#000000` / `#09090d`
  - Stark Ink / Highlight: `#ffffff`
  - High-Contrast Muted Ink: `#a1a1aa` (`zinc-400`) and `#d4d4d8` (`zinc-300`)
- **Scoped Project HUD Accents (`ProjectsPage` only):**
  - *Silent Universe:* Crimson CRT `#dc2626` (`red-600`)
  - *AlgoRhythm:* Cyber Cyan `#06b6d4` (`cyan-500`)
  - *Eight Months:* Case Dossier Amber `#d97706` (`amber-600`)
- **Explicit Constraint:** No pastel rainbow gradients or glassmorphism blurs on main noir surfaces.

## Typography
- **Display & Headings:** `Anton`, `Bebas Neue`, `Space Grotesk`, bold uppercase with `-webkit-text-stroke` and crisp `#000000` drop shadow.
- **Technical HUD & Telemetry:** `JetBrains Mono` / `Courier New` for indices, Japanese stamps, keybind hints, and track metadata.

## Accessibility & Motion
- Minimum contrast target >= 4.5:1 for normal text on dark obsidian backgrounds (`zinc-400` / `zinc-300` / `white`).
- Interactive controls always use native `<button>` or `<a href>` elements with `cursor: pointer`, minimum 44px touch targets on primary actions, visible focus outlines, and `prefers-reduced-motion: reduce` fallbacks.
