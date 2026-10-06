/**
 * Prints an ADMIN_PASSWORD_HASH for the admin panel.
 *   npm run admin:hash-password
 * Paste the printed value into Vercel → Settings → Environment Variables as ADMIN_PASSWORD_HASH, then redeploy.
 */
import { randomBytes } from 'node:crypto'
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { hashPassword } from '../api/_lib/password.ts'

const rl = createInterface({ input: stdin, output: stdout })
const password = await rl.question('New admin password (12+ characters): ')
rl.close()

if (password.length < 12) {
  console.error('\nPlease use at least 12 characters — a short phrase works well, e.g. "steel-beam-coffee-2026".')
  process.exit(1)
}

console.log('\nADMIN_PASSWORD_HASH=' + (await hashPassword(password)))
console.log('\nIf you have not set one yet, here is a random SESSION_SECRET you can use:')
console.log('SESSION_SECRET=' + randomBytes(32).toString('base64url'))
