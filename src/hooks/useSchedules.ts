import { Project } from '@/types/project'
import { Schedule } from '@/types/schedule'
import produce from 'immer'
import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import * as SCHEDULE from '../modules/schedule'
import { Row } from '../types/row'
import useProjects from './useProjects'

// TODO: Move to a module file
const rowsSetter = (rows: Row[], project: Project) =>
  produce((schedules: Schedule[]) => {
    // NOTE: This works although I don't know why
    // const projectSchedules = schedules.filter(
    //   (schedule) => schedule.project === project.name
    // )
    // const selectedProjectSchedule = projectSchedules.find(
    //   (projectSchedule) => projectSchedule.selected
    // )!
    // selectedProjectSchedule.rows = rows
    schedules.forEach((schedule) => {
      if (schedule.project === project.name && schedule.selected) {
        schedule.rows = rows
      }
    })
  })

const useSchedules = () => {
  const { project } = useProjects()

  const [schedules, setSchedules] = useLocalStorage(
    'schedules',
    SCHEDULE.INITIAL_VALUES.map((schedule) => ({
      ...schedule,
      project: project.name,
    }))
  )

  // TODO: Extract to function
  const schedule = SCHEDULE.findSelected(
    schedules.filter((schedule) => schedule.project === project.name)
  )!

  const setRows: Dispatch<SetStateAction<Row[]>> = (rows) =>
    setSchedules(
      rowsSetter(
        typeof rows === 'function' ? rows(schedule.rows) : rows,
        project
      )
    )

  return {
    schedule,
    schedules: schedules.filter(
      (schedule) => schedule.project === project.name
    ),
    setSchedules,
    setRows,
  }
}

export default useSchedules
