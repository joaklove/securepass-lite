const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUM = '0123456789'
const SYM = '!@#$%^&*'
const AMBIGUOUS = new Set(['i', 'l', '1', 'L', 'o', '0', 'O'])

function sanitizePool(pool, excludeAmbiguous) {
  if (!excludeAmbiguous) return pool
  let out = ''
  for (const ch of pool) {
    if (!AMBIGUOUS.has(ch)) out += ch
  }
  return out
}

function pickChar(pool) {
  if (!pool.length) throw new Error('Empty character pool')
  const u = new Uint32Array(1)
  crypto.getRandomValues(u)
  return pool[u[0] % pool.length]
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const u = new Uint32Array(1)
    crypto.getRandomValues(u)
    const j = u[0] % (i + 1)
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
  return arr
}

export function generatePassword({
  length,
  useUpper,
  useLower,
  useNumbers,
  useSymbols,
  excludeAmbiguous,
}) {
  const len = Number(length)
  if (!Number.isFinite(len) || len < 4 || len > 64) {
    throw new Error('Password length must be between 4 and 64')
  }

  const pools = []

  if (useUpper) pools.push(sanitizePool(UPPER, excludeAmbiguous))
  if (useLower) pools.push(sanitizePool(LOWER, excludeAmbiguous))
  if (useNumbers) pools.push(sanitizePool(NUM, excludeAmbiguous))
  if (useSymbols) pools.push(SYM)

  const activePools = pools.filter((p) => p.length > 0)
  if (!activePools.length) throw new Error('Select at least one character set')
  if (len < activePools.length) throw new Error('Length too short for selected options')

  const chars = []
  for (const pool of activePools) {
    chars.push(pickChar(pool))
  }

  const fullPool = activePools.join('')
  for (let i = chars.length; i < len; i += 1) {
    chars.push(pickChar(fullPool))
  }

  shuffle(chars)
  return chars.join('')
}

