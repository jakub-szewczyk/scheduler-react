import { Issue } from '@/types/issue'
import { Status } from '@/types/status'
import produce from 'immer'

export const create = (values: Issue) =>
  produce(
    (statuses: Status[]) =>
      void statuses[0].issues.unshift({
        title: values.title.trim(),
        content: values.content.trim(),
      })
  )

export const edit = (title: string, values: Issue) =>
  produce((statuses: Status[]) => {
    const issue = statuses
      .flatMap((status) => status.issues)
      .find((issue) => issue.title === title)!
    issue.title = values.title.trim()
    issue.content = values.content.trim()
  })

export const remove = (title: string) =>
  produce((statuses: Status[]) => {
    const status = statuses.find((status) =>
      status.issues.some((issue) => issue.title === title)
    )!
    const issueIndex = status.issues.findIndex((issue) => issue.title === title)
    status.issues.splice(issueIndex, 1)
  })

export const insertAbove = (title: string, values: Issue) =>
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

export const insertBelow = (title: string, values: Issue) =>
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
