import { Issue } from './issue'

interface Status {
  title: string
  issues: Issue[]
}

type UpsertStatusDialogMode =
  | 'CREATE'
  | 'EDIT'
  | 'INSERT_BEFORE'
  | 'INSERT_AFTER'

export type { Status, Issue, UpsertStatusDialogMode }
