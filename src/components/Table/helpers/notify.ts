import { Task } from 'fp-ts/lib/Task'
import { equals } from 'ramda'

const isPermissionGranted = equals('granted')

const notify =
  (title: string, options?: NotificationOptions): Task<Notification> =>
  () =>
    isPermissionGranted(Notification.permission)
      ? Promise.resolve(new Notification(title, options))
      : Notification.requestPermission().then(
          () => new Notification(title, options)
        )

export default notify
