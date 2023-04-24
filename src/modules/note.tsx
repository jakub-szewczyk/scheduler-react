import * as NOTE from '@/modules/note'
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
} from 'draft-js'
import produce from 'immer'
import { ReactNode, SetStateAction } from 'react'
// @ts-ignore
import html2pdf from 'html2pdf.js'

const INITIAL_VALUES: Note[] = [
  {
    name: 'unsaved',
    selected: true,
    createdAt: new Date().toISOString(),
    editorState: EditorState.createEmpty(),
  },
]

const initialState = () =>
  localStorage.getItem('notes')
    ? JSON.parse(localStorage.getItem('notes')!).map((note: Note) => ({
        ...note,
        editorState: EditorState.createWithContent(
          convertFromRaw(note.editorState as RawDraftContentState)
        ),
      }))
    : NOTE.INITIAL_VALUES

const updatedState = (value: SetStateAction<EditorState>) =>
  produce((notes: Note[]) => {
    const note = notes.find((note) => note.selected)!
    note.editorState =
      typeof value === 'function'
        ? value(note.editorState as EditorState)
        : value
  })

const toInlineStyleIcon: { [key in DraftInlineStyleType]: ReactNode } = {
  BOLD: <FormatBoldIcon fontSize='small' />,
  ITALIC: <FormatItalicIcon fontSize='small' />,
  UNDERLINE: <FormatUnderlinedIcon fontSize='small' />,
  STRIKETHROUGH: <StrikethroughSIcon fontSize='small' />,
  CODE: <CodeIcon fontSize='small' />,
}

const toBlockStyleIcon: { [key in DraftBlockStyleType]: ReactNode } = {
  unstyled: <Typography fontSize='small'>Paragraph</Typography>,
  'header-one': <Typography fontSize='small'>Headline 1</Typography>,
  'header-two': <Typography fontSize='small'>Headline 2</Typography>,
  'header-three': <Typography fontSize='small'>Headline 3</Typography>,
  'header-four': <Typography fontSize='small'>Headline 4</Typography>,
  'header-five': <Typography fontSize='small'>Headline 5</Typography>,
  'header-six': <Typography fontSize='small'>Headline 6</Typography>,
  'unordered-list-item': <FormatListBulletedIcon fontSize='small' />,
  'ordered-list-item': <FormatListNumberedIcon fontSize='small' />,
  blockquote: <FormatQuoteIcon fontSize='small' />,
  'code-block': <DataObjectIcon fontSize='small' />,
}

const blockStyle = (editorState: EditorState) =>
  editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey())
    .getType() as DraftBlockStyleType

const isPlaceholderVisible = (editorState: EditorState) =>
  editorState.getCurrentContent().hasText() ||
  editorState.getCurrentContent().getBlockMap().first().getType() === 'unstyled'

const exportToPDF = (editor: Editor, filename?: string) => {
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

export {
  INITIAL_VALUES,
  initialState,
  updatedState,
  toInlineStyleIcon,
  toBlockStyleIcon,
  blockStyle,
  isPlaceholderVisible,
  exportToPDF,
}
