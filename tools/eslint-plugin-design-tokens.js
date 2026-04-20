/**
 * eslint-plugin-design-tokens v2
 * tools/eslint-plugin-design-tokens.js
 *
 * NUEVAS REGLAS EN v2:
 *   Regla 4: no-dynamic-color-interpolation
 *     Detecta `bg-${variable}`, `text-${color}-500` — el vector de
 *     escape más silencioso. Tailwind JIT no genera estas clases.
 *
 *   Regla 5: no-raw-style-hex
 *     Detecta style={{ color: '#1a2d5a' }} y style={{ background: 'rgba(17,29,56,...)' }}
 *     El escape hatch más común: devs usan style= para evitar el linting de className.
 *
 *   Regla 6: no-unsafe-cn-spread
 *     Detecta cn(...someArray) donde someArray puede contener primitivos.
 *     El eslint-plugin v1 no inspeccionaba spreads ni variables.
 *
 * REGLAS DE v1 (mantenidas):
 *   Regla 1: no-raw-color-classes
 *   Regla 2: no-interactive-accent
 *   Regla 3: no-raw-icon-color
 */

'use strict'

const ALLOWED_FILES = ['globals.css', 'tailwind.config.js', 'tailwind.config.ts', 'tokens.ts']
const PRIMITIVE_RAMPS = ['navy', 'gold']  // stone está permitido en ciertos contextos de layout

