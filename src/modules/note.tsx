import { DraftBlockStyleType, Note } from '@/types/note'
import CodeIcon from '@mui/icons-material/Code'
import DataObjectIcon from '@mui/icons-material/DataObject'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import { Typography } from '@mui/material'
import {
  DraftInlineStyleType,
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import produce from 'immer'
import { ReactNode } from 'react'
import { Project } from '@/types/project'
// @ts-ignore
import html2pdf from 'html2pdf.js'

export const initialValues = (): Note[] => [
  {
    name: 'unsaved',
    project: 'unsaved',
    selected: true,
    createdAt: new Date().toISOString(),
    editorState: EditorState.createEmpty(),
  },
]

export const serialize = (note: Note) => ({
  ...note,
  editorState: convertToRaw(
    (note.editorState as EditorState).getCurrentContent()
  ),
})

const deserialize = (note: Note) => ({
  ...note,
  editorState: EditorState.createWithContent(
    convertFromRaw(note.editorState as RawDraftContentState)
  ),
})

export const initialState = (): Note[] =>
  localStorage.getItem('notes')
    ? JSON.parse(localStorage.getItem('notes')!).map(deserialize)
    : initialValues()

export const calculateSubState = (editorState: EditorState, project: Project) =>
  produce((notes: Note[]) => {
    const note = notes.find(
      (note) => note.project === project.name && note.selected
    )!
    note.editorState = editorState
  })

export const add = (project: Project) =>
  produce((notes: Note[]) => {
    notes.forEach((notes) => {
      if (notes.project === project.name) notes.selected = false
    })
    notes.push({ ...initialValues()[0], project: project.name })
  })

export const remove = (project: Project, name: string) =>
  produce((notes: Note[]) => {
    const noteIndex = notes.findIndex(
      (notes) => notes.project === project.name && notes.name === name
    )
    const [removedNote] = notes.splice(noteIndex, 1)
    if (removedNote.selected) {
      const projectNotes = notes.filter((note) => note.project === project.name)
      projectNotes[projectNotes.length - 1].selected = true
    }
  })

export const save = (project: Project) => (name: string) =>
  produce((notes: Note[]) => {
    notes.forEach((note) => {
      if (note.project === project.name && note.selected) note.name = name
    })
  })

export const select = (project: Project, name: string) =>
  produce((notes: Note[]) => {
    notes.forEach((note) => {
      if (note.project === project.name) note.selected = note.name === name
    })
  })

export const toInlineStyleIcon: { [key in DraftInlineStyleType]: ReactNode } = {
  BOLD: <FormatBoldIcon fontSize='small' />,
  ITALIC: <FormatItalicIcon fontSize='small' />,
  UNDERLINE: <FormatUnderlinedIcon fontSize='small' />,
  STRIKETHROUGH: <StrikethroughSIcon fontSize='small' />,
  CODE: <CodeIcon fontSize='small' />,
}

export const toBlockStyleIcon: { [key in DraftBlockStyleType]: ReactNode } = {
  unstyled: <Typography fontSize='small'>Paragraph</Typography>,
  'header-one': <Typography fontSize='small'>Heading 1</Typography>,
  'header-two': <Typography fontSize='small'>Heading 2</Typography>,
  'header-three': <Typography fontSize='small'>Heading 3</Typography>,
  'header-four': <Typography fontSize='small'>Heading 4</Typography>,
  'header-five': <Typography fontSize='small'>Heading 5</Typography>,
  'header-six': <Typography fontSize='small'>Heading 6</Typography>,
  'unordered-list-item': <FormatListBulletedIcon fontSize='small' />,
  'ordered-list-item': <FormatListNumberedIcon fontSize='small' />,
  blockquote: <FormatQuoteIcon fontSize='small' />,
  'code-block': <DataObjectIcon fontSize='small' />,
}

export const blockStyle = (editorState: EditorState) =>
  editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey())
    .getType() as DraftBlockStyleType

export const isPlaceholderVisible = (editorState: EditorState) =>
  editorState.getCurrentContent().hasText() ||
  editorState.getCurrentContent().getBlockMap().first().getType() === 'unstyled'

export const exportToPDF = (editor: Editor, filename?: string) => {
  const html = editor.editorContainer?.cloneNode(true) as HTMLElement
  html.style.color = 'black'
  html2pdf()
    .set({
      margin: 16,
      pagebreak: { mode: ['avoid-all'] },
    })
    .from(html)
    .save(filename)
}
