import { DraftBlockStyleType } from '@/types/note'
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
import { ReactNode } from 'react'
// @ts-ignore
import html2pdf from 'html2pdf.js'
import { isEmpty, isNil, or } from 'ramda'

export const NOTES_PAGE_SIZE = 20

export const serialize = (editorState: EditorState) =>
  convertToRaw(editorState.getCurrentContent())

export const deserialize = (editorState: RawDraftContentState) =>
  or(isNil(editorState), isEmpty(editorState))
    ? EditorState.createEmpty()
    : EditorState.createWithContent(convertFromRaw(editorState))

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

export const isPlaceholderVisible = (editorState: EditorState) =>
  editorState.getCurrentContent().hasText() ||
  editorState.getCurrentContent().getBlockMap().first().getType() === 'unstyled'

export const blockStyle = (editorState: EditorState) =>
  editorState
    .getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey())
    .getType() as DraftBlockStyleType

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