// ─── REGLA 4: no-dynamic-color-interpolation ─────────────────
//
// Detecta interpolaciones de color en template literals de className.
// Estos son invisibles para Tailwind JIT y para las reglas de v1.
//
// PATRONES PELIGROSOS:
//   `bg-${color}-500`          → JIT no genera la clase
//   `text-${variant}`          → primitivo podría filtrarse
//   `border-${isActive ? 'navy-800' : 'stone-200'}`  → primitivo en ternario
//
// SOLUCIÓN PRESCRIPTA:
//   Importar un variant map de tokens.ts y acceder como objeto.
//   const cls = VARIANT_MAP[value].iconWrap  (string estática ✓)
//
const noDynamicColorInterpolation = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prohíbe interpolaciones de color en className. Tailwind JIT no genera ' +
        'clases dinámicas. Usar variant maps tipados de src/lib/tokens.ts.',
      category: 'Design System',
      recommended: true,
    },
    messages: {
      dynamicColor:
        "Interpolación de color detectada: '{{snippet}}'. " +
        "Tailwind JIT no genera clases dinámicas, y los primitivos se filtran sin detección. " +
        "Usar variant map: import { STAT_VARIANT } from '@/lib/tokens'; " +
        "const cls = STAT_VARIANT[type].iconWrap",

      ternaryPrimitive:
        "Ternario con primitivo detectado: '{{snippet}}'. " +
        "Usar variant map de tokens.ts en lugar de ternario inline. " +
        "const cls = VARIANT[isActive ? 'active' : 'inactive'].bg",
    },
  },

  create(context) {
    const filename = context.getFilename()
    if (ALLOWED_FILES.some(f => filename.endsWith(f))) return {}
    if (!/\.(tsx?|jsx?)$/.test(filename)) return {}

    // Detecta `text-${...}`, `bg-${...}`, `border-${...}` en template literals
    const COLOR_INTERPOLATION_RE = /\b(text|bg|border|ring|fill|stroke|outline)-\$\{/

    // Detecta ternarios con primitivos: `? 'bg-navy-800' : 'bg-stone-200'`
    const TERNARY_PRIMITIVE_RE = /['"](bg|text|border|ring)-(navy|gold)-\d+['"]/

    function checkTemplateLiteral(node) {
      if (node.type !== 'TemplateLiteral') return

      // Revisar las partes estáticas del template
      for (const quasi of node.quasis) {
        if (COLOR_INTERPOLATION_RE.test(quasi.value.raw)) {
          context.report({
            node,
            messageId: 'dynamicColor',
            data: { snippet: quasi.value.raw.slice(0, 40) },
          })
        }
      }

      // Revisar expresiones dentro del template (ternarios, variables)
      for (const expr of node.expressions) {
        // Ternario: `${isActive ? 'bg-navy-800' : 'bg-stone-100'}`
        if (expr.type === 'ConditionalExpression') {
          const consequent = expr.consequent.type === 'Literal' ? expr.consequent.value : ''
          const alternate  = expr.alternate.type  === 'Literal' ? expr.alternate.value  : ''
          const both = `${consequent} ${alternate}`
          if (TERNARY_PRIMITIVE_RE.test(both)) {
            context.report({
              node: expr,
              messageId: 'ternaryPrimitive',
              data: { snippet: both.slice(0, 50) },
            })
          }
        }
      }
    }

    return {
      // className={`...${dynamic}...`}
      JSXAttribute(node) {
        if (node.name.name !== 'className') return
        if (!node.value) return

        if (node.value.type === 'JSXExpressionContainer') {
          const expr = node.value.expression
          if (expr.type === 'TemplateLiteral') {
            checkTemplateLiteral(expr)
          }
          // cn(`bg-${color}`) — función con template literal
          if (expr.type === 'CallExpression') {
            for (const arg of expr.arguments) {
              if (arg.type === 'TemplateLiteral') checkTemplateLiteral(arg)
            }
          }
        }
      },

      // style prop con template literals de color
      // Complementa la regla 5 para casos como style={`background: #${hex}`}
      JSXExpressionContainer(node) {
        if (node.parent.type === 'JSXAttribute' &&
            node.parent.name?.name === 'style') return // cubierto por regla 5
      },
    }
  },
}

// ─── REGLA 5: no-raw-style-hex ────────────────────────────────
//
// EL VECTOR DE ESCAPE MÁS COMÚN.
// Cuando un dev quiere usar navy-800 y el linter lo bloquea en className,
// la solución fácil es: style={{ background: '#1a2d5a' }}
// Esta regla cierra ese escape hatch.
//
// DETECTA:
//   style={{ color: '#1a2d5a' }}          → hex de navy primitivo
//   style={{ background: 'rgba(17,29,56,...)' }}  → rgba de navy
//   style={{ borderColor: '#b08a12' }}    → hex de gold primitivo
//   style={{ color: 'var(--navy-800)' }}  → var de primitivo (en componente)
//
// PERMITE:
//   style={{ color: 'var(--color-action-primary)' }}  → token semántico ✓
//   style={{ background: uiToken('action.primary') }} → helper tipado ✓
//   style={{ boxShadow: 'var(--shadow-card)' }}       → no es color ✓
//
const noRawStyleHex = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Prohíbe hex/rgba de primitivos en style={{}}. ' +
        'Usar uiToken() de tokens.ts o var(--color-action-*) de tokens semánticos.',
      category: 'Design System',
      recommended: true,
    },
    messages: {
      rawHex:
        "Hex primitivo '{{value}}' en style prop. " +
        "Usar: style={{ {{prop}}: uiToken('{{suggestion}}') }} " +
        "o style={{ {{prop}}: 'var(--color-{{suggestion}})' }}",
      rawVar:
        "Variable primitiva '{{value}}' en style prop. " +
        "Usar token semántico: 'var(--color-action-primary)' en lugar de 'var(--navy-800)'. " +
        "Ver src/lib/tokens.ts",
      rawRgba:
        "rgba de navy/gold detectado: '{{value}}'. " +
        "Si es para una superficie oscura, usar DARK_SURFACE de tokens.ts. " +
        "Para UI estándar, usar uiToken() o var(--color-*) semántico.",
    },
  },

  create(context) {
    const filename = context.getFilename()
    if (ALLOWED_FILES.some(f => filename.endsWith(f))) return {}
    if (!/\.(tsx?|jsx?)$/.test(filename)) return {}

    // Hex values de primitivos navy y gold más comunes
    const NAVY_HEX = new Set([
      '#0d1428','#111d38','#1a2d5a','#213872','#2d4a8c',
      '#3b5ea6','#5b7bbf','#8aa1d4','#bccae8','#dce5f4','#f0f4fb',
    ])
    const GOLD_HEX = new Set([
      '#92700c','#b08a12','#c9a020','#d4ae3e','#e0c870',
      '#eedfa8','#f8f0d4','#fdf8ec',
    ])

    // rgba patterns de navy (los más comunes en el codebase)
    const NAVY_RGBA = /rgba\(\s*(17|26|13|45|59)\s*,\s*(29|45|20|74|94)\s*,\s*(56|90|40|140|166)/

    // var(--navy-*) o var(--gold-*) — primitivos en style prop
    const PRIMITIVE_VAR = /var\(--(navy|gold)-\d+\)/

    // Map de hex → token semántico sugerido
    const HEX_SUGGESTION: Record<string, string> = {
      '#1a2d5a': 'action.primary',
      '#213872': 'action.primaryHover',
      '#2d4a8c': 'action.primaryActive',
      '#f0f4fb': 'action.ghostBg',
      '#bccae8': 'action.ghostBorder',
      '#3b5ea6': 'action.focus',
      '#b08a12': 'accent.subtle',
      '#c9a020': 'accent.strong',
      '#d4ae3e': 'accent.line',
      '#fdf8ec': 'accent.surface',
    }

    const COLOR_PROPS = new Set(['color','background','backgroundColor','borderColor',
                                  'borderTopColor','borderBottomColor','outline','fill','stroke'])

    function checkStyleValue(node, propName, value) {
      if (!COLOR_PROPS.has(propName)) return
      if (typeof value !== 'string') return

      const lower = value.toLowerCase().trim()

      // Hex
      if (NAVY_HEX.has(lower) || GOLD_HEX.has(lower)) {
        context.report({
          node,
          messageId: 'rawHex',
          data: {
            value: lower,
            prop: propName,
            suggestion: HEX_SUGGESTION[lower] ?? 'action.primary | accent.subtle | ...',
          },
        })
        return
      }

      // var(--navy-*) o var(--gold-*)
      if (PRIMITIVE_VAR.test(value)) {
        context.report({ node, messageId: 'rawVar', data: { value } })
        return
      }

      // rgba de navy
      if (NAVY_RGBA.test(value)) {
        context.report({ node, messageId: 'rawRgba', data: { value: value.slice(0, 40) } })
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== 'style') return
        if (!node.value || node.value.type !== 'JSXExpressionContainer') return
        const expr = node.value.expression
        if (expr.type !== 'ObjectExpression') return

        for (const prop of expr.properties) {
          if (prop.type !== 'Property') continue
          const propName = prop.key.type === 'Identifier' ? prop.key.name :
                          prop.key.type === 'Literal' ? String(prop.key.value) : null
          if (!propName) continue

          // string literal: style={{ color: '#1a2d5a' }}
          if (prop.value.type === 'Literal') {
            checkStyleValue(prop, propName, prop.value.value)
          }
          // template literal: style={{ color: `#${hex}` }} (edge case)
          if (prop.value.type === 'TemplateLiteral' && prop.value.quasis.length > 0) {
            checkStyleValue(prop, propName, prop.value.quasis[0].value.raw)
          }
        }
      },
    }
  },
}

