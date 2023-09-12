import { Issue } from './issue'

export interface Status {
  id: string
  title: string
  issues: Issue[]
}

export type UpsertStatusDialogMode =
  | 'CREATE'
  | 'EDIT'
  | 'INSERT_BEFORE'
  | 'INSERT_AFTER'
