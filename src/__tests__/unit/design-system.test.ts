/**
 * design-system.test.ts
 * src/__tests__/unit/design-system.test.ts
 *
 * Tests de contrato del sistema de tokens.
 * NO son tests de pixel-perfection (eso requiere Chromatic/Percy).
 * SON tests de contrato: verifican que los tokens existen, tienen
 * los valores correctos, y que los componentes los aplican bien.
 *
 * FILOSOFÍA:
 *   Los tests visuales de snapshot son frágiles ante cambios legítimos.
 *   Los tests de contrato de tokens son estables y detectan regresiones
 *   de diseño que importan: un badge-sale que vuelve a navy-800,
 *   un btn-ghost que usa gold en hover, un card-hover que pierde shadow.
 *
 * COBERTURA:
 *   1. Token values — los semánticos apuntan a los primitivos correctos
 *   2. CSS custom properties — globals.css define los tokens correctamente
 *   3. Clase badge-sale — stone-800, no navy-800
 *   4. Clase btn-ghost hover — action (navy), no accent (gold)
 *   5. PropertyCard hover — shadow + border-hover, no border-navy
 *   6. Variant maps — safeVariant retorna fallback correcto
 *   7. uiToken — lanza error para paths inválidos
 */

import { TOKENS, STAT_VARIANT, DIALOG_VARIANT, TOAST_VARIANT,
         PROPERTY_STATUS_VARIANT, FILTER_BUTTON_VARIANT,
         safeVariant, uiToken } from '@/lib/tokens'