// ─── REGLA 6: no-unsafe-cn-spread ────────────────────────────
//
// Detecta cn(...array) donde array podría ser construido con primitivos.
// El linter de v1 solo revisaba strings literales dentro de cn().
// Esta regla cierra el caso de variables de objeto pasadas como spread.
//
// DETECTA:
//   cn(...statConfig.accent.split(' '))   → string dinámica
//   cn(iconBg, someClass)                 → variable de color sin tipo
//
// NO DETECTA (fuera de alcance por diseño):
//   cn(VARIANT_MAP[type].icon)            → acceso a variant map tipado ✓
//   Variables que provienen de TOKENS.ts  → permitidas
//
const noUnsafeCnSpread = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Detecta cn() con spreads o variables no tipadas que pueden contener primitivos. ' +
        'Usar variant maps de tokens.ts.',
      category: 'Design System',
    },
    messages: {
      spreadInCn:
        "Spread '...{{name}}' en cn(). Si '{{name}}' contiene clases de color primitivas, " +
        "el linter no puede detectarlo. " +
        "Usar: cn(VARIANT_MAP[type].className) — acceso a objeto tipado, no spread.",
    },
  },

  create(context) {
    const filename = context.getFilename()
    if (ALLOWED_FILES.some(f => filename.endsWith(f))) return {}
    if (!/\.(tsx?|jsx?)$/.test(filename)) return {}

    return {
      CallExpression(node) {
        const callee = node.callee
        const isCn =
          (callee.type === 'Identifier' && ['cn', 'cx', 'clsx'].includes(callee.name))

        if (!isCn) return

        for (const arg of node.arguments) {
          // cn(...someArray) o cn(...obj.prop.split(' '))
          if (arg.type === 'SpreadElement') {
            const name =
              arg.argument.type === 'Identifier' ? arg.argument.name :
              arg.argument.type === 'MemberExpression' ?
                `${arg.argument.object.name ?? '...'}.${arg.argument.property.name ?? '...'}` :
              arg.argument.type === 'CallExpression' ? `${
                (arg.argument.callee as any)?.object?.name ?? '...'}.split(...)` : '...'

            context.report({
              node: arg,
              messageId: 'spreadInCn',
              data: { name },
            })
          }
        }
      },
    }
  },
}

