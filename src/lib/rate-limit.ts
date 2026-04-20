/**
 * Rate limiter — dual strategy:
 *
 *   Production (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set):
 *     Uses Upstash Redis — survives serverless cold starts and multiple instances.
 *     Sign up free at https://upstash.com → create a Redis DB → copy the REST URL & token.
 *
 *   Development / fallback (env vars not set):
 *     Falls back to an in-memory Map. Works fine locally; NOT suitable for
 *     multi-instance production (limits only apply per process).
 *
 * Usage:
 *   const allowed = await checkRateLimit(ip, { limit: 5, windowSec: 60 })
 */

interface RateLimitOptions {
  limit: number
  windowSec: number
}

// ── In-memory fallback ────────────────────────────────────────
const memStore = new Map<string, { count: number; resetAt: number }>()

function checkMemory(key: string, opts: RateLimitOptions): boolean {
  const now = Date.now()
  const entry = memStore.get(key)
  if (!entry || now > entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + opts.windowSec * 1000 })
    return true
  }
  if (entry.count >= opts.limit) return false
  entry.count++
  return true
}

// ── Upstash Redis ─────────────────────────────────────────────
async function checkUpstash(key: string, opts: RateLimitOptions): Promise<boolean> {
  const url   = process.env.UPSTASH_REDIS_REST_URL!
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!

  // Use INCR + EXPIRE via Upstash REST pipeline
  const pipeline = [
    ['INCR', key],
    ['EXPIRE', key, String(opts.windowSec)],
  ]

  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pipeline),
    cache: 'no-store',
  })

  if (!res.ok) {
    // If Redis is unreachable, fail open (allow the request)
    console.warn('[rate-limit] Upstash unreachable, failing open')
    return true
  }

  const data = await res.json() as [{ result: number }, unknown]
  const count = data[0]?.result ?? 1
  return count <= opts.limit
}

// ── Public API ────────────────────────────────────────────────
export async function checkRateLimit(
  identifier: string,
  opts: RateLimitOptions = { limit: 5, windowSec: 60 }
): Promise<boolean> {
  const key = `rl:${identifier}`

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return checkUpstash(key, opts)
  }

  return checkMemory(key, opts)
}
