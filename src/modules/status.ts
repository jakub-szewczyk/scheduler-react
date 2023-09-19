import { DropResultLocation } from '@/types/board'
import { Status, UpsertedStatus } from '@/types/status'
import produce from 'immer'
import { remove as _remove, curry, findIndex, move } from 'ramda'
import { DraggableLocation } from 'react-beautiful-dnd'

export const create = (title: string) =>
  produce(
    (statuses: UpsertedStatus[]) =>
      void statuses.unshift({
        title: title.trim().toLowerCase(),
        issues: [],
      })
  )

export const update = (statusId: string, title: string) =>
  produce((statuses: Status[]) => {
    const status = statuses.find((status) => status.id === statusId)!
    status.title = title.trim().toLowerCase()
  })

export const remove = (statusId: string) => (statuses: UpsertedStatus[]) =>
  _remove(
    findIndex((status) => status.id === statusId, statuses),
    1,
    statuses
  )

export const insertBefore = (statusAfterId: string, title: string) =>
  produce((statuses: UpsertedStatus[]) => {
    const statusAfterIndex = statuses.findIndex(
      (status) => status.id === statusAfterId
    )!
    statuses.splice(statusAfterIndex, 0, {
      title: title.trim().toLowerCase(),
      issues: [],
    })
  })

export const insertAfter = (statusBeforeId: string, title: string) =>
  produce((statuses: UpsertedStatus[]) => {
    const statusBeforeIndex = statuses.findIndex(
      (status) => status.id === statusBeforeId
    )!
    statuses.splice(statusBeforeIndex + 1, 0, {
      title: title.trim().toLowerCase(),
      issues: [],
    })
  })

const matchByDraggableLocation = curry(
  ({ droppableId }: DraggableLocation, { id }: Status) => droppableId === id
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
