import { Project } from '@/types/project'
import { Row } from '@/types/row'
import { pipe } from 'fp-ts/lib/function'
import produce from 'immer'
import { map } from 'ramda'
import { utils, writeFileXLSX } from 'xlsx'
import * as ROW from '../modules/row'
import { Schedule } from '../types/schedule'

export const initialValues = (): Schedule[] => [
  {
    name: 'unsaved',
    project: 'unsaved',
    selected: true,
    createdAt: new Date().toISOString(),
    rows: [
      { id: 'Monday', day: 'Monday' },
      { id: 'Tuesday', day: 'Tuesday' },
      { id: 'Wednesday', day: 'Wednesday' },
      { id: 'Thursday', day: 'Thursday' },
      { id: 'Friday', day: 'Friday' },
    ],
  },
]

export const calculateSubState = (rows: Row[], project: Project) =>
  produce((schedules: Schedule[]) => {
    const schedule = schedules.find(
      (schedule) => schedule.project === project.name && schedule.selected
    )!
    schedule.rows = rows
  })

export const create = (project: Project) =>
  produce((schedules: Schedule[]) => {
    schedules.forEach(
      (schedule) =>
        schedule.project === project.name && (schedule.selected = false)
    )
    schedules.push({ ...initialValues()[0], project: project.name })
  })

export const remove = (project: Project, name: string) =>
  produce((schedules: Schedule[]) => {
    const scheduleIndex = schedules.findIndex(
      (schedule) => schedule.project === project.name && schedule.name === name
    )
    const [removedSchedule] = schedules.splice(scheduleIndex, 1)
    if (removedSchedule.selected) {
      const projectSchedules = schedules.filter(
        (schedule) => schedule.project === project.name
      )
      projectSchedules[projectSchedules.length - 1].selected = true
    }
  })

export const select = (project: Project, name: string) =>
  produce((schedules: Schedule[]) =>
    schedules.forEach(
      (schedule) =>
        schedule.project === project.name &&
        (schedule.selected = schedule.name === name)
    )
  )

export const save = (project: Project) => (name: string) =>
  produce((schedules: Schedule[]) =>
    schedules.forEach(
      (schedule) =>
        schedule.project === project.name &&
        schedule.selected &&
        (schedule.name = name)
    )
  )

export const exportToXLSX = (schedule: Schedule) => () => {
  const ws = utils.json_to_sheet(pipe(schedule.rows, map(ROW.toXLSX)))
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')
  writeFileXLSX(wb, `${schedule.name}.xlsx`)
}
