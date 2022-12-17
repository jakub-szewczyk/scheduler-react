import { find, prop } from 'ramda'
import { Schedule } from '../types/Schedule.types'

const findSelectedSchedule = find<Schedule>(prop('selected'))

export default findSelectedSchedule
