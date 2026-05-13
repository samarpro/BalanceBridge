---
name: Serene Well-being System
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#424842'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#737972'
  outline-variant: '#c2c8c0'
  surface-tint: '#4a654e'
  primary: '#4a654e'
  on-primary: '#ffffff'
  primary-container: '#8ba88e'
  on-primary-container: '#233d29'
  inverse-primary: '#b0ceb2'
  secondary: '#266868'
  on-secondary: '#ffffff'
  secondary-container: '#aeeeee'
  on-secondary-container: '#2e6e6e'
  tertiary: '#605e55'
  on-tertiary: '#ffffff'
  tertiary-container: '#a4a196'
  on-tertiary-container: '#393830'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cceace'
  primary-fixed-dim: '#b0ceb2'
  on-primary-fixed: '#07200f'
  on-primary-fixed-variant: '#334d38'
  secondary-fixed: '#aeeeee'
  secondary-fixed-dim: '#93d2d1'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f50'
  tertiary-fixed: '#e6e2d6'
  tertiary-fixed-dim: '#cac6bb'
  on-tertiary-fixed: '#1d1c15'
  on-tertiary-fixed-variant: '#48473e'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Atkinson Hyperlegible Next
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-margin-mobile: 20px
  container-margin-desktop: 48px
  gutter: 16px
  section-gap: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The brand personality is grounded in **psychological safety** and **gentle empowerment**. It aims to reduce cognitive load and cortisol levels through a "Conquerable" aesthetic—meaning the interface feels organized, manageable, and never demanding. 

The design style is a blend of **Modern Minimalism** and **Soft Tactility**. It prioritizes heavy white space (breathability) and subtle, diffused depth to create a sense of physical comfort. Every interaction should feel like a soft exhale, avoiding sharp edges or aggressive transitions. The goal is to move the student from a state of overwhelm to one of tranquil focus and emotional relief.

## Colors
This design system utilizes a palette of high-order harmony to ensure no element feels jarring or visually "loud."

- **Primary (Sage Green):** Used for growth-oriented actions and success states. It represents stability and natural calm.
- **Secondary (Muted Teal):** Used for deep focus areas, reflections, and secondary navigation. It provides a sense of depth and tranquility.
- **Tertiary (Warm Sand):** Used for subtle backgrounds and grouping elements to provide warmth and human touch.
- **Surface/Neutral (Off-White):** The base canvas is a soft, non-reflective warm white to reduce eye strain and provide an airy foundation.
- **Status Colors:** Success is handled by the primary sage; warnings use a soft terracotta; info uses a muted slate blue.

## Typography
The typography strategy prioritizes **high legibility** and **approachable friendliness**. 

**Plus Jakarta Sans** is used for headings and UI labels. Its soft curves and modern geometry feel optimistic and welcoming. **Atkinson Hyperlegible Next** is selected for all body copy and long-form reading, specifically designed to reduce character confusion and mental fatigue, which is critical for students in high-stress states.

Line heights are intentionally generous to ensure a comfortable reading rhythm and to prevent the feeling of "text walls."

## Layout & Spacing
The design system employs a **fluid-to-fixed grid** model. On mobile, it uses a 4-column layout with 20px margins; on desktop, it expands to a 12-column centered container with a maximum width of 1140px.

The spacing rhythm is "Airy." Avoid tight clusters of information. Use `stack-lg` between distinct content modules to provide visual rest. Content should be grouped logically into "islands" (cards) rather than being spread loosely across the page, helping the student process one thought at a time.

## Elevation & Depth
Elevation is expressed through **Ambient Shadows** and **Tonal Layering**. 

Shadows are never pure black; they are tinted with the primary or neutral-dark color (e.g., `rgba(139, 168, 142, 0.1)`) to feel organic. Shadows have a very large blur radius (20px+) and low opacity to create a "floating" effect rather than a "heavy" one.

- **Level 0 (Floor):** Neutral background.
- **Level 1 (Cards/Surfaces):** White or Tertiary color with a subtle 1px border (`#E9E5D9`).
- **Level 2 (Interactive/Floating):** Subtle ambient shadow to indicate tap-ability.
- **Level 3 (Modals):** High blur backdrop-filter (glassmorphism) to keep the user grounded in their current context while focusing on a specific task.

## Shapes
The shape language is defined by **organic softness**. 

Base components use a `0.5rem` (8px) radius, while larger containers and cards use `1rem` (16px) or `1.5rem` (24px) to emphasize comfort. Avoid all sharp 90-degree corners. Progress bars and toggle tracks should always be fully rounded (pill-shaped) to feel smooth and non-threatening.

## Components
- **Buttons:** Use generous internal padding. Primary buttons are solid Sage Green with white text; secondary buttons use a ghost style with a 1.5pt border. Use pill-shapes for high-frequency actions.
- **Cards:** Cards are the primary vessel for information. They feature a `1.5rem` corner radius and a subtle Level 1 shadow. Headers within cards should have ample padding (24px+).
- **Chips/Badges:** Used for mood tags or categories. They should have a `3rem` (fully rounded) radius and use low-saturation background colors with dark-sage text.
- **Input Fields:** Fields should feel "open." Use a light gray background with no border, becoming a soft Teal border on focus. Icons should be rounded and humanist.
- **Mood Sliders:** Large, easy-to-grab thumb handles. The track should be thick and soft, changing color subtly as the value increases.
- **Well-being Lists:** List items should have significant vertical spacing and be separated by soft dividers or placed in individual "mini-cards" to avoid a "to-do list" pressure.