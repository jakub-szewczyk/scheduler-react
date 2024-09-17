import { registerServiceWorker } from './service-worker'

const base64ToUint8Array = (base64: string) => {
  const data = window.atob(
    (base64 + '='.repeat((4 - (base64.length % 4)) % 4))
      .replace(/-/g, '+')
      .replace(/_/g, '/')
  )
  const array = new Uint8Array(data.length)
  for (let i = 0; i < data.length; ++i) {
    array[i] = data.charCodeAt(i)
  }
  return array
}

export const requestPermission = () =>
  new Promise((resolve, reject) => {
    const permission = Notification.requestPermission(resolve)
    if (permission) permission.then(resolve, reject)
  }).then((permission) => {
    if ((permission as NotificationPermission) !== 'granted')
      throw new Error(
        'Permission to display push notifications was not granted'
      )
  })

export const getPushSubscription = async () =>
  (await registerServiceWorker())!.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64ToUint8Array(
      import.meta.env.VITE_VAPID_PUBLIC_KEY
    ),
  })
