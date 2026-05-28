import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authClient } from '../lib/rpc'
import { setToken } from '../lib/auth'

export function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')

    const storedState = sessionStorage.getItem('oauth_state')
    const verifier = sessionStorage.getItem('pkce_verifier')

    if (!code || !state || state !== storedState || !verifier) {
      navigate('/login', { replace: true })
      return
    }

    sessionStorage.removeItem('oauth_state')
    sessionStorage.removeItem('pkce_verifier')

    authClient.exchangeCode({ code, state, codeVerifier: verifier })
      .then(({ accessToken }) => {
        setToken(accessToken)
        navigate('/', { replace: true })
      })
      .catch(() => navigate('/login', { replace: true }))
  }, [navigate])

  return (
    <div className="min-h-screen bg-parchment-50 flex items-center justify-center">
      <p className="font-body italic text-ink-fade animate-pulse">Reading the omens…</p>
    </div>
  )
}
