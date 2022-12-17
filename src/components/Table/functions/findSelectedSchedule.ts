import { find, prop } from 'ramda'
import { Schedule } from '../types/Table.types'

const findSelectedSchedule = find<Schedule>(prop('selected'))

export default findSelectedSchedule
