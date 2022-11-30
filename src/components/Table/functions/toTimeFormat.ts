import { format, isValid } from 'date-fns'
import { none, some } from 'fp-ts/lib/Option'
import timeFormat from '../constants/timeFormat'

const toTimeFormat = (time: string | undefined) =>
  time && isValid(new Date(time))
    ? some(format(new Date(time), timeFormat))
    : none

export default toTimeFormat
