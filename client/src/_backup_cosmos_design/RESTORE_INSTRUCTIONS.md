# Cosmos Design Theme Backup

This folder contains the original "Cosmos" design theme that was active before the UI overhaul.

## How to Restore

To restore this design, run these commands from the `client/` directory:

```powershell
# 1. Restore CSS
Copy-Item -Path "src/_backup_cosmos_design/index.css" -Destination "src/index.css" -Force

# 2. Restore Tailwind config
Copy-Item -Path "src/_backup_cosmos_design/tailwind.config.js" -Destination "tailwind.config.js" -Force

# 3. Restore App.tsx
Copy-Item -Path "src/_backup_cosmos_design/App.tsx" -Destination "src/App.tsx" -Force

# 4. Restore components (this will overwrite current components!)
Remove-Item -Path "src/components" -Recurse -Force
Copy-Item -Path "src/_backup_cosmos_design/components" -Destination "src/components" -Recurse
```

Or simply tell the AI assistant: **"Restore the original Cosmos design from backup"**

## Design Tokens (Cosmos Theme)

```js
colors: {
  cosmos: {
    bg: "#0B1120",        // Deep Slate
    card: "rgba(15, 23, 42, 0.6)",  // Glass
    border: "rgba(56, 189, 248, 0.2)", // Subtle Blue
    primary: "#7C3AED",   // Nebula Purple
    secondary: "#38BDF8", // Starlight Blue
    text: "#F8FAFC",      // Slate 50
    muted: "#94A3B8",     // Slate 400
  }
}
```

## Files Included

- `index.css` - Main styles with cosmos gradient background
- `tailwind.config.js` - Tailwind theme with cosmos colors
- `App.tsx` - Main app component
- `components/` - All UI and template components

## Date Backed Up
2026-01-29
