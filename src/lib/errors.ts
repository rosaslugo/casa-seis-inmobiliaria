// ── Typed application errors ──────────────────────────────────

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} con id "${id}" no encontrado` : `${resource} no encontrado`,
      'NOT_FOUND',
      404,
      { resource, id }
    )
    this.name = 'NotFoundError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly fields?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400, { fields })
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super('No autorizado', 'UNAUTHORIZED', 401)
    this.name = 'UnauthorizedError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: string) {
    super(message, 'DATABASE_ERROR', 500, { originalError })
    this.name = 'DatabaseError'
  }
}

// ── Safe error serializer (never expose internals) ────────────
export function serializeError(error: unknown): { message: string; code: string } {
  if (error instanceof AppError) {
    return { message: error.message, code: error.code }
  }
  if (error instanceof Error) {
    return { message: 'Error interno del servidor', code: 'INTERNAL_ERROR' }
  }
  return { message: 'Error desconocido', code: 'UNKNOWN_ERROR' }
}
