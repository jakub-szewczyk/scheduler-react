import { lensProp, map, prop, set, when } from 'ramda'
import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import Navbar from '../../components/layout/Navbar/Navbar'
import Schedule from '../../components/Schedule/Schedule'
import ScheduleActions from '../../components/ScheduleActions/ScheduleActions'
import * as SCHEDULE from '../../modules/schedule'
import { Row } from '../../types/row'

const Dashboard = () => {
  const [schedules, setSchedules] = useLocalStorage(
    'schedules',
    SCHEDULE.INITIAL_VALUES
  )

  const schedule = SCHEDULE.findSelected(schedules)!

  const setRows = (rows: Row[]) =>
    setSchedules(map(when(prop('selected'), set(lensProp('rows'), rows))))

  return (
    <>
      <Navbar scheduleName={schedule.name} />
      <Schedule
        rows={schedule.rows}
        setRows={setRows as Dispatch<SetStateAction<Row[]>>}
      />
      <ScheduleActions
        schedule={schedule}
        schedules={schedules}
        setSchedules={setSchedules}
      />
    </>
  )
}

export default Dashboard
