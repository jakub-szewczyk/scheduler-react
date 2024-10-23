import { ToggleGroupItem } from '@/components/ui/toggle-group'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { DraftInlineStyleType, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import {
  Bold,
  Braces,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { ReactNode } from 'react'

const ICONS: {
  [key in WYSIWYGEditorToggleGroupItemProps['value']]: ReactNode
} = {
  BOLD: <Bold className='size-4' />,
  ITALIC: <Italic className='size-4' />,
  UNDERLINE: <Underline className='size-4' />,
  STRIKETHROUGH: <Strikethrough className='size-4' />,
  CODE: <Code className='size-4' />,
  'ordered-list-item': <ListOrdered className='size-4' />,
  'unordered-list-item': <List className='size-4' />,
  blockquote: <Quote className='size-4' />,
  'code-block': <Braces className='size-4' />,
  unstyled: <Minus className='size-4' />,
  'header-one': <Heading1 className='size-4' />,
  'header-two': <Heading2 className='size-4' />,
  'header-three': <Heading3 className='size-4' />,
  'header-four': <Heading4 className='size-4' />,
  'header-five': <Heading5 className='size-4' />,
  'header-six': <Heading6 className='size-4' />,
}

type WYSIWYGEditorToggleGroupItemProps =
  | {
      type: 'inline'
      value: DraftInlineStyleType
    }
  | {
      type: 'block'
      value:
        | 'ordered-list-item'
        | 'unordered-list-item'
        | 'blockquote'
        | 'code-block'
        | 'unstyled'
        | 'header-one'
        | 'header-two'
        | 'header-three'
        | 'header-four'
        | 'header-five'
        | 'header-six'
    }

const WYSIWYGEditorToggleGroupItem = (
  props: WYSIWYGEditorToggleGroupItemProps
) => {
  const params = useParams({
    from: '/projects/$projectId/notes/$noteId/editor',
  })

  const queryClient = useQueryClient()

  return (
    <ToggleGroupItem
      value={props.value}
      onMouseDown={(event) => {
        event.preventDefault()
        queryClient.setQueryData<EditorState>(
          ['projects', params.projectId, 'notes', params.noteId, 'content'],
          (editorState) =>
            props.type === 'inline'
              ? RichUtils.toggleInlineStyle(editorState!, props.value)
              : RichUtils.toggleBlockType(editorState!, props.value)
        )
      }}
    >
      {ICONS[props.value]}
    </ToggleGroupItem>
  )
}

export default WYSIWYGEditorToggleGroupItem
