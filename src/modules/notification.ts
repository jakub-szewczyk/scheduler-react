import { Task } from 'fp-ts/lib/Task'
import { equals, isNil } from 'ramda'
import { NotificationConfiguration } from '../types/notification'
import * as TIME from './time'

const isPermissionGranted = equals('granted')

const notify =
  (title: string, options?: NotificationOptions): Task<Notification> =>
  () =>
    isPermissionGranted(Notification.permission)
      ? Promise.resolve(new Notification(title, options))
      : Notification.requestPermission().then(
          () => new Notification(title, options)
        )

const calculateTime = (starts: string, values: NotificationConfiguration) =>
  isNaN(+values.notification)
    ? values.time
    : TIME.subtractMinutes(starts, +values.notification)

const calculateConfiguration = (
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

export { notify, calculateTime, calculateConfiguration }