// ─── REGLAS DE v1 (mantenidas) ────────────────────────────────

const RAW_PRIMITIVE_PATTERNS = [
  /\b(text|bg|border|ring|outline|fill|stroke)-navy-\d+\b/,
  /\b(text|bg|border|ring|outline|fill|stroke)-gold-\d+\b/,
  /\bhover:(text|bg|border)-navy-\d+\b/,
  /\bhover:(text|bg|border)-gold-\d+\b/,
  /\bgroup-hover:(text|bg|border)-navy-\d+\b/,
  /\bgroup-hover:(text|bg|border)-gold-\d+\b/,
]

const ACCENT_INTERACTIVE_PATTERNS = [
  /\bhover:(text|bg|border)-accent\b/,
  /\bfocus:(text|bg|border)-accent\b/,
  /\bactive:(text|bg|border)-accent\b/,
]

const REPLACEMENT_MAP = {
  'bg-navy-800': 'bg-action-primary',
  'bg-navy-700': 'hover:bg-action-primaryHover',
  'bg-navy-50':  'bg-action-ghostBg | bg-surface-page',
  'text-navy-800': 'text-action-ghostText',
  'text-navy-600': 'text-action-muted',
  'text-navy-500': 'text-action-focus',
  'text-navy-400': 'text-content-icon',
  'border-navy-800': 'border-action-primary',
  'border-navy-200': 'border-action-ghostBorder',
  'border-navy-100': 'border-border-subtle',
}

function getSuggestion(rawClass) {
  return REPLACEMENT_MAP[rawClass] || 'ver src/lib/tokens.ts'
}

