import { createClient } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-web'
import { TarotService } from '../gen/kleron/v1/tarot_connect'
import { AuthService } from '../gen/kleron/v1/auth_connect'
import { authInterceptor } from './auth'

const transport = createConnectTransport({
  baseUrl: '/rpc',
  interceptors: [authInterceptor],
})

export const tarotClient = createClient(TarotService, transport)
export const authClient = createClient(AuthService, transport)