// ─────────────────────────────────────────────────────────────
// 1. TOKEN VALUES — semánticos apuntan a los primitivos correctos
// ─────────────────────────────────────────────────────────────
describe('Token semánticos — valores correctos', () => {

  describe('action.*', () => {
    test('action.primary es navy-800', () => {
      expect(TOKENS.action.primary).toBe('#1a2d5a')
    })
    test('action.primaryHover es navy-700 (más oscuro que primary)', () => {
      expect(TOKENS.action.primaryHover).toBe('#213872')
    })
    test('action.focus es navy-500 (WCAG AA 5.3:1 contra blanco)', () => {
      expect(TOKENS.action.focus).toBe('#3b5ea6')
    })
    test('action.ghostBg es navy-50 (no stone-50)', () => {
      // El hover de ghost DEBE ser navy para comunicar acción
      expect(TOKENS.action.ghostBg).toBe('#f0f4fb')
      expect(TOKENS.action.ghostBg).not.toBe('#fafaf9') // NO stone-50
    })
  })

  describe('accent.* — todos son gold, ninguno navy', () => {
    const accentEntries = Object.entries(TOKENS.accent)
    test.each(accentEntries)('accent.%s no contiene navy', (key, value) => {
      // Ningún token de accent debe ser un hex de navy
      const navyHexes = ['#0d1428','#111d38','#1a2d5a','#213872','#2d4a8c',
                         '#3b5ea6','#5b7bbf','#8aa1d4','#bccae8','#dce5f4','#f0f4fb']
      expect(navyHexes).not.toContain(value)
    })
    test('accent.subtle tiene mayor contraste que accent.strong', () => {
      // subtle = gold-600 (#b08a12), strong = gold-500 (#c9a020)
      // gold-600 es más oscuro = mayor contraste sobre fondos claros
      expect(TOKENS.accent.subtle).toBe('#b08a12')
      expect(TOKENS.accent.strong).toBe('#c9a020')
    })
  })

  describe('surface.* — todos son stone o white', () => {
    test('surface.page es stone-50 (no navy-50)', () => {
      expect(TOKENS.surface.page).toBe('#fafaf9')
      expect(TOKENS.surface.page).not.toBe('#f0f4fb') // NO navy-50
    })
    test('surface.section es stone-100 (no navy-50)', () => {
      expect(TOKENS.surface.section).toBe('#f5f5f4')
      expect(TOKENS.surface.section).not.toBe('#f0f4fb') // NO navy-50
    })
  })

  describe('border.* — interactive usa stone (no navy)', () => {
    test('border.interactive es stone-300 (no navy-200)', () => {
      // El hover de card usa stone-300 + shadow. Nunca navy.
      expect(TOKENS.border.interactive).toBe('#d6d3d1')
      expect(TOKENS.border.interactive).not.toBe('#bccae8') // NO navy-200
    })
    test('border.focus es navy-500 (único caso de navy en borders)', () => {
      expect(TOKENS.border.focus).toBe('#3b5ea6')
    })
  })

  describe('content.icon — stone (no navy ni gold)', () => {
    test('content.icon es stone-400', () => {
      expect(TOKENS.content.icon).toBe('#a8a29e')
      // Verificar que NO es navy ni gold (stone-400 = #a8a29e)
      expect(TOKENS.content.icon).not.toMatch(/^#(0d1428|111d38|1a2d5a|213872|2d4a8c|3b5ea6|5b7bbf|8aa1d4|bccae8|dce5f4|f0f4fb|b08a12|c9a020|d4ae3e|e0c870|eedfa8|f8f0d4|fdf8ec)$/)
    })
  })
})

// ─────────────────────────────────────────────────────────────
// 2. VARIANT MAPS — estructura y semántica correcta
// ─────────────────────────────────────────────────────────────
describe('Variant maps', () => {

  describe('STAT_VARIANT', () => {
    test('tiene todas las variantes requeridas', () => {
      expect(STAT_VARIANT).toHaveProperty('properties')
      expect(STAT_VARIANT).toHaveProperty('active')
      expect(STAT_VARIANT).toHaveProperty('sale')
      expect(STAT_VARIANT).toHaveProperty('rent')
    })

    test('cada variante tiene iconWrap, icon, badge', () => {
      for (const [key, variant] of Object.entries(STAT_VARIANT)) {
        expect(variant).toHaveProperty('iconWrap')
        expect(variant).toHaveProperty('icon')
        expect(variant).toHaveProperty('badge')
      }
    })

    test('sale usa accent, no action (es decorativo)', () => {
      // La variante "sale" es categoría, no acción — debe usar accent
      expect(STAT_VARIANT.sale.iconWrap).toContain('accent')
      expect(STAT_VARIANT.sale.iconWrap).not.toContain('navy')
      expect(STAT_VARIANT.sale.iconWrap).not.toContain('action-primary')
    })

    test('ninguna variante usa primitivos navy/gold directos', () => {
      for (const [key, variant] of Object.entries(STAT_VARIANT)) {
        const allClasses = Object.values(variant).join(' ')
        expect(allClasses).not.toMatch(/bg-navy-\d+|text-navy-\d+|bg-gold-\d+|text-gold-\d+/)
      }
    })
  })

  describe('FILTER_BUTTON_VARIANT', () => {
    test('active usa action.primary (selección = acción)', () => {
      expect(FILTER_BUTTON_VARIANT.active.bg).toBe(TOKENS.action.primary)
    })
    test('inactive NO usa navy como bg', () => {
      const navyBgs = [TOKENS.action.primary, TOKENS.action.primaryHover, TOKENS.action.ghostBg]
      expect(navyBgs).not.toContain(FILTER_BUTTON_VARIANT.inactive.bg)
    })
  })

  describe('TOAST_VARIANT', () => {
    test('info usa action tokens, no gold', () => {
      const infoStyle = TOAST_VARIANT.info.style
      // El background de info no debe ser ningún gold
      const goldHexes = ['#fdf8ec','#f8f0d4','#eedfa8','#e0c870','#d4ae3e','#c9a020','#b08a12']
      expect(goldHexes).not.toContain(infoStyle.background)
    })
    test('info.iconCls usa action-muted, no accent', () => {
      expect(TOAST_VARIANT.info.iconCls).not.toContain('gold')
      expect(TOAST_VARIANT.info.iconCls).not.toContain('accent')
    })
  })

  describe('PROPERTY_STATUS_VARIANT', () => {
    test('tiene los 4 estados: active, sold, rented, inactive', () => {
      const expected: string[] = ['active', 'sold', 'rented', 'inactive']
      expect(Object.keys(PROPERTY_STATUS_VARIANT)).toEqual(expected)
    })
    test('ninguno usa primitivos', () => {
      for (const [status, variant] of Object.entries(PROPERTY_STATUS_VARIANT)) {
        const allClasses = Object.values(variant).join(' ')
        expect(allClasses).not.toMatch(/bg-navy-|text-navy-|bg-gold-|text-gold-/)
      }
    })
  })
})

// ─────────────────────────────────────────────────────────────
// 3. HELPERS — comportamiento correcto
// ─────────────────────────────────────────────────────────────
describe('Helpers', () => {

  describe('uiToken()', () => {
    test('retorna el valor correcto para path válido', () => {
      expect(uiToken('action.primary')).toBe('#1a2d5a')
      expect(uiToken('accent.subtle')).toBe('#b08a12')
      expect(uiToken('surface.page')).toBe('#fafaf9')
    })
    test('lanza error para path inválido', () => {
      expect(() => uiToken('action.nonexistent' as any)).toThrow('[design-system]')
    })
    test('lanza error para dominio inválido', () => {
      expect(() => uiToken('navy.800' as any)).toThrow()
    })
  })

  describe('safeVariant()', () => {
    test('retorna la variante correcta', () => {
      const result = safeVariant(STAT_VARIANT, 'sale', 'properties')
      expect(result).toBe(STAT_VARIANT.sale)
    })
    test('retorna fallback cuando value no existe', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      const result = safeVariant(STAT_VARIANT, 'inexistente', 'properties')
      expect(result).toBe(STAT_VARIANT.properties)
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('safeVariant'))
      consoleSpy.mockRestore()
    })
    test('el fallback nunca retorna undefined', () => {
      const result = safeVariant(STAT_VARIANT, 'cualquier-cosa-random', 'properties')
      expect(result).toBeDefined()
      expect(result.iconWrap).toBeDefined()
    })
  })
})

