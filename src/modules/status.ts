import { Status } from '@/types/board'
import produce from 'immer'
import { remove as _remove, findIndex } from 'ramda'

const create = (title: string) =>
  produce(
    (statuses: Status[]) =>
      void statuses.unshift({
        title: title.trim().toLowerCase(),
        issues: [],
      })
  )

const edit = (previousTitle: string, currentTitle: string) =>
  produce((statuses: Status[]) => {
    const status = statuses.find((status) => status.title === previousTitle)!
    status.title = currentTitle.trim().toLowerCase()
  })

const remove = (title: string) => (statuses: Status[]) =>
  _remove(
    findIndex((status) => status.title === title, statuses),
    1,
    statuses
  )

const insertBefore = (statusAfterTitle: string, title: string) =>
  produce((statuses: Status[]) => {
    const statusAfterIndex = statuses.findIndex(
      (status) => status.title === statusAfterTitle
    )!
    statuses.splice(statusAfterIndex, 0, {
      title: title.trim().toLowerCase(),
      issues: [],
    })
  })

const insertAfter = (statusAfterBefore: string, title: string) =>
  produce((statuses: Status[]) => {
    const statusBeforeIndex = statuses.findIndex(
      (status) => status.title === statusAfterBefore
    )!
    statuses.splice(statusBeforeIndex + 1, 0, {
      title: title.trim().toLowerCase(),
      issues: [],
    })
  })

export { create, edit, remove, insertBefore, insertAfter }
