import { Board } from '@/types/board'
import { Project } from '@/types/project'
import { Schedule } from '@/types/schedule'
import { flow } from 'fp-ts/lib/function'
import { __, concat, equals, lensProp, map, prop, set, when } from 'ramda'

type ProjectsEndomorphism = (projects: Project[]) => Project[]

const INITIAL_VALUES: Project[] = [
  {
    name: 'unsaved',
    description: '',
    selected: true,
    createdAt: new Date().toISOString(),
  },
]

const add: ProjectsEndomorphism = concat(
  __,
  INITIAL_VALUES.map((project) => ({ ...project, selected: false }))
)

const save =
  (previousName: string) =>
  (currentName: string): ProjectsEndomorphism =>
    map(
      when(
        (project) => project.name === previousName,
        set(lensProp('name'), currentName)
      )
    )

const select = (name: string): ProjectsEndomorphism =>
  map(
    flow(
      set(lensProp('selected'), false),
      when(flow(prop('name'), equals(name)), set(lensProp('selected'), true))
    )
  )

// TODO: Move to corresponding modules, in this case to a schedule module.
const updateBoardForeignKey =
  (project: Project) => (name: string) => (boards: Board[]) =>
    boards.map((board) => ({
      ...board,
      project: board.project === project.name ? name : board.project,
    }))

// TODO: Move to corresponding modules, in this case to a schedule module.
const updateScheduleForeignKey =
  (project: Project) => (name: string) => (schedules: Schedule[]) =>
    schedules.map((schedule) => ({
      ...schedule,
      project: schedule.project === project.name ? name : schedule.project,
    }))

export {
  INITIAL_VALUES,
  add,
  save,
  select,
  updateBoardForeignKey,
  updateScheduleForeignKey,
}
