import { Board } from '@/types/board'
import { Note } from '@/types/note'
import { Project, ProjectsEndomorphism } from '@/types/project'
import { Schedule } from '@/types/schedule'
import { flow } from 'fp-ts/lib/function'
import { __, concat, equals, lensProp, map, prop, set, when } from 'ramda'

// TODO: `createdAt` shows stale date as it's a constant not a function.
export const INITIAL_VALUES: Project[] = [
  {
    name: 'unsaved',
    description: '',
    selected: true,
    createdAt: new Date().toISOString(),
  },
]

export const updateForeignKey =
  (project: Project) =>
  (name: string) =>
  (widgets: Note[] | Board[] | Schedule[]) =>
    widgets.map((widget) => ({
      ...widget,
      project: widget.project === project.name ? name : widget.project,
    }))

export const add: ProjectsEndomorphism = concat(
  __,
  INITIAL_VALUES.map((project) => ({ ...project, selected: false }))
)

export const save =
  (previousName: string) =>
  (currentName: string): ProjectsEndomorphism =>
    map(
      when(
        (project) => project.name === previousName,
        set(lensProp('name'), currentName)
      )
    )

export const select = (name: string): ProjectsEndomorphism =>
  map(
    flow(
      set(lensProp('selected'), false),
      when(flow(prop('name'), equals(name)), set(lensProp('selected'), true))
    )
  )
