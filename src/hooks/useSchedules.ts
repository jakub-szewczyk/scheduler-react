import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import * as SCHEDULE from '../modules/schedule'
import { Row } from '../types/row'
import useProjects from './useProjects'

const useSchedules = () => {
  const { project } = useProjects()

  const [schedules, setSchedules] = useLocalStorage(
    'schedules',
    SCHEDULE.INITIAL_VALUES.map((schedule) => ({
      ...schedule,
      project: project.name,
    }))
  )

  // TODO: Consider renaming globally
  const workingSchedule = schedules.find(
    (schedule) => schedule.project === project.name && schedule.selected
  )!

  const workingSchedules = schedules.filter(
    (schedule) => schedule.project === project.name
  )

  const setRows: Dispatch<SetStateAction<Row[]>> = (rows) =>
    setSchedules(
      SCHEDULE.rowsSetter(
        typeof rows === 'function' ? rows(workingSchedule.rows) : rows,
        project
      )
    )

  return {
    schedule: workingSchedule,
    schedules: workingSchedules,
    setSchedules,
    setRows,
  }
}

export default useSchedules
