interface Issue {
  title: string
  content: string
}

type UpsertIssueDialogMode = 'CREATE' | 'EDIT' | 'INSERT_ABOVE' | 'INSERT_BELOW'

export type { Issue, UpsertIssueDialogMode }
