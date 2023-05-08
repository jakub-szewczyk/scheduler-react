import { Board } from '@/types/board'
import { Note } from '@/types/note'
import { Project, ProjectsEndomorphism } from '@/types/project'
import { Schedule } from '@/types/schedule'
import { flow } from 'fp-ts/lib/function'
import { __, concat, equals, lensProp, map, prop, set, when } from 'ramda'

export const initialValues = (): Project[] => [
  {
    name: 'unsaved',
    description: '',
    selected: true,
    createdAt: new Date().toISOString(),
  },
]

export const create: ProjectsEndomorphism = concat(
  __,
  initialValues().map((project) => ({ ...project, selected: false }))
)

export const select = (name: string): ProjectsEndomorphism =>
  map(
    flow(
      set(lensProp('selected'), false),
      when(flow(prop('name'), equals(name)), set(lensProp('selected'), true))
    )
  )

export const save =
  (previousName: string) =>
  (currentName: string): ProjectsEndomorphism =>
    map(
      when(
        flow(prop('name'), equals(previousName)),
        set(lensProp('name'), currentName)
      )
    )

export const updateForeignKey =
  (project: Project) =>
  (name: string) =>
  (widgets: Note[] | Board[] | Schedule[]) =>
    widgets.map((widget) => ({
      ...widget,
      project: widget.project === project.name ? name : widget.project,
    }))
