// Shared admin auth helper with brute-force protection
const failedAttempts = new Map()

function checkAdminPin(headers) {
  const ip = (headers['x-forwarded-for'] || 'unknown').split(',')[0].trim()
  const pin = headers['x-admin-pin']
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const maxFails = 10

  const attempts = (failedAttempts.get(ip) || []).filter(t => now - t < windowMs)

  if (attempts.length >= maxFails) {
    return { allowed: false, reason: 'Too many failed attempts. Try again later.' }
  }

  if (!pin || pin !== process.env.ADMIN_PIN) {
    attempts.push(now)
    failedAttempts.set(ip, attempts)
    return { allowed: false, reason: 'Unauthorized' }
  }

  failedAttempts.delete(ip)
  return { allowed: true }
}

module.exports = { checkAdminPin }
