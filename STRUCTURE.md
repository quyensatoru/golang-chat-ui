Project frontend structure (added scaffold)

src/
├─ components/
│  ├─ layout/                # Navbar, Sidebar, AppProvider
│  ├─ ui/                    # Small shadcn-style primitives (button, input, card...)
│  └─ editor/                # Editor related components
│     └─ MonacoWrapper.jsx   # Lightweight wrapper over @monaco-editor/react
├─ hooks/
│  └─ useTheme.js            # Theme (dark/light) hook using localStorage
├─ lib/
│  └─ prettierClient.js      # Helper to format code with Prettier (dynamic import)
├─ pages/
│  └─ editor/                # Editor page (uses Monaco)
├─ styles/
│  └─ themes.css             # Small theme variables (complements Tailwind)

Notes:
- `MonacoWrapper.jsx` is optional: the page can import `@monaco-editor/react` directly; the wrapper provides a stable place for future customization (workers, options).
- `prettierClient.js` centralizes formatting; Editor page already uses dynamic imports but you can switch to this helper.
- `useTheme.js` toggles `document.documentElement`'s `dark` class and persists choice.

Next steps:
- Wire theme toggle in the Navbar to `useTheme` and switch Monaco theme between `vs-dark` and `light`.
- Optionally move formatting logic in the editor to use `prettierClient.formatWithPrettier`.