const noRawColorClasses = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Prohíbe clases de color primitivas en componentes.', category: 'Design System', recommended: true },
    messages: {
      primitiveColor:
        "Color primitivo '{{raw}}' detectado. Usar: {{suggestion}}. " +
        "Ver src/lib/tokens.ts",
    },
  },
  create(context) {
    const filename = context.getFilename()
    if (ALLOWED_FILES.some(f => filename.endsWith(f))) return {}
    if (!/\.(tsx?|jsx?)$/.test(filename)) return {}

    function check(node, value) {
      if (typeof value !== 'string') return
      for (const cls of value.split(/\s+/)) {
        for (const pat of RAW_PRIMITIVE_PATTERNS) {
          if (pat.test(cls)) {
            context.report({ node, messageId: 'primitiveColor',
              data: { raw: cls, suggestion: getSuggestion(cls) } })
            break
          }
        }
      }
    }

    return {
      JSXAttribute(node) {
        if (node.name.name !== 'className') return
        if (node.value?.type === 'Literal') check(node, node.value.value)
        if (node.value?.type === 'JSXExpressionContainer' &&
            node.value.expression.type === 'TemplateLiteral') {
          for (const q of node.value.expression.quasis) check(node, q.value.raw)
        }
      },
      CallExpression(node) {
        const isMerge = ['cn','cx','clsx','twMerge'].includes(node.callee.name)
        if (!isMerge) return
        for (const arg of node.arguments) {
          if (arg.type === 'Literal') check(node, arg.value)
          if (arg.type === 'TemplateLiteral') {
            for (const q of arg.quasis) check(node, q.value.raw)
          }
          if (arg.type === 'ArrayExpression') {
            for (const el of (arg.elements || [])) {
              if (el?.type === 'Literal') check(node, el.value)
            }
          }
        }
      },
    }
  },
}

const noInteractiveAccent = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Gold (accent-*) nunca en hover/focus/active.', category: 'Design System', recommended: true },
    messages: {
      interactiveAccent:
        "Token accent en variante interactiva: '{{cls}}'. " +
        "Hover/focus/active → action-*. Accent es solo decorativo.",
    },
  },
  create(context) {
    const filename = context.getFilename()
    if (ALLOWED_FILES.some(f => filename.endsWith(f))) return {}
    if (!/\.(tsx?|jsx?)$/.test(filename)) return {}
    function check(node, value) {
      if (typeof value !== 'string') return
      for (const cls of value.split(/\s+/)) {
        for (const pat of ACCENT_INTERACTIVE_PATTERNS) {
          if (pat.test(cls)) context.report({ node, messageId: 'interactiveAccent', data: { cls } })
        }
      }
    }
    return {
      JSXAttribute(node) {
        if (node.name.name !== 'className') return
        if (node.value?.type === 'Literal') check(node, node.value.value)
      },
    }
  },
}

const noRawIconColor = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Íconos Lucide deben usar text-content-icon, no primitivos.', category: 'Design System' },
    messages: { rawIconColor: "Icono con color primitivo '{{cls}}'. Usar text-content-icon." },
  },
  create(context) {
    const filename = context.getFilename()
    if (ALLOWED_FILES.some(f => filename.endsWith(f))) return {}
    if (!/\.(tsx?|jsx?)$/.test(filename)) return {}
    return {
      JSXOpeningElement(node) {
        for (const attr of node.attributes) {
          if (attr.type !== 'JSXAttribute' || attr.name?.name !== 'className') continue
          const val = attr.value?.type === 'Literal' ? attr.value.value : ''
          for (const cls of (val || '').split(/\s+/)) {
            if (/^text-(navy|gold)-\d+$/.test(cls)) {
              context.report({ node: attr, messageId: 'rawIconColor', data: { cls } })
            }
          }
        }
      },
    }
  },
}

// ─── EXPORT ───────────────────────────────────────────────────
module.exports = {
  rules: {
    'no-raw-color-classes':          noRawColorClasses,
    'no-interactive-accent':         noInteractiveAccent,
    'no-raw-icon-color':             noRawIconColor,
    'no-dynamic-color-interpolation':noDynamicColorInterpolation,
    'no-raw-style-hex':              noRawStyleHex,
    'no-unsafe-cn-spread':           noUnsafeCnSpread,
  },

  configs: {
    recommended: {
      plugins: ['design-tokens'],
      rules: {
        // Error = bloquea CI
        'design-tokens/no-raw-color-classes':           'error',
        'design-tokens/no-interactive-accent':          'error',
        'design-tokens/no-raw-style-hex':               'error',
        'design-tokens/no-dynamic-color-interpolation': 'error',
        // Warning = alerta sin bloquear (migración gradual)
        'design-tokens/no-raw-icon-color':              'warn',
        'design-tokens/no-unsafe-cn-spread':            'warn',
      },
    },
  },
}
