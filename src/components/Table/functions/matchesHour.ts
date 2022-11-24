import { format } from 'date-fns'
import timeFormat from '../constants/timeFormat'

const matchesHour = (starts: string | undefined) =>
  starts === format(Date.now(), timeFormat)

export default matchesHour
