import { NotificationConfiguration } from '../types/Table.types'
import subtractMinutes from './subtractMinutes'

const calculateNotificationTime = (
  starts: string,
  values: NotificationConfiguration
) =>
  isNaN(+values.notification)
    ? values.time
    : subtractMinutes(starts, +values.notification)

export default calculateNotificationTime
