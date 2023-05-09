import { Board } from '@/types/board'
import { Note } from '@/types/note'
import { Project, ProjectsEndomorphism } from '@/types/project'
import { Schedule } from '@/types/schedule'
import { flow } from 'fp-ts/lib/function'
import produce from 'immer'
import {
  __,
  concat,
  equals,
  filter,
  lensProp,
  map,
  prop,
  set,
  when,
} from 'ramda'

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

export const remove = (name: string) =>
  produce((projects: Project[]) => {
    const projectIndex = projects.findIndex((project) => project.name === name)
    const [removedProject] = projects.splice(projectIndex, 1)
    if (removedProject.selected) projects[projects.length - 1].selected = true
  })

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
  (widget: Note | Board | Schedule) => ({
    ...widget,
    project: widget.project === project.name ? name : widget.project,
  })

export const cascadeDelete =
  (name: string) => (widgets: Note[] | Board[] | Schedule[]) =>
    filter(
      (widget: Note | Board | Schedule) => widget.project !== name,
      widgets
    )
