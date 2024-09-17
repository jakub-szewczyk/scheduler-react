import { api } from './api'

type CreatePushSubscriptionResponseBody = {
  id: string
  createdAt: string
  entity: PushSubscription
}

export const createPushSubscription = (data: PushSubscription) =>
  api
    .post<CreatePushSubscriptionResponseBody>(`/push-subscriptions`, data)
    .then(({ data }) => data)
