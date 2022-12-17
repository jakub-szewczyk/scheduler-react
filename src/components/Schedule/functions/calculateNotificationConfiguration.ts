import { equals, isNil } from 'ramda'
import { NotificationConfiguration } from '../types/Schedule.types'
import subtractMinutes from './subtractMinutes'

const calculateNotificationConfiguration = (
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
    : equals(time, subtractMinutes(starts, 5))
    ? {
        notification: 5,
        time,
        title,
      }
    : equals(time, subtractMinutes(starts, 10))
    ? {
        notification: 10,
        time,
        title,
      }
    : equals(time, subtractMinutes(starts, 15))
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

export default calculateNotificationConfiguration
