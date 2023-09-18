import { UpsertedIssue } from '@/types/issue'
import { UpsertedStatus } from '@/types/status'
import produce from 'immer'

export const create = (values: UpsertedIssue) =>
  produce(
    (statuses: UpsertedStatus[]) =>
      void statuses[0].issues.unshift({
        title: values.title.trim(),
        content: values.content.trim(),
      })
  )

export const update = (issueId: string, values: UpsertedIssue) =>
  produce((statuses: UpsertedStatus[]) => {
    const issue = statuses
      .flatMap((status) => status.issues)
      .find((issue) => issue.id === issueId)!
    issue.title = values.title.trim()
    issue.content = values.content.trim()
  })

export const remove = (issueId: string) =>
  produce((statuses: UpsertedStatus[]) => {
    const status = statuses.find((status) =>
      status.issues.some((issue) => issue.id === issueId)
    )!
    const issueIndex = status.issues.findIndex((issue) => issue.id === issueId)
    status.issues.splice(issueIndex, 1)
  })

export const insertAbove = (issueId: string, values: UpsertedIssue) =>
  produce((statuses: UpsertedStatus[]) => {
    const status = statuses.find((status) =>
      status.issues.some((issue) => issue.id === issueId)
    )!
    const issueIndex = status.issues.findIndex((issue) => issue.id === issueId)
    status.issues.splice(issueIndex, 0, {
      title: values.title.trim(),
      content: values.content.trim(),
    })
  })

export const insertBelow = (issueId: string, values: UpsertedIssue) =>
  produce((statuses: UpsertedStatus[]) => {
    const status = statuses.find((status) =>
      status.issues.some((issue) => issue.id === issueId)
    )!
    const issueIndex = status.issues.findIndex((issue) => issue.id === issueId)
    status.issues.splice(issueIndex + 1, 0, {
      title: values.title.trim(),
      content: values.content.trim(),
    })
  })
