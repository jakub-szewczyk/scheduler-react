import { subMinutes } from 'date-fns'

const subtractMinutes = (time: string, minutes: number) =>
  subMinutes(new Date(time), minutes).toISOString()

export default subtractMinutes
