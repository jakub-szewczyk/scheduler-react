import { format as fnsFormat, isValid, subMinutes } from 'date-fns'
import { constant, pipe } from 'fp-ts/lib/function'
import { ap, getOrElse, none, of, some } from 'fp-ts/lib/Option'
import { equals } from 'ramda'
import { Time } from '../types/time'

const TIME_FORMAT = 'hh:mm aaa'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export const format = (time: Time) =>
  time && isValid(new Date(time))
    ? some(fnsFormat(new Date(time), TIME_FORMAT))
    : none

export const matches = (t0: Time, t1: Time) =>
  pipe(equals, of, ap(format(t0)), ap(format(t1)), getOrElse(constant(false)))

export const subtractMinutes = (time: string, minutes: number) =>
  subMinutes(new Date(time), minutes).toISOString()
