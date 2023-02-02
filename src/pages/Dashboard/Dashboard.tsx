import Schedule from '../../components/Schedule/Schedule'
import ScheduleActions from '../../components/ScheduleActions/ScheduleActions'
import useSchedules from '../../hooks/useSchedules'

const Dashboard = () => {
  const { schedule, schedules, setSchedules, setRows } = useSchedules()

  return (
    <>
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
