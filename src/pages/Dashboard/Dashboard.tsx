import Navbar from '../../components/layout/Navbar/Navbar'
import Schedule from '../../components/Schedule/Schedule'
import ScheduleActions from '../../components/ScheduleActions/ScheduleActions'
import useSchedules from '../../hooks/useSchedules'

const Dashboard = () => {
  const { schedule, schedules, setSchedules, setRows } = useSchedules()

  return (
    <>
      <Navbar scheduleName={schedule.name} />
      <Schedule rows={schedule.rows} setRows={setRows} />
      <ScheduleActions
        schedule={schedule}
        schedules={schedules}
        setSchedules={setSchedules}
      />
    </>
  )
}

export default Dashboard
