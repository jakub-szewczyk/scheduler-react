export interface Issue {
  title: string
  content: string
}

export type UpsertIssueDialogMode =
  | 'CREATE'
  | 'EDIT'
  | 'INSERT_ABOVE'
  | 'INSERT_BELOW'
