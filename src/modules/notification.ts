import { registerServiceWorker } from './service-worker'

const base64ToUint8Array = (base64: string) => {
  const data = atob(
    (base64 + '='.repeat((4 - (base64.length % 4)) % 4))
      .replace(/-/g, '+')
      .replace(/_/g, '/')
  )
  return new Uint8Array(data.length).map((_, index) => data.charCodeAt(index))
}

export const requestPermission = async () => {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted')
    throw new Error('Permission to display push notifications was not granted')
}

export const getPushSubscription = async () =>
  (await registerServiceWorker())!.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64ToUint8Array(
      import.meta.env.VITE_VAPID_PUBLIC_KEY
    ),
  })
