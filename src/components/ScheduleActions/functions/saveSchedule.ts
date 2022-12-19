import { lensProp, map, prop, set, when } from 'ramda'
import { Schedule } from '../../Schedule/types/Schedule.types'

const saveSchedule = (name: string): ((schedule: Schedule[]) => Schedule[]) =>
  map(when(prop('selected'), set(lensProp('name'), name)))

export default saveSchedule
