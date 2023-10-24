import api from './api'

interface RegisterPushSubscriptionPayload {
  pushSubscription: PushSubscription
  token: string | null
}

export const registerPushSubscription = ({
  pushSubscription,
  token,
}: RegisterPushSubscriptionPayload) =>
  api.post('/push-subscription', pushSubscription, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
