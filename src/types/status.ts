import { Issue } from './issue'

export interface Status {
  title: string
  issues: Issue[]
}

export type UpsertStatusDialogMode =
  | 'CREATE'
  | 'EDIT'
  | 'INSERT_BEFORE'
  | 'INSERT_AFTER'
