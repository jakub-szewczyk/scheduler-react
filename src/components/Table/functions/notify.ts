import { constant, pipe } from 'fp-ts/lib/function'
import * as Task from 'fp-ts/Task'
import { equals } from 'ramda'

const isPermissionGranted = equals('granted')

const notify = (title: string, options?: NotificationOptions) =>
  isPermissionGranted(Notification.permission)
    ? Task.of(constant(new Notification(title, options)))
    : pipe(
        Notification.requestPermission,
        Task.map(constant(new Notification(title, options)))
      )

export default notify
