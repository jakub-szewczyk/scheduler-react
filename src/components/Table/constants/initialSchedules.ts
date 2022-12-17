import { Schedule } from '../types/Table.types'

const initialSchedules: Schedule[] = [
  {
    name: 'unsaved',
    selected: true,
    rows: [
      { id: 'Monday', day: 'Monday' },
      { id: 'Tuesday', day: 'Tuesday' },
      { id: 'Wednesday', day: 'Wednesday' },
      { id: 'Thursday', day: 'Thursday' },
      { id: 'Friday', day: 'Friday' },
    ],
  },
]

export default initialSchedules
