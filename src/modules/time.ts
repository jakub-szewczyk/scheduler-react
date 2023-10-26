import { format as fnsFormat, isValid, subMinutes } from 'date-fns'
import { none, some } from 'fp-ts/lib/Option'
import { Time } from '../types/time'

const TIME_FORMAT = 'hh:mm aaa'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export const format = (time: Time) =>
  time && isValid(new Date(time))
    ? some(fnsFormat(new Date(time), TIME_FORMAT))
    : none

export const subtractMinutes = (time: string, minutes: number) =>
  subMinutes(new Date(time), minutes).toISOString()
