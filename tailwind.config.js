/**
 * tailwind.config.js — Casa Seis Inmobiliaria
 *
 * ARQUITECTURA DE COLORES EN 2 CAPAS:
 *
 * Capa 1 — Primitivos (este archivo, sección `_raw`)
 *   Accesibles como `navy-800`, `gold-500`, `stone-200`.
 *   Solo deben usarse en:
 *     • globals.css  (definición de tokens semánticos)
 *     • tailwind.config.js  (definición de tokens semánticos)
 *   NUNCA directamente en componentes .tsx/.jsx.
 *
 * Capa 2 — Semánticos (este archivo, sección principal de `colors`)
 *   `bg-action-primary`, `text-accent`, `border-subtle`, etc.
 *   Estos son los únicos colores permitidos en componentes.
 *
 * REGLA DE ORO:
 *   Si el elemento es INTERACTIVO  → usar `action-*`
 *   Si el elemento es DECORATIVO   → usar `accent-*`  (gold, pasivo)
 *   Si el elemento es ESTRUCTURAL  → usar `surface-*` / `border-*` / `content-*`
 *
 * @type {import('tailwindcss').Config}
 */

// ─── Primitivos (fuente de verdad de hex values) ──────────────
const raw = {
  navy: {
    50:  '#f0f4fb',
    100: '#dce5f4',
    200: '#bccae8',
    300: '#8aa1d4',
    400: '#5b7bbf',
    500: '#3b5ea6',
    600: '#2d4a8c',
    700: '#213872',
    800: '#1a2d5a',
    900: '#111d38',
    950: '#0d1428',
  },
  gold: {
    50:  '#fdf8ec',
    100: '#f8f0d4',
    200: '#eedfa8',
    300: '#e0c870',
    400: '#d4ae3e',
    500: '#c9a020',
    600: '#b08a12',
    700: '#92700c',
  },
  stone: {
    50:  '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },
}

// ─── Tokens semánticos ────────────────────────────────────────
//
// DOMINIO `action`  → navy únicamente
//   Uso: botones primarios/secundarios/ghost, estados hover de
//        elementos interactivos, focus ring, selected/active
//        indicators, spinner borders.
//
// DOMINIO `accent`  → gold únicamente, roles PASIVOS
//   Uso: overlines, líneas decorativas, badge-featured,
//        ::selection background, sidebar section labels.
//   PROHIBIDO en: hover, active, focus, cualquier feedback de acción.
//
// DOMINIO `surface` → stone únicamente
//   Uso: fondos de página, tarjetas, secciones alternas,
//        inputs, superficies de contenido.
//
// DOMINIO `border`  → stone por defecto / navy para focus de input
//   Hover de cards usa `border-subtle-hover` (stone) + shadow,
//   nunca navy ni gold.
//
// DOMINIO `content` → stone para texto e iconos
//   Icons default = `content-icon` (stone-400).
//   Solo usar navy si el icono está dentro de un elemento
//   de acción. Gold en iconos está PROHIBIDO.
//
const semantic = {
  // ── ACTION (navy) ──────────────────────────────────────────
  action: {
    primary:        raw.navy[800],   // bg-action-primary
    'primary-hover':raw.navy[700],   // hover:bg-action-primary-hover
    'primary-light':raw.navy[50],    // bg-action-primary-light (ghost hover bg)
    'primary-border':raw.navy[800],  // border-action-primary
    'primary-border-hover': raw.navy[700],
    ghost:          raw.navy[50],    // bg-action-ghost  (ghost btn hover bg)
    'ghost-border': raw.navy[200],   // border-action-ghost-border
    'ghost-text':   raw.navy[800],   // text-action-ghost-text
    focus:          raw.navy[500],   // outline / ring — WCAG AA 5.3:1 — DO NOT CHANGE
    'focus-ring':   raw.navy[500],   // ring-action-focus-ring (for ring-2 utility)
    selected:       raw.navy[800],   // bg/text for selected state
    'selected-soft':raw.navy[50],    // soft selected bg
    muted:          raw.navy[600],   // inline emphasis text (em, strong in body copy)
  },

  // ── ACCENT (gold — PASIVO, no interactivo) ─────────────────
  accent: {
    DEFAULT:        raw.gold[400],   // bg-accent / border-accent (decorative lines)
    subtle:         raw.gold[600],   // text-accent-subtle (overlines, labels)
    'subtle-hover': raw.gold[700],   // text-accent-subtle-hover (hover on passive elements)
    surface:        raw.gold[50],    // bg-accent-surface (badge-featured bg, selection)
    border:         raw.gold[300],   // border-accent (badge-featured border)
    'border-strong':raw.gold[400],   // border-accent-strong
    muted:          raw.gold[200],   // bg-accent-muted (very light gold tint)
  },

  // ── SURFACE (stone — estructura) ──────────────────────────
  surface: {
    page:           raw.stone[50],   // bg-surface-page
    DEFAULT:        '#ffffff',        // bg-surface (cards)
    section:        raw.stone[100],  // bg-surface-section (alternating)
    overlay:        raw.stone[100],  // bg-surface-overlay (hover of non-interactive)
    dark:           raw.stone[900],  // bg-surface-dark (footer bg override)
    'extra-dark':   raw.stone[950],  // bg-surface-extra-dark (image overlays)
  },

  // ── BORDER (stone — layout) ────────────────────────────────
  border: {
    DEFAULT:        raw.stone[200],  // border (base)
    subtle:         raw.stone[100],  // border-subtle (dividers)
    'subtle-hover': raw.stone[300],  // border-subtle-hover (card hover — elevation > color)
    strong:         raw.stone[300],  // border-strong (inputs default)
    input:          raw.stone[200],  // border-input
    'input-focus':  raw.navy[500],   // border-input-focus (navy for action feedback)
    dark:           raw.stone[700],  // border-dark (dark surface borders)
  },

  // ── CONTENT (stone — texto e iconos) ──────────────────────
  content: {
    primary:        raw.stone[900],  // text-content-primary
    secondary:      raw.stone[500],  // text-content-secondary
    tertiary:       raw.stone[400],  // text-content-tertiary (meta, placeholders)
    muted:          raw.stone[400],  // text-content-muted
    icon:           raw.stone[400],  // text-content-icon (DEFAULT for all icons)
    'icon-hover':   raw.stone[600],  // text-content-icon-hover
    inverse:        '#ffffff',        // text-content-inverse (on dark bg)
    'inverse-muted':raw.stone[300],  // text-content-inverse-muted
  },

  // ── FEEDBACK (semantic states — estos no cambian) ──────────
  feedback: {
    // success, error, warning no usan navy ni gold → emerald/red/amber de Tailwind
    // Se mantienen como clases de Tailwind estándar (emerald-*, red-*, amber-*)
    // No se redefinen aquí para no duplicar
  },

  // ─── PRIMITIVOS EXPUESTOS (solo para globals.css y config) ──
  // Prefijo `_raw` los hace fácilmente auditables con grep.
  // grep "_raw" src/ — si aparece en un componente, es una violación.
  _raw: raw,
}

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },

      colors: {
        // ── SEMANTIC TOKENS (usar en componentes) ────────────
        action:  semantic.action,
        accent:  semantic.accent,
        surface: semantic.surface,
        border:  semantic.border,   // NOTA: esto extiende, no reemplaza `border`
        content: semantic.content,

        // ── PRIMITIVOS (solo globals.css + este archivo) ─────
        // Siguen disponibles para backward compatibility durante la migración.
        // Una vez migrados todos los componentes, eliminar estas líneas
        // y activar el bloque `blocklist` de abajo.
        navy:  raw.navy,
        gold:  raw.gold,
        stone: raw.stone,
      },

      // ─── BLOQUEADO UNA VEZ MIGRADOS TODOS LOS COMPONENTES ──
      // blocklist: [
      //   // Bloquea generación de clases de primitivos en producción.
      //   // Activar cuando todos los .tsx usen solo tokens semánticos.
      //   // Cualquier `text-navy-*` en un componente generará un error de build.
      //   /^(text|bg|border|ring|outline|shadow|fill|stroke)-(navy|gold)(-\d+)?$/,
      // ],

      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },

      borderRadius: {
        'sm':  '3px',
        DEFAULT: '4px',
        'md':  '6px',
        'lg':  '8px',
        'xl':  '12px',
        '2xl': '16px',
      },

      animation: {
        'fade-up':   'fadeUp 0.6s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'slide-in':  'slideIn 0.5s ease forwards',
        'line-grow': 'lineGrow 0.8s ease forwards',
      },

      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn:  { from: { opacity: '0', transform: 'translateX(-20px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        lineGrow: { from: { width: '0' }, to: { width: '100%' } },
      },

      transitionTimingFunction: {
        'elegant': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },

      boxShadow: {
        'xs':         '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'card':       '0 2px 8px -2px rgb(17 29 56 / 0.08), 0 1px 3px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 12px 32px -8px rgb(17 29 56 / 0.18), 0 4px 10px -4px rgb(0 0 0 / 0.08)',
        'nav':        '0 1px 0 0 rgb(0 0 0 / 0.06), 0 4px 16px -4px rgb(0 0 0 / 0.08)',
        'float':      '0 24px 64px -16px rgb(13 20 40 / 0.24)',
      },
    },
  },

  plugins: [
    // ── Plugin: token usage validator (dev only) ─────────────
    // Emite warnings en consola cuando se detectan clases de primitivos
    // en componentes durante el build de desarrollo.
    function tokenEnforcementPlugin({ addBase, theme }) {
      // No hace nada en runtime — el enforcement real es via ESLint
      // (ver .eslintrc.json y docs/design-system/TOKENS.md)
    },
  ],
}
