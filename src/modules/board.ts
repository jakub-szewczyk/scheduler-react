import { Board, DropResultLocation, Status } from '@/types/board'
import { Issue } from '@/types/issue'
import { prop } from 'fp-ts-ramda'
import { flow, pipe } from 'fp-ts/lib/function'
import produce from 'immer'
import {
  __,
  any,
  complement,
  concat,
  curry,
  equals,
  filter,
  findIndex,
  join,
  last,
  lensProp,
  map,
  move,
  set,
  remove as _remove,
  slice,
  split,
  tail,
  unless,
  when,
  find,
} from 'ramda'
import { DraggableLocation } from 'react-beautiful-dnd'

type BoardsEndomorphism = (boards: Board[]) => Board[]

const INITIAL_VALUES: Status[] = [
  {
    title: 'todo',
    issues: [
      {
        title: 'Adjust column titles',
        content:
          'To rename a status, simply click on the three dots icon next to the status title. This will open the configuration menu, where you can find the option to rename it.',
      },
      {
        title: 'Create your own issues',
        content:
          'Click on the floating action button in the bottom-right corner of the screen to add more issues',
      },
      {
        title: 'Get familiar with the kanban board',
        content:
          'Get to know the kanban board. Customize statuses and issues to fit your needs.',
      },
    ],
  },
  {
    title: 'on hold',
    issues: [],
  },
  {
    title: 'inprogress',
    issues: [],
  },
  {
    title: 'done',
    issues: [],
  },
]

const INITIAL_BOARDS: Board[] = [
  {
    name: 'unsaved',
    selected: true,
    createdAt: new Date().toISOString(),
    statuses: INITIAL_VALUES,
  },
]

const matchByDraggableLocation = curry(
  ({ droppableId }: DraggableLocation, { title }: Status) =>
    pipe(droppableId, split('-'), tail, join('-'), equals(title))
)

const dragStatus = ({ source, destination }: DropResultLocation) =>
  move(source.index, destination.index)

const dragIssueWithinStatus = ({ source, destination }: DropResultLocation) =>
  produce((statuses: Status[]) => {
    const status = statuses.find(matchByDraggableLocation(source))!
    status.issues = move(source.index, destination.index, status.issues)
  })

const dragIssueBetweenStatuses = ({
  source,
  destination,
}: DropResultLocation) =>
  produce((statuses: Status[]) => {
    const sourceStatus = statuses.find(matchByDraggableLocation(source))!
    const destinationStatus = statuses.find(
      matchByDraggableLocation(destination)
    )!
    const [sourceIssue] = sourceStatus.issues.splice(source.index, 1)
    destinationStatus.issues.splice(destination.index, 0, sourceIssue)
  })

const drag = ({ source, destination }: DropResultLocation) =>
  source.droppableId === 'board' && destination.droppableId === 'board'
    ? dragStatus({ source, destination })
    : source.droppableId === destination.droppableId
    ? dragIssueWithinStatus({ source, destination })
    : dragIssueBetweenStatuses({ source, destination })

const findSelected = find<Board>(prop('selected'))

const add: BoardsEndomorphism = flow(
  map(set(lensProp('selected'), false)),
  concat(__, INITIAL_BOARDS)
)

const remove = (name: string): BoardsEndomorphism =>
  flow(
    filter(flow(prop('name'), complement(equals(name)))),
    unless(any(prop('selected')), (boards: any[]) =>
      pipe(
        boards,
        slice(0, -1) as (x: any[]) => any[],
        concat(__, [set(lensProp('selected'), true, last(boards))])
      )
    )
  )

const save = (name: string): BoardsEndomorphism =>
  map(when(prop('selected'), set(lensProp('name'), name)))

const select = (name: string): BoardsEndomorphism =>
  map(
    flow(
      set(lensProp('selected'), false),
      when(flow(prop('name'), equals(name)), set(lensProp('selected'), true))
    )
  )

const createStatus = (title: string) =>
  produce(
    (statuses: Status[]) =>
      void statuses.unshift({
        title: title.trim().toLowerCase(),
        issues: [],
      })
  )

const editStatus = (previousTitle: string, currentTitle: string) =>
  produce((statuses: Status[]) => {
    const status = statuses.find((status) => status.title === previousTitle)!
    status.title = currentTitle.trim().toLowerCase()
  })

const deleteStatus = (title: string) => (statuses: Status[]) =>
  _remove(
    findIndex((status) => status.title === title, statuses),
    1,
    statuses
  )

const insertStatusBefore = (statusAfterTitle: string, title: string) =>
  produce((statuses: Status[]) => {
    const statusAfterIndex = statuses.findIndex(
      (status) => status.title === statusAfterTitle
    )!
    statuses.splice(statusAfterIndex, 0, {
      title: title.trim().toLowerCase(),
      issues: [],
    })
  })

const insertStatusAfter = (statusAfterBefore: string, title: string) =>
  produce((statuses: Status[]) => {
    const statusBeforeIndex = statuses.findIndex(
      (status) => status.title === statusAfterBefore
    )!
    statuses.splice(statusBeforeIndex + 1, 0, {
      title: title.trim().toLowerCase(),
      issues: [],
    })
  })

const createIssue = (values: Issue) =>
  produce(
    (statuses: Status[]) =>
      void statuses[0].issues.unshift({
        title: values.title.trim(),
        content: values.content.trim(),
      })
  )

const editIssue = (title: string, values: Issue) =>
  produce((statuses: Status[]) => {
    const issue = statuses
      .flatMap((status) => status.issues)
      .find((issue) => issue.title === title)!
    issue.title = values.title.trim()
    issue.content = values.content.trim()
  })

const deleteIssue = (title: string) =>
  produce((statuses: Status[]) => {
    const status = statuses.find((status) =>
      status.issues.some((issue) => issue.title === title)
    )!
    const issueIndex = status.issues.findIndex((issue) => issue.title === title)
    status.issues.splice(issueIndex, 1)
  })

const insertIssueAbove = (title: string, values: Issue) =>
  produce((statuses: Status[]) => {
    const status = statuses.find((status) =>
      status.issues.some((issue) => issue.title === title)
    )!
    const issueIndex = status.issues.findIndex((issue) => issue.title === title)
    status.issues.splice(issueIndex, 0, {
      title: values.title.trim(),
      content: values.content.trim(),
    })
  })

const insertIssueBelow = (title: string, values: Issue) =>
  produce((statuses: Status[]) => {
    const status = statuses.find((status) =>
      status.issues.some((issue) => issue.title === title)
    )!
    const issueIndex = status.issues.findIndex((issue) => issue.title === title)
    status.issues.splice(issueIndex + 1, 0, {
      title: values.title.trim(),
      content: values.content.trim(),
    })
  })

export {
  INITIAL_BOARDS,
  INITIAL_VALUES,
  drag,
  findSelected,
  add,
  remove,
  save,
  select,
  createStatus,
  editStatus,
  deleteStatus,
  insertStatusBefore,
  insertStatusAfter,
  createIssue,
  editIssue,
  deleteIssue,
  insertIssueAbove,
  insertIssueBelow,
}