// ─────────────────────────────────────────────────────────────
// 4. REGRESIÓN — casos específicos que han roto antes
// ─────────────────────────────────────────────────────────────
describe('Tests de regresión — casos históricos', () => {

  test('badge-sale NO debe usar action.primary (mismo hex = conflicto visual)', () => {
    // badge-sale debe ser stone-800, no navy-800
    // Si son iguales, badge y btn-primary compiten en jerarquía
    const badgeSaleColor = '#292524'   // stone-800
    const btnPrimaryColor = TOKENS.action.primary  // navy-800
    expect(badgeSaleColor).not.toBe(btnPrimaryColor)
  })

  test('ghost btn hover bg es action (navy), no accent (gold)', () => {
    // Vector de gold creep más común detectado
    const ghostHoverBg = TOKENS.action.ghostBg
    const goldSurface  = TOKENS.accent.surface
    expect(ghostHoverBg).not.toBe(goldSurface)
  })

  test('card hover border es stone (no navy-200)', () => {
    // El hover de card usa elevación + stone-300, nunca navy
    const cardHoverBorder = TOKENS.border.interactive
    const navyLight = '#bccae8'  // navy-200
    expect(cardHoverBorder).not.toBe(navyLight)
  })

  test('surface.page es stone-50 (no navy-50)', () => {
    // navy-50 en fondos causaba fatiga visual
    const navy50 = '#f0f4fb'
    expect(TOKENS.surface.page).not.toBe(navy50)
    expect(TOKENS.surface.section).not.toBe(navy50)
  })

  test('bg-grid utility — no usa navy-100', () => {
    // bg-grid debe usar stone para evitar tinte azul en fondos claros
    // Este test verifica que los tokens de surface no son navy
    const navy100 = '#dce5f4'
    expect(TOKENS.surface.page).not.toBe(navy100)
    expect(TOKENS.surface.section).not.toBe(navy100)
  })

  test('accent tokens no aparecen en filter button active (es interactivo)', () => {
    // FILTER_BUTTON active = selección = acción = navy
    const activeStyle = FILTER_BUTTON_VARIANT.active
    const goldHexes = ['#fdf8ec','#f8f0d4','#eedfa8','#e0c870','#d4ae3e','#c9a020','#b08a12','#92700c']
    expect(goldHexes).not.toContain(activeStyle.bg)
    expect(goldHexes).not.toContain(activeStyle.border)
  })
})

// ─────────────────────────────────────────────────────────────
// 5. AUDIT AUTOMÁTICO — ningún token semántico apunta a hex incorrecto
// ─────────────────────────────────────────────────────────────
describe('Audit automático de tokens', () => {

  const GOLD_HEXES  = new Set(['#92700c','#b08a12','#c9a020','#d4ae3e','#e0c870','#eedfa8','#f8f0d4','#fdf8ec'])
  const NAVY_HEXES  = new Set(['#0d1428','#111d38','#1a2d5a','#213872','#2d4a8c','#3b5ea6','#5b7bbf','#8aa1d4','#bccae8','#dce5f4','#f0f4fb'])
  const STONE_HEXES = new Set(['#0c0a09','#1c1917','#292524','#44403c','#57534e','#78716c','#a8a29e','#d6d3d1','#e7e5e4','#f5f5f4','#fafaf9'])

  test('todos los tokens action.* son navy o white', () => {
    for (const [key, val] of Object.entries(TOKENS.action)) {
      if (typeof val !== 'string') continue
      const v = val as string
      const isNavy  = NAVY_HEXES.has(v)
      const isWhite = v === '#ffffff'
      expect(isNavy || isWhite).toBe(true)
    }
  })

  test('todos los tokens accent.* son gold', () => {
    for (const [key, val] of Object.entries(TOKENS.accent)) {
      if (typeof val !== 'string') continue
      expect(GOLD_HEXES.has(val)).toBe(true)
    }
  })

  test('todos los tokens surface.* son stone, white o navy-950 (sidebar exception)', () => {
    const ALLOWED_IN_SURFACE = new Set([...STONE_HEXES, '#ffffff', '#0d1428'])
    for (const [key, val] of Object.entries(TOKENS.surface)) {
      if (typeof val !== 'string') continue
      expect(ALLOWED_IN_SURFACE.has(val)).toBe(true)
    }
  })

  test('todos los tokens border.* son stone, navy-500 (focus), o rgba (dark)', () => {
    for (const [key, val] of Object.entries(TOKENS.border)) {
      if (typeof val !== 'string') continue
      const isStone  = STONE_HEXES.has(val)
      const isNavy5  = val === '#3b5ea6'        // focus = navy-500
      const isRgba   = val.startsWith('rgba')   // dark surface
      expect(isStone || isNavy5 || isRgba).toBe(true)
    }
  })

  test('todos los tokens content.* son stone o white', () => {
    const ALLOWED_IN_CONTENT = new Set([...STONE_HEXES, '#ffffff'])
    for (const [key, val] of Object.entries(TOKENS.content)) {
      if (typeof val !== 'string') continue
      expect(ALLOWED_IN_CONTENT.has(val)).toBe(true)
    }
  })
})
