---
description: Design system for the Aurora theme - Creative, warm, handcrafted UI components and patterns.
---

# Aurora Design System

This skill provides the design tokens, components, and implementation patterns for the **Aurora Design System used in BuildBrief**. Use this guide to create consistent, high-quality interfaces that match the existing aesthetic.

## Core Principles

1.  **Creative & Warm**: Use deep charcoal backgrounds with vibrant violet/amber/cyan accents. Avoid sterile corporate blues or flat grays.
2.  **Handcrafted Feel**: Use subtle noise/grain overlays, custom scrollbars, and unique typography (Clash Display) to make the UI feel bespoke.
3.  **Glassmorphism**: Heavy use of backdrop blur (`backdrop-blur-xl`), semi-transparent surfaces (`bg-aurora-surface/80`), and subtle borders.
4.  **Interactive**: Elements should react to hover/focus with scale, glow, or color shifts. Use `framer-motion` for smooth transitions.
5.  **Dark/Light Mode**: Use CSS variables for all colors to support seamless theme switching.

## Color Palette

The system uses semantic color names mapped to CSS variables.

### CSS Variables (`index.css`)

```css
@layer base {
  :root {
    /* Light Theme */
    --color-bg: #FAFAFA;
    --color-surface: #FFFFFF;
    --color-surface-hover: #F4F4F5;
    --color-text: #18181B;
    --color-text-muted: #71717A;
    --color-primary: #8B5CF6; /* Violet */
    --color-primary-hover: #7C3AED;
    --color-primary-glow: rgba(139, 92, 246, 0.15);
    /* ... other semantic tokens */
  }

  .dark {
    /* Dark Theme */
    --color-bg: #0F0F12; /* Deep Charcoal */
    --color-surface: #18181B;
    --color-surface-hover: #27272A;
    --color-text: #FAFAFA;
    --color-text-muted: #A1A1AA;
    --color-primary: #8B5CF6;
    --color-primary-hover: #7C3AED;
    --color-primary-glow: rgba(139, 92, 246, 0.15);
  }
}
```

### Tailwind Configuration (`tailwind.config.js`)

Extends the theme with `aurora` color object:

```javascript
colors: {
    aurora: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        surfaceHover: "var(--color-surface-hover)",
        primary: "var(--color-primary)",
        primaryHover: "var(--color-primary-hover)",
        text: "var(--color-text)",
        muted: "var(--color-text-muted)",
        border: "var(--color-border)",
        glow: "var(--color-primary-glow)",
        // ...
    }
}
```

## Typography

-   **Headings**: `Clash Display` (Regular 400, Semibold 600, Bold 700). Distinctive, modern serif/sans hybrid.
-   **Body**: `Inter` (sans-serif). Clean, legible.
-   **Code**: `JetBrains Mono`.

## UI Components

### 1. Glass Card
The foundational container.

-   **Classes**: `bg-aurora-surface/80 backdrop-blur-xl border border-aurora-border/50 shadow-card rounded-2xl`
-   **Hover Effect**: `hover:bg-aurora-surfaceHover/80 hover:border-aurora-primary/30 hover:-translate-y-0.5 transition-all duration-300`
-   **Inner Light**: `[box-shadow:inset_0_1px_0_rgba(255,255,255,0.05)]`

### 2. Glowing Button
Primary action element.

-   **Primary**: `bg-aurora-primary text-white shadow-[0_4px_14px_rgba(139,92,246,0.3)] hover:bg-aurora-primaryHover hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)]`
-   **Interaction**: `active:scale-[0.98]` (using framer-motion `whileTap`).

### 3. Input Field
-   **Style**: `bg-aurora-surface/60 backdrop-blur-sm border border-aurora-border/50 rounded-xl px-4 py-3`
-   **Focus state**: `focus:ring-2 focus:ring-aurora-primary/20 focus:border-aurora-primary/50`
-   **Detail**: Animated bottom gradient line on focus.

## Effects & Assets

-   **Grain Overlay**: A fixed `pointer-events-none` heavy SVG noise filter at low opacity (`0.02` to `0.04`) over the entire body to add texture.
-   **Background Gradients**:
    -   `radial-gradient(ellipse 80% 50% at 50% -20%, var(--gradient-glow-1), transparent)` (Top center glow)
    -   `radial-gradient(ellipse 60% 40% at 80% 100%, var(--gradient-glow-2), transparent)` (Bottom right glow)

## Implementation Guide

When creating new pages or components:

1.  **Start with `<GlassCard>`**: Wrap major content sections in glass cards.
2.  **Use `aurora-*` utility classes**: Always use `bg-aurora-bg`, `text-aurora-text` etc. instead of raw Tailwind colors or hex codes.
3.  **Animate entries**: Use `framer-motion` for `initial={{ opacity: 0, y: 10 }}` `animate={{ opacity: 1, y: 0 }}` on major blocks.
4.  **Typography hierarchy**: Use `Clash Display` for H1-H3, `Inter` for everything else.
5.  **Spacing**: Use generous padding (`p-6`, `p-8`) inside cards to let content breathe.
