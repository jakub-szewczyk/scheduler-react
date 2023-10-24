import { registerPushSubscription } from '@/services/notification'
import { Task } from 'fp-ts/lib/Task'
import { equals, isNil } from 'ramda'
import { NotificationConfiguration } from '../types/notification'
import * as TIME from './time'

const isPermissionGranted = equals('granted')

export const notify =
  (title: string, options?: NotificationOptions): Task<Notification> =>
  () =>
    isPermissionGranted(Notification.permission)
      ? Promise.resolve(new Notification(title, options))
      : Notification.requestPermission().then(
          () => new Notification(title, options)
        )

export const calculateTime = (
  starts: string,
  values: NotificationConfiguration
) =>
  isNaN(+values.notification)
    ? values.time
    : TIME.subtractMinutes(starts, +values.notification)

export const calculateConfiguration = (
  starts: string,
  time: string | null | undefined,
  title = ''
): NotificationConfiguration =>
  isNil(time)
    ? {
        notification: 0,
        time: null,
        title,
      }
    : equals(time, starts)
    ? {
        notification: 0,
        time,
        title,
      }
    : equals(time, TIME.subtractMinutes(starts, 5))
    ? {
        notification: 5,
        time,
        title,
      }
    : equals(time, TIME.subtractMinutes(starts, 10))
    ? {
        notification: 10,
        time,
        title,
      }
    : equals(time, TIME.subtractMinutes(starts, 15))
    ? {
        notification: 15,
        time,
        title,
      }
    : {
        notification: 'custom',
        time,
        title,
      }

// TODO: Clean up this module
const urlBase64ToUint8Array = (base64String: string) => {
  const data = window.atob(
    (base64String + '='.repeat((4 - (base64String.length % 4)) % 4))
      .replace(/-/g, '+')
      .replace(/_/g, '/')
  )
  const array = new Uint8Array(data.length)
  for (let i = 0; i < data.length; ++i) {
    array[i] = data.charCodeAt(i)
  }
  return array
}

export const subscribe = async (token: string | null) => {
  if ((await Notification.requestPermission()) !== 'granted')
    throw new Error(
      'Permission must be granted in order to receive notifications'
    )
  if (localStorage.getItem('pushSubscription')) return
  try {
    const serviceWorkerRegistration = await navigator.serviceWorker.register(
      '/service-worker.js'
    )
    const pushSubscription =
      await serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY
        ),
      })
    localStorage.setItem('pushSubscription', JSON.stringify(pushSubscription))
    await registerPushSubscription({ pushSubscription, token })
  } catch (error) {
    throw new Error(
      "Subscribing to notification failed. Please delete site's data and try again."
    )
  }
}
