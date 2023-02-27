import { DraggableLocation } from 'react-beautiful-dnd'

interface Status {
  title: string
  issues: Issue[]
}

interface Issue {
  title: string
  content: string
}

type DropResultLocation = {
  source: DraggableLocation
  destination: DraggableLocation
}

type UpsertStatusDialogMode = 'EDIT' | 'INSERT_BEFORE' | 'INSERT_AFTER'

type UpsertIssueDialogMode = 'EDIT' | 'INSERT_ABOVE' | 'INSERT_BELOW'

export type {
  Status,
  Issue,
  DropResultLocation,
  UpsertStatusDialogMode,
  UpsertIssueDialogMode,
}
