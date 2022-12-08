import { equals, isNil } from 'ramda'
import { NotificationConfiguration } from '../types/Table.types'
import subtractMinutes from './subtractMinutes'

const calculateNotificationConfiguration = (
  starts: string,
  time: string | null | undefined
): NotificationConfiguration =>
  isNil(time)
    ? {
        notification: 0,
        time: null,
      }
    : equals(time, starts)
    ? {
        notification: 0,
        time,
      }
    : equals(time, subtractMinutes(starts, 5))
    ? {
        notification: 5,
        time,
      }
    : equals(time, subtractMinutes(starts, 10))
    ? {
        notification: 10,
        time,
      }
    : equals(time, subtractMinutes(starts, 15))
    ? {
        notification: 15,
        time,
      }
    : {
        notification: 'custom',
        time,
      }

export default calculateNotificationConfiguration
