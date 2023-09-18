export interface Issue {
  id: string
  title: string
  content: string
}

export type UpsertedIssue = Omit<Issue, 'id'> & { id?: string }

export type UpsertIssueDialogMode =
  | 'CREATE'
  | 'EDIT'
  | 'INSERT_ABOVE'
  | 'INSERT_BELOW'
