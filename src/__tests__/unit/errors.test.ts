import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  DatabaseError,
  serializeError,
} from '@/lib/errors'

describe('AppError', () => {
  it('creates error with correct properties', () => {
    const err = new AppError('Test error', 'TEST_CODE', 400)
    expect(err.message).toBe('Test error')
    expect(err.code).toBe('TEST_CODE')
    expect(err.statusCode).toBe(400)
    expect(err).toBeInstanceOf(Error)
  })
})

describe('NotFoundError', () => {
  it('creates 404 error', () => {
    const err = new NotFoundError('Propiedad', 'abc-123')
    expect(err.statusCode).toBe(404)
    expect(err.code).toBe('NOT_FOUND')
    expect(err.message).toContain('abc-123')
  })
})

describe('ValidationError', () => {
  it('creates 400 error with fields', () => {
    const err = new ValidationError('Datos inválidos', { title: 'Requerido' })
    expect(err.statusCode).toBe(400)
    expect(err.fields).toEqual({ title: 'Requerido' })
  })
})

describe('UnauthorizedError', () => {
  it('creates 401 error', () => {
    const err = new UnauthorizedError()
    expect(err.statusCode).toBe(401)
    expect(err.code).toBe('UNAUTHORIZED')
  })
})

describe('serializeError', () => {
  it('serializes AppError correctly', () => {
    const err = new AppError('Mensaje', 'MY_CODE')
    const result = serializeError(err)
    expect(result.message).toBe('Mensaje')
    expect(result.code).toBe('MY_CODE')
  })

  it('hides internals for generic Error', () => {
    const err = new Error('Detalle interno secreto')
    const result = serializeError(err)
    expect(result.message).toBe('Error interno del servidor')
    expect(result.code).toBe('INTERNAL_ERROR')
  })

  it('handles non-Error objects', () => {
    const result = serializeError('cadena de error')
    expect(result.code).toBe('UNKNOWN_ERROR')
  })
})
