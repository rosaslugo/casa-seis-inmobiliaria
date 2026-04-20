// ── Structured logger — replaces raw console.log ─────────────
// In production, swap `transport` for a service like Axiom / Sentry / Logtail

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  timestamp: string
}

const isDev = process.env.NODE_ENV === 'development'

function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    context,
    timestamp: new Date().toISOString(),
  }

  if (isDev) {
    const color = { debug: '\x1b[37m', info: '\x1b[36m', warn: '\x1b[33m', error: '\x1b[31m' }[level]
    console.log(`${color}[${level.toUpperCase()}]\x1b[0m ${message}`, context ?? '')
  } else {
    // In production: structured JSON — forward to log aggregator
    if (level === 'error' || level === 'warn') {
      console.error(JSON.stringify(entry))
    }
  }
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => log('debug', msg, ctx),
  info:  (msg: string, ctx?: Record<string, unknown>) => log('info',  msg, ctx),
  warn:  (msg: string, ctx?: Record<string, unknown>) => log('warn',  msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
}
