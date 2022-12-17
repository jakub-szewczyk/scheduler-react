import { constant, pipe } from 'fp-ts/lib/function'
import { ap, getOrElse, of } from 'fp-ts/lib/Option'
import { equals } from 'ramda'
import { Time } from '../types/Schedule.types'
import toTimeFormat from './toTimeFormat'

const matchesTime = (t0: Time, t1: Time) =>
  pipe(
    equals,
    of,
    ap(toTimeFormat(t0)),
    ap(toTimeFormat(t1)),
    getOrElse(constant(false)) // NOTE: Is there a better way to do this?
  )

export default matchesTime
