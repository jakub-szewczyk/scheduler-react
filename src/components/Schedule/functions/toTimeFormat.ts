import { format, isValid } from 'date-fns'
import { none, some } from 'fp-ts/lib/Option'
import timeFormat from '../constants/timeFormat'
import { Time } from '../types/Schedule.types'

const toTimeFormat = (time: Time) =>
  time && isValid(new Date(time))
    ? some(format(new Date(time), timeFormat))
    : none

export default toTimeFormat
