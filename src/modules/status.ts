import { DropResultLocation } from '@/types/board'
import { Status } from '@/types/status'
import { pipe } from 'fp-ts/lib/function'
import produce from 'immer'
import {
  remove as _remove,
  curry,
  equals,
  findIndex,
  join,
  move,
  split,
  tail,
} from 'ramda'
import { DraggableLocation } from 'react-beautiful-dnd'

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

export const drag = ({ source, destination }: DropResultLocation) =>
  source.droppableId === 'board' && destination.droppableId === 'board'
    ? dragStatus({ source, destination })
    : source.droppableId === destination.droppableId
    ? dragIssueWithinStatus({ source, destination })
    : dragIssueBetweenStatuses({ source, destination })

export const create = (title: string) =>
  produce(
    (statuses: Status[]) =>
      void statuses.unshift({
        title: title.trim().toLowerCase(),
        issues: [],
      })
  )

export const update = (previousTitle: string, currentTitle: string) =>
  produce((statuses: Status[]) => {
    const status = statuses.find((status) => status.title === previousTitle)!
    status.title = currentTitle.trim().toLowerCase()
  })

export const remove = (title: string) => (statuses: Status[]) =>
  _remove(
    findIndex((status) => status.title === title, statuses),
    1,
    statuses
  )

export const insertBefore = (statusAfterTitle: string, title: string) =>
  produce((statuses: Status[]) => {
    const statusAfterIndex = statuses.findIndex(
      (status) => status.title === statusAfterTitle
    )!
    statuses.splice(statusAfterIndex, 0, {
      title: title.trim().toLowerCase(),
      issues: [],
    })
  })

export const insertAfter = (statusAfterBefore: string, title: string) =>
  produce((statuses: Status[]) => {
    const statusBeforeIndex = statuses.findIndex(
      (status) => status.title === statusAfterBefore
    )!
    statuses.splice(statusBeforeIndex + 1, 0, {
      title: title.trim().toLowerCase(),
      issues: [],
    })
  })
