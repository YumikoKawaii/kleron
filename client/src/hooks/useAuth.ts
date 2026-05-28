import { useEffect, useState } from 'react'
import { authClient } from '../lib/rpc'
import type { User } from '../pb/kleron/v1/auth_pb'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authClient.getMe({})
      .then(res => setUser(res.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}
