/**
 * tokens.ts — Casa Seis Design System
 *
 * FUENTE DE VERDAD para todos los tokens semánticos en TypeScript.
 * Importar desde aquí para cualquier valor dinámico de color.
 *
 * ARQUITECTURA:
 *   1. Primitivos       → PRIMITIVES (nunca en JSX directo)
 *   2. Semánticos base  → TOKENS (una sola intención por token)
 *   3. Variantes tipadas → variant maps (el único patrón dinámico permitido)
 *   4. Helpers          → safeVariant(), uiToken() (firewalls de tipo)
 *
 * REGLA DE USO DINÁMICO:
 *   ❌ `bg-${color}-500`          → string dinámica, rota Tailwind JIT
 *   ❌ `className={isActive ? 'bg-navy-800' : 'bg-stone-100'}` → primitivo
 *   ✓  `className={STAT_VARIANT[type].icon}` → variant map tipado
 *   ✓  `style={{ background: uiToken('action.primary') }}` → token semántico
 */

// ─────────────────────────────────────────────────────────────
// CAPA 1: PRIMITIVOS
// Solo usados en este archivo para componer tokens semánticos.
// ─────────────────────────────────────────────────────────────
const P = {
  navy950: '#0d1428', navy900: '#111d38', navy800: '#1a2d5a',
  navy700: '#213872', navy600: '#2d4a8c', navy500: '#3b5ea6',
  navy400: '#5b7bbf', navy300: '#8aa1d4', navy200: '#bccae8',
  navy100: '#dce5f4', navy50:  '#f0f4fb',
  gold700: '#92700c', gold600: '#b08a12', gold500: '#c9a020',
  gold400: '#d4ae3e', gold300: '#e0c870', gold200: '#eedfa8',
  gold100: '#f8f0d4', gold50:  '#fdf8ec',
  stone900: '#1c1917', stone800: '#292524', stone700: '#44403c',
  stone600: '#57534e', stone500: '#78716c', stone400: '#a8a29e',
  stone300: '#d6d3d1', stone200: '#e7e5e4', stone100: '#f5f5f4',
  stone50:  '#fafaf9', stone950: '#0c0a09',
  white: '#ffffff',
} as const

// ─────────────────────────────────────────────────────────────
// CAPA 2: TOKENS SEMÁNTICOS REFINADOS
//
// Granularidad incrementada:
//   accent → accent.strong / accent.subtle / accent.muted
//   surface → surface.base / surface.elevated / surface.section
//   border → border.default / border.interactive / border.focus
//
// Cada token tiene UNA sola razón de existir.
// ─────────────────────────────────────────────────────────────
export const TOKENS = {

  // ── ACTION (navy) — responde a interacción ────────────────
  action: {
    primary:       P.navy800,  // bg de btn-primary
    primaryHover:  P.navy700,  // hover de btn-primary
    primaryActive: P.navy600,  // press/active de btn-primary
    ghostBg:       P.navy50,   // bg en hover de ghost/icon btn
    ghostBorder:   P.navy200,  // border en hover de ghost btn
    ghostText:     P.navy800,  // texto en hover de ghost btn
    focus:         P.navy500,  // WCAG AA 5.3:1 — NO CAMBIAR
    muted:         P.navy600,  // <em> inline en body copy
    selected:      P.navy800,  // selected state (paginación activa)
    selectedSoft:  P.navy50,   // soft bg de elemento seleccionado
  },

  // ── ACCENT (gold) — decorativo/pasivo ÚNICAMENTE ──────────
  // strong: contraste más alto, para overlines sobre fondos blancos
  // subtle: contraste más bajo, para labels sobre fondos stone
  // muted:  tints muy sutiles, para fondos de badge o selected
  accent: {
    strong:        P.gold500,  // overlines sobre blanco (4.9:1 ✓)
    subtle:        P.gold600,  // overlines sobre stone-50/100 (4.6:1 ✓)
    line:          P.gold400,  // líneas decorativas (section-accent)
    surface:       P.gold50,   // badge-featured bg, ::selection bg
    surfaceMuted:  P.gold100,  // hover muy sutil de decorativos pasivos
    border:        P.gold300,  // badge-featured border
    borderStrong:  P.gold400,  // líneas decorativas con más presencia
    text:          P.gold600,  // alias semántico para texto de acento
  },

  // ── SURFACE (stone) — estructura y layout ─────────────────
  // base:     blanco — cards, inputs, superficies de primer nivel
  // elevated: blanco + shadow — cards en hover (el color no cambia)
  // section:  stone-100 — secciones alternas
  // page:     stone-50 — fondo de página
  // dark:     stone-950 — overlays de imagen, footer
  surface: {
    page:     P.stone50,   // body background
    base:     P.white,     // cards, formularios
    elevated: P.white,     // cards en hover (color idéntico, Z cambia)
    section:  P.stone100,  // secciones alternas, skeleton bg
    overlay:  P.stone100,  // hover de elementos NO interactivos
    dark:     P.stone950,  // footer, overlays de imagen
    sidebar:  P.navy950,   // excepción documentada — isla de marca
  },

  // ── BORDER (stone + navy para focus) ──────────────────────
  // default:     borde base en reposo
  // interactive: borde en hover de card (stone, no navy) — siempre + shadow
  // focus:       borde de input en focus (navy — acción)
  // subtle:      divisores internos
  border: {
    default:     P.stone200,  // base
    subtle:      P.stone100,  // divisores (border-t de stats row)
    interactive: P.stone300,  // card hover — SIEMPRE + shadow-card-hover
    strong:      P.stone300,  // inputs en hover
    focus:       P.navy500,   // input focus — único caso de navy en borders
    dark:        'rgba(59,94,166,0.2)',  // dentro de sidebar oscuro
  },

  // ── CONTENT (stone) — texto e iconos ──────────────────────
  content: {
    primary:       P.stone900,  // headings, body principal
    secondary:     P.stone500,  // texto secundario, descripciones
    tertiary:      P.stone400,  // meta, placeholders, etiquetas muted
    icon:          P.stone400,  // DEFAULT para todos los iconos Lucide
    iconHover:     P.stone600,  // icono cuando su contenedor hace hover
    inverse:       P.white,     // sobre fondos oscuros
    inverseMuted:  P.stone300,  // secundario sobre fondos oscuros
  },

} as const

