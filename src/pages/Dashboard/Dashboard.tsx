import { lensProp, map, prop, set, when } from 'ramda'
import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import Navbar from '../../components/layout/Navbar/Navbar'
import SpeedDial from '../../components/layout/SpeedDial/SpeedDial'
import initialSchedules from '../../components/Schedule/constants/initialSchedules'
import findSelectedSchedule from '../../components/Schedule/functions/findSelectedSchedule'
import Schedule from '../../components/Schedule/Schedule'
import { Row } from '../../components/Schedule/types/Schedule.types'

const Dashboard = () => {
  const [schedules, setSchedules] = useLocalStorage(
    'schedules',
    initialSchedules
  )

  const { rows } = findSelectedSchedule(schedules)!

  const setRows = (rows: Row[]) =>
    setSchedules(map(when(prop('selected'), set(lensProp('rows'), rows))))

  return (
    <>
      <Navbar />
      <Schedule
        rows={rows}
        setRows={setRows as Dispatch<SetStateAction<Row[]>>}
      />
      <SpeedDial />
    </>
  )
}

export default Dashboard
