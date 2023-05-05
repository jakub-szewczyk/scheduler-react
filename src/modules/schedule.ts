import { Project } from '@/types/project'
import { prop } from 'fp-ts-ramda'
import { pipe } from 'fp-ts/lib/function'
import produce from 'immer'
import { find, map } from 'ramda'
import { utils, writeFileXLSX } from 'xlsx'
import * as ROW from '../modules/row'
import { Schedule } from '../types/schedule'

const INITIAL_VALUES: Schedule[] = [
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

const findSelected = find<Schedule>(prop('selected'))

const add = (project: Project) =>
  produce((schedules: Schedule[]) => {
    // NOTE: This works although I don't know why
    // const projectSchedules = schedules.filter(
    //   (schedule) => schedule.project === project.name
    // )
    // projectSchedules.forEach(
    //   (projectSchedule) => (projectSchedule.selected = false)
    // )
    // schedules.push({ ...INITIAL_VALUES[0], project: project.name })
    schedules.forEach((schedule) => {
      if (schedule.project === project.name) {
        schedule.selected = false
      }
    })
    schedules.push({ ...INITIAL_VALUES[0], project: project.name })
  })

const remove = (project: Project, name: string) =>
  produce((schedules: Schedule[]) => {
    const scheduleIndex = schedules.findIndex(
      (schedule) => schedule.project === project.name && schedule.name === name
    )
    const [removedSchedule] = schedules.splice(scheduleIndex, 1)
    if (removedSchedule.selected)
      schedules[schedules.length - 1].selected = true
  })

const save = (project: Project) => (name: string) =>
  produce((schedules: Schedule[]) => {
    // NOTE: This works although I don't know why
    // const projectSchedules = schedules.filter(
    //   (schedule) => schedule.project === project.name
    // )
    // const selectedProjectSchedule = projectSchedules.find(
    //   (projectSchedule) => projectSchedule.selected
    // )!
    // selectedProjectSchedule.name = name
    schedules.forEach((schedule) => {
      if (schedule.project === project.name && schedule.selected) {
        schedule.name = name
      }
    })
  })

const select = (project: Project, name: string) =>
  produce((schedules: Schedule[]) => {
    // NOTE: This works although I don't know why
    // const projectSchedules = schedules.filter(
    //   (schedule) => schedule.project === project.name
    // )
    // projectSchedules.forEach(
    //   (projectSchedule) =>
    //     (projectSchedule.selected = projectSchedule.name === name)
    // )
    schedules.forEach((schedule) => {
      if (schedule.project === project.name) {
        schedule.selected = schedule.name === name
      }
    })
  })

const exportToXLSX = (schedule: Schedule) => () => {
  const ws = utils.json_to_sheet(pipe(schedule.rows, map(ROW.toXLSX)))
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')
  writeFileXLSX(wb, `${schedule.name}.xlsx`)
}

export { INITIAL_VALUES, findSelected, add, remove, save, select, exportToXLSX }