// Tipo derivado del objeto de tokens para intellisense
export type TokenPath = {
  [K in keyof typeof TOKENS]: {
    [J in keyof typeof TOKENS[K]]: string
  }
}

/**
 * uiToken(path) — acceso type-safe a tokens semánticos
 *
 * Para usar en style={{ }} cuando Tailwind no alcanza.
 * Retorna el valor CSS del token o explota en compilación si
 * el path no existe.
 *
 * @example
 *   style={{ background: uiToken('action.primary') }}
 *   style={{ color: uiToken('accent.subtle') }}
 *   style={{ borderColor: uiToken('border.focus') }}
 */
export function uiToken(
  path: `${'action' | 'accent' | 'surface' | 'border' | 'content'}.${string}`
): string {
  const [domain, key] = path.split('.') as [keyof typeof TOKENS, string]
  const val = (TOKENS[domain] as Record<string, string>)[key]
  if (!val) throw new Error(`[design-system] Token "${path}" no existe. Ver src/lib/tokens.ts`)
  return val
}

// ─────────────────────────────────────────────────────────────
// VARIANT MAPS TIPADOS
//
// Estos son los únicos patrones de color dinámico permitidos.
// Cada variante es una cadena ESTÁTICA de clases Tailwind.
// Tailwind JIT las puede detectar porque no hay interpolación.
//
// PATRÓN CORRECTO:
//   const cls = STAT_VARIANT[statType]    // string estática ✓
//   const cls = `bg-${color}-500`         // interpolación ❌
// ─────────────────────────────────────────────────────────────

/**
 * STAT_VARIANT — stat cards del dashboard admin
 *
 * Cada stat tiene: bg del icono, color del icono, badge.
 * Todos los valores son clases completas (no interpoladas).
 */
export type StatVariant = 'properties' | 'active' | 'sale' | 'rent'

