/* eslint-disable no-restricted-globals */
self.addEventListener('push', (event) => {
  if (!event.data) return
  const payload = event.data.json()
  event.waitUntil(
    self.registration.showNotification(payload.title, { body: payload.body })
  )
})
