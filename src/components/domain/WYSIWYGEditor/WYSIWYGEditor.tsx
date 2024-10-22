import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/modules/common'
import { DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { identity } from 'lodash/fp'
import {
  Bold,
  Braces,
  CloudUpload,
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
  SpellCheck,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { useState } from 'react'

const WYSIWYGEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  )
  const [spellCheck, setSpellCheck] = useState(true)

  const text = editorState.getCurrentContent().getPlainText()
  const words = text.trim().split(/\s+/).filter(identity)

  const handleKeyCommand = (
    command: string,
    editorState: EditorState
  ): DraftHandleValue => {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command)
    if (newEditorState) {
      setEditorState(newEditorState)
      return 'handled'
    }
    return 'not-handled'
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center gap-x-10 overflow-y-auto'>
        <Toggle
          size='sm'
          variant='outline'
          pressed={spellCheck}
          onMouseDown={(event) => {
            event.preventDefault()
            setSpellCheck((spellCheck) => !spellCheck)
          }}
        >
          <SpellCheck className='size-4' />
        </Toggle>
        <ToggleGroup
          className='!mt-0'
          type='multiple'
          size='sm'
          variant='outline'
          value={editorState.getCurrentInlineStyle().toArray()}
        >
          <ToggleGroupItem
            value='BOLD'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleInlineStyle(editorState, 'BOLD')
              )
            }}
          >
            <Bold className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='ITALIC'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleInlineStyle(editorState, 'ITALIC')
              )
            }}
          >
            <Italic className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='UNDERLINE'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleInlineStyle(editorState, 'UNDERLINE')
              )
            }}
          >
            <Underline className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='STRIKETHROUGH'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleInlineStyle(editorState, 'STRIKETHROUGH')
              )
            }}
          >
            <Strikethrough className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='CODE'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleInlineStyle(editorState, 'CODE')
              )
            }}
          >
            <Code className='size-4' />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          className='!mt-0'
          type='single'
          size='sm'
          variant='outline'
          value={editorState
            .getCurrentContent()
            .getBlockForKey(editorState.getSelection().getStartKey())
            .getType()}
        >
          <ToggleGroupItem
            value='ordered-list-item'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleBlockType(editorState, 'ordered-list-item')
              )
            }}
          >
            <ListOrdered className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='unordered-list-item'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleBlockType(editorState, 'unordered-list-item')
              )
            }}
          >
            <List className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='blockquote'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleBlockType(editorState, 'blockquote')
              )
            }}
          >
            <Quote className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='code-block'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleBlockType(editorState, 'code-block')
              )
            }}
          >
            <Braces className='size-4' />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          className='!mt-0'
          type='single'
          size='sm'
          variant='outline'
          value={editorState
            .getCurrentContent()
            .getBlockForKey(editorState.getSelection().getStartKey())
            .getType()}
        >
          <ToggleGroupItem
            value='unstyled'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleBlockType(editorState, 'unstyled')
              )
            }}
          >
            <Minus className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-one'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleBlockType(editorState, 'header-one')
              )
            }}
          >
            <Heading1 className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-two'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleBlockType(editorState, 'header-two')
              )
            }}
          >
            <Heading2 className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-three'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleBlockType(editorState, 'header-three')
              )
            }}
          >
            <Heading3 className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-four'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleBlockType(editorState, 'header-four')
              )
            }}
          >
            <Heading4 className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-five'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleBlockType(editorState, 'header-five')
              )
            }}
          >
            <Heading5 className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-six'
            onMouseDown={(event) => {
              event.preventDefault()
              setEditorState((editorState) =>
                RichUtils.toggleBlockType(editorState, 'header-six')
              )
            }}
          >
            <Heading6 className='size-4' />
          </ToggleGroupItem>
        </ToggleGroup>
        {false && (
          <div className='ml-auto flex animate-pulse items-center gap-x-2 text-sm'>
            <CloudUpload className='size-4' />
            Syncing...
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'cursor-text rounded-lg border border-input text-sm [&:has(:focus-visible)]:outline-none [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-ring [&:has(:focus-visible)]:ring-offset-2 [&:has(:focus-visible)]:dark:ring-offset-0 [&_.public-DraftEditor-content]:min-h-[600px] [&_.public-DraftEditor-content]:px-3 [&_.public-DraftEditor-content]:py-2 [&_.public-DraftEditor-content_blockquote]:my-4 [&_.public-DraftEditor-content_blockquote]:border-l-4 [&_.public-DraftEditor-content_blockquote]:border-l-accent-foreground [&_.public-DraftEditor-content_blockquote]:bg-secondary [&_.public-DraftEditor-content_blockquote]:px-3 [&_.public-DraftEditor-content_blockquote]:py-2 [&_.public-DraftEditorPlaceholder-root]:left-3 [&_.public-DraftEditorPlaceholder-root]:top-2 [&_.public-DraftEditorPlaceholder-root]:hidden [&_.public-DraftEditorPlaceholder-root]:text-muted-foreground [&_h1]:text-4xl [&_h1]:font-extrabold [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:text-2xl [&_h3]:font-semibold [&_h4]:text-xl [&_h4]:font-semibold [&_h5]:text-lg [&_h5]:font-semibold [&_h6]:text-base [&_h6]:font-semibold',
            (editorState.getCurrentContent().hasText() ||
              editorState
                .getCurrentContent()
                .getBlockMap()
                .first()
                .getType() === 'unstyled') &&
              '[&_.public-DraftEditorPlaceholder-root]:block'
          )}
        >
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            spellCheck={spellCheck}
            placeholder='Enter your note here...'
            handleKeyCommand={handleKeyCommand}
          />
        </div>
      </CardContent>
      <CardFooter className='justify-end gap-x-2 text-sm text-muted-foreground'>
        <div>{words.length} words</div>
        <Separator className='h-5' orientation='vertical' />
        <div>{text.length} characters</div>
      </CardFooter>
    </Card>
  )
}

export default WYSIWYGEditor