export const STAT_VARIANT: Record<StatVariant, {
  iconWrap: string   // className del contenedor del icono
  icon:     string   // className del icono
  badge:    string   // className del badge (no usado actualmente)
}> = {
  // properties → action domain (navy, informativo sobre acción de catálogo)
  properties: {
    iconWrap: 'bg-action-selectedSoft',
    icon:     'text-action-muted',
    badge:    'bg-action-selectedSoft text-action-muted border border-action-ghostBorder',
  },
  // active → feedback de estado (emerald — no navy ni gold)
  active: {
    iconWrap: 'bg-emerald-50',
    icon:     'text-emerald-600',
    badge:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  // sale → accent (decorativo: categoría de propiedad, no acción)
  sale: {
    iconWrap: 'bg-accent-surface',
    icon:     'text-accent-subtle',
    badge:    'bg-accent-surface text-accent-subtle border border-accent-border',
  },
  // rent → surface (neutro)
  rent: {
    iconWrap: 'bg-surface-section',
    icon:     'text-content-secondary',
    badge:    'bg-surface-section text-content-secondary border border-border-default',
  },
} as const

/**
 * FILTER_BUTTON_VARIANT — botones de filtro tipo/precio/etc.
 * Estado activo = action (selección interactiva ✓)
 * Estado inactivo = surface
 */
export type FilterButtonState = 'active' | 'inactive'

export const FILTER_BUTTON_VARIANT: Record<FilterButtonState, {
  bg:     string
  text:   string
  border: string
  shadow: string
}> = {
  active: {
    bg:     uiToken('action.primary'),
    text:   P.white,
    border: uiToken('action.primary'),
    shadow: '0 1px 3px rgba(26,45,90,0.2)',
  },
  inactive: {
    bg:     P.white,
    text:   P.stone600,
    border: P.stone300,
    shadow: 'none',
  },
} as const

/**
 * DIALOG_VARIANT — ConfirmDialog tipo danger vs warning
 */
export type DialogVariant = 'danger' | 'warning'

export const DIALOG_VARIANT: Record<DialogVariant, {
  iconWrap: string
  icon:     string
}> = {
  danger: {
    iconWrap: 'bg-red-50',
    icon:     'text-red-500',
  },
  warning: {
    iconWrap: 'bg-amber-50',
    icon:     'text-amber-500',
  },
} as const

/**
 * TOAST_VARIANT — Toast notifications
 */
export type ToastType = 'success' | 'error' | 'info'

export const TOAST_VARIANT: Record<ToastType, {
  style:   { background: string; borderColor: string; color: string }
  iconCls: string
}> = {
  success: {
    style:   { background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' },
    iconCls: 'text-emerald-600',
  },
  error: {
    style:   { background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' },
    iconCls: 'text-red-500',
  },
  info: {
    // info usa action tokens (es informativo sobre acciones del sistema)
    style: {
      background:   uiToken('action.selectedSoft'),
      borderColor:  uiToken('action.ghostBorder'),
      color:        uiToken('action.primary'),
    },
    iconCls: 'text-action-muted',
  },
} as const

/**
 * PROPERTY_TYPE_BADGE — clases para badge de tipo de propiedad
 */
export type PropertyTypeBadge = 'sale' | 'rent'

export const PROPERTY_TYPE_BADGE: Record<PropertyTypeBadge, string> = {
  sale: 'badge badge-sale',  // stone-800 — no compite con btn-primary
  rent: 'badge badge-rent',  // stone-700
} as const

// ─────────────────────────────────────────────────────────────
// HERO / DARK SURFACE TOKENS
//
// Estos valores son rgba sobre fondos navy muy oscuros.
// Solo para: hero, login, footer — superficies oscuras.
// No son parte del sistema de tokens semánticos estándar.
// ─────────────────────────────────────────────────────────────
export const DARK_SURFACE = {
  textPrimary:    'rgba(255,255,255,1)',
  textMuted:      'rgba(188,202,232,0.6)',
  textSubtle:     'rgba(140,165,210,0.55)',
  textFaint:      'rgba(140,165,210,0.35)',
  accentText:     'rgba(176,138,18,0.5)',   // gold tint sobre navy oscuro
  borderSubtle:   'rgba(59,94,166,0.15)',
  borderFaint:    'rgba(59,94,166,0.12)',
} as const

// ─────────────────────────────────────────────────────────────
// safeVariant() — helper de escape controlado
//
// Para el caso muy específico donde se necesita un color
// basado en una prop dinámica (ej: status de propiedad).
// Retorna clases estáticas desde un map tipado, nunca
// genera strings dinámicas con interpolación.
// ─────────────────────────────────────────────────────────────

/**
 * safeVariant<T>(map, value, fallback)
 *
 * Busca `value` en el map tipado y retorna las clases.
 * Si el valor no existe, retorna el fallback en lugar de
 * generar una clase inválida silenciosamente.
 *
 * @example
 *   // En lugar de: `bg-${property.status}-50`
 *   const cls = safeVariant(PROPERTY_STATUS_VARIANT, property.status, 'default')
 *
 * @example
 *   // En lugar de: `text-${type}-600 bg-${type}-50`
 *   const cls = safeVariant(STAT_VARIANT, statType, 'properties').iconWrap
 */
export function safeVariant<T extends string, V>(
  map: Record<T, V>,
  value: string,
  fallback: T
): V {
  if (Object.prototype.hasOwnProperty.call(map, value)) {
    return map[value as T]
  }
  console.warn(`[design-system] safeVariant: "${value}" no encontrado en map. Usando "${fallback}".`)
  return map[fallback]
}

/**
 * PROPERTY_STATUS_VARIANT — para Admin table, badges de status
 */
export type PropertyStatus = 'active' | 'sold' | 'rented' | 'inactive'

export const PROPERTY_STATUS_VARIANT: Record<PropertyStatus, {
  badge: string
  text:  string
  dot:   string
}> = {
  active: {
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    text:  'text-emerald-600',
    dot:   'bg-emerald-400',
  },
  sold: {
    badge: 'bg-surface-section text-content-secondary border border-border-default',
    text:  'text-content-secondary',
    dot:   'bg-content-tertiary',
  },
  rented: {
    badge: 'bg-action-selectedSoft text-action-muted border border-action-ghostBorder',
    text:  'text-action-muted',
    dot:   'bg-action-focus',
  },
  inactive: {
    badge: 'bg-surface-section text-content-tertiary border border-border-default',
    text:  'text-content-tertiary',
    dot:   'bg-content-tertiary',
  },
} as const
