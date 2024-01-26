export interface Issue {
  id: string
  title: string
  content: string
}

export type UpsertedIssue = Omit<Issue, 'id'> & { id?: string }

export type UpsertIssueDialogMode =
  | 'insert'
  | 'update'
  | 'insert_above'
  | 'insert_below'
