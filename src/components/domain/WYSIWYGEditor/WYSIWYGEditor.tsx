import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/modules/common'
import { deserialize, serialize } from '@/modules/note'
import { getNote, updateContent } from '@/services/note'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
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
  LoaderCircle,
  Minus,
  Quote,
  Save,
  SpellCheck,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { useState } from 'react'

const WYSIWYGEditor = () => {
  const [spellCheck, setSpellCheck] = useState(true)

  const params = useParams({
    from: '/projects/$projectId/notes/$noteId/editor',
  })

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const queryKey = [
    'projects',
    params.projectId,
    'notes',
    params.noteId,
    'content',
  ]

  // TODO:
  // Refactor.
  // Disable refetch on window focus.
  const { data: editorState } = useQuery({
    queryKey,
    queryFn: () =>
      getNote({ projectId: params.projectId, noteId: params.noteId }).then(
        (note) => deserialize(note.content)
      ),
    initialData: EditorState.createEmpty(),
  })

  const updateContentMutation = useMutation({
    mutationFn: updateContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast({
        title: "Note's content updated",
        description: 'Changes have been successfully saved',
      })
    },
  })

  const handleKeyCommand = (
    command: string,
    editorState: EditorState
  ): DraftHandleValue => {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command)
    if (newEditorState) {
      queryClient.setQueryData<EditorState>(queryKey, () => newEditorState)
      return 'handled'
    }
    return 'not-handled'
  }

  const text = editorState.getCurrentContent().getPlainText()
  const words = text.trim().split(/\s+/).filter(identity)

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
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleInlineStyle(editorState!, 'BOLD')
              )
            }}
          >
            <Bold className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='ITALIC'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleInlineStyle(editorState!, 'ITALIC')
              )
            }}
          >
            <Italic className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='UNDERLINE'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleInlineStyle(editorState!, 'UNDERLINE')
              )
            }}
          >
            <Underline className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='STRIKETHROUGH'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleInlineStyle(editorState!, 'STRIKETHROUGH')
              )
            }}
          >
            <Strikethrough className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='CODE'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleInlineStyle(editorState!, 'CODE')
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
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleBlockType(editorState!, 'ordered-list-item')
              )
            }}
          >
            <ListOrdered className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='unordered-list-item'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleBlockType(editorState!, 'unordered-list-item')
              )
            }}
          >
            <List className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='blockquote'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleBlockType(editorState!, 'blockquote')
              )
            }}
          >
            <Quote className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='code-block'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleBlockType(editorState!, 'code-block')
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
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleBlockType(editorState!, 'unstyled')
              )
            }}
          >
            <Minus className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-one'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleBlockType(editorState!, 'header-one')
              )
            }}
          >
            <Heading1 className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-two'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleBlockType(editorState!, 'header-two')
              )
            }}
          >
            <Heading2 className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-three'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleBlockType(editorState!, 'header-three')
              )
            }}
          >
            <Heading3 className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-four'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleBlockType(editorState!, 'header-four')
              )
            }}
          >
            <Heading4 className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-five'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleBlockType(editorState!, 'header-five')
              )
            }}
          >
            <Heading5 className='size-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='header-six'
            onMouseDown={(event) => {
              event.preventDefault()
              queryClient.setQueryData<EditorState>(queryKey, (editorState) =>
                RichUtils.toggleBlockType(editorState!, 'header-six')
              )
            }}
          >
            <Heading6 className='size-4' />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button
          className='ml-auto gap-x-2'
          variant='secondary'
          disabled={updateContentMutation.isPending}
          onClick={() =>
            updateContentMutation.mutate({
              projectId: params.projectId,
              noteId: params.noteId,
              editorState: serialize(editorState),
            })
          }
        >
          Save changes
          {updateContentMutation.isPending ? (
            <LoaderCircle className='size-4 animate-spin' />
          ) : (
            <Save className='size-4' />
          )}
        </Button>
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
            onChange={(editorState) =>
              queryClient.setQueryData<EditorState>(queryKey, editorState)
            }
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
