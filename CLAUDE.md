# Balance Bridge — CLAUDE

## Stack
- Untitled UI React · React 19 + TS · Tailwind v4.2 · React Aria Components foundation.

## `react-aria-components`
- Prefix every imported symbol with `Aria*` (e.g. `Button as AriaButton`).

## Files
- kebab-case for all new `.tsx` / `.ts` / tests / related assets.

## Commands
- `npm run dev` — Vite `http://localhost:5173`
- `npm run build` — production build

## `src/`
- `components/{base,application,foundations,marketing,shared-assets}`, `hooks`, `pages`, `providers`, `styles`, `types`, `utils`

## Patterns
- Compound: `Select.Item`, `Select.ComboBox`.
- `sortCx`: `sizes` sm/md/lg/xl, `colors`/variants, shared `root`/fragments.
- Props: `isDisabled`, `isLoading`, `isInvalid`, `isRequired`.

## Utils & theme CSS
- `cx`, `sortCx`, `isReactComponent` (project `utils`).
- `src/styles/globals.css`, `theme.css`, `typography.css`.

## Brand
- `--color-brand-*` in `src/styles/theme.css`, scale **25–950**; `:root` vs `.dark` swap neutrals + semantics.

## Icons
- `@untitledui/icons` (named, tree-shakeable), `@untitledui/file-icons`, `@untitledui-pro/icons` + duocolor/duotone/solid.
- Icon: component ref **or** child JSX with `data-icon`; decorative → `aria-hidden`.

## Motion
- `motion`, `tailwindcss-animate`; light transitions → `transition duration-100 ease-linear`.

## Disabled
- `disabled:cursor-not-allowed disabled:opacity-50` — **not** legacy v7 disabled utility tokens.

## Providers
- `src/providers/theme.tsx`, `src/providers/router-provider.tsx`.

## Links / nav text
- No `Link` — `Button` + `href` + `link-gray` | `link-color` | `link-destructive`.

## Semantic colors (prefer over raw gray/blue utilities)
- **text-*** / **text-color-***: primary, secondary, tertiary, quaternary, placeholder, white; secondary_hover, tertiary_hover; brand-primary/secondary/tertiary/tertiary_alt/secondary_hover; primary_on-brand → quaternary_on-brand; error|warning|success-primary; error-primary_hover; editor-icon-fg(+_active).
- **border-***: primary, secondary, secondary_alt, tertiary; brand, brand_alt; error, error_subtle.
- **text-fg-*** / **fg-*** tokens: primary, secondary, tertiary, quaternary (+ hovers); brand-primary/secondary (+ _alt, _hover); white; error/warning/success primary & secondary.
- **bg-*** / **background-***: primary, secondary, tertiary, quaternary; *_alt; primary_hover, secondary_hover, active; brand-primary/secondary/solid (+ solid_hover); brand-section(+_subtle); primary-solid; secondary-solid; error/warning/success primary|secondary|solid (+ error-solid_hover); overlay.

## Component cheat sheet
- **Button** `@/components/base/buttons/button` — xs–xl; primary/secondary/tertiary/destructive + link-gray|link-color|link-destructive.
- **Input** `@/components/base/input/input`
- **InputGroup** `@/components/base/input/input-group`
- **Select** `@/components/base/select/select` (compound `Select.Item`, `Select.ComboBox`)
- **MultiSelect** `@/components/base/select/multi-select`
- **ComboBox** `@/components/base/select/combobox`
- **Checkbox** `@/components/base/checkbox/checkbox`
- **Badge** `@/components/base/badges/badges` — gray|brand|error|warning|success|slate|sky|blue|indigo|purple|pink|orange; sizes sm|md|lg
- **Avatar** `@/components/base/avatar/avatar` — xs…2xl; **size `xx` removed (v8)**
- **FeaturedIcon** `@/components/foundations/featured-icon/featured-icon` — themes light|gradient|dark|outline|modern|modern-neue; **modern-neue effective gray-only** (other color slots unused—use gray)
