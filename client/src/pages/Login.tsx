import { useState } from 'react'
import { motion } from 'framer-motion'
import { authClient } from '../lib/rpc'
import { generateCodeVerifier, generateCodeChallenge, generateState } from '../lib/auth'

export function Login() {
  const [loading, setLoading] = useState(false)

  async function handleGoogleLogin() {
    setLoading(true)
    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    const state = generateState()

    sessionStorage.setItem('pkce_verifier', verifier)
    sessionStorage.setItem('oauth_state', state)

    const { url } = await authClient.getAuthURL({ provider: 'google', codeChallenge: challenge, state })
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-parchment-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center space-y-8"
      >
        <h1 className="font-display text-5xl text-ink tracking-widest">Kleron</h1>
        <p className="font-body italic text-ink-fade text-lg">The cards await you</p>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogleLogin}
          disabled={loading}
          className="px-8 py-3 border border-parchment-400 bg-parchment-100 text-ink font-display text-sm tracking-widest uppercase hover:bg-parchment-200 transition-colors disabled:opacity-50"
        >
          {loading ? 'Consulting the stars…' : 'Enter with Google'}
        </motion.button>
      </motion.div>
    </div>
  )
}
