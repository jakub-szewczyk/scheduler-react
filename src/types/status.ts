import { Issue, UpsertedIssue } from './issue'

export interface Status {
  id: string
  title: string
  issues: Issue[]
}

export type UpsertedStatus = Omit<Status, 'id' | 'issues'> & {
  id?: string
  issues: UpsertedIssue[]
}

export type UpsertStatusDialogMode =
  | 'insert'
  | 'update'
  | 'insert_before'
  | 'insert_after'
