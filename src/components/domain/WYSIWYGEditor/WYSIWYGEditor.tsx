import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup } from '@/components/ui/toggle-group'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/modules/common'
import { deserialize, serialize } from '@/modules/note'
import { getNote, updateContent } from '@/services/note'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { DraftHandleValue, Editor, EditorState, RichUtils } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { identity } from 'lodash/fp'
import { LoaderCircle, Save, SpellCheck } from 'lucide-react'
import { useState } from 'react'
import WYSIWYGEditorToggleGroupItem from './WYSIWYGEditorToggleGroupItem/WYSIWYGEditorToggleGroupItem'

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

  const { data: editorState, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      getNote({ projectId: params.projectId, noteId: params.noteId }).then(
        (note) => deserialize(note.content)
      ),
    placeholderData: EditorState.createEmpty(),
    gcTime: Infinity,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
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

  const text = editorState?.getCurrentContent().getPlainText()
  const words = text?.trim().split(/\s+/).filter(identity)

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
          value={editorState?.getCurrentInlineStyle().toArray()}
        >
          <WYSIWYGEditorToggleGroupItem type='inline' value='BOLD' />
          <WYSIWYGEditorToggleGroupItem type='inline' value='ITALIC' />
          <WYSIWYGEditorToggleGroupItem type='inline' value='UNDERLINE' />
          <WYSIWYGEditorToggleGroupItem type='inline' value='STRIKETHROUGH' />
          <WYSIWYGEditorToggleGroupItem type='inline' value='CODE' />
        </ToggleGroup>
        <ToggleGroup
          className='!mt-0'
          type='single'
          size='sm'
          variant='outline'
          value={editorState
            ?.getCurrentContent()
            .getBlockForKey(editorState?.getSelection().getStartKey())
            .getType()}
        >
          <WYSIWYGEditorToggleGroupItem
            type='block'
            value='ordered-list-item'
          />
          <WYSIWYGEditorToggleGroupItem
            type='block'
            value='unordered-list-item'
          />
          <WYSIWYGEditorToggleGroupItem type='block' value='blockquote' />
          <WYSIWYGEditorToggleGroupItem type='block' value='code-block' />
        </ToggleGroup>
        <ToggleGroup
          className='!mt-0'
          type='single'
          size='sm'
          variant='outline'
          value={editorState
            ?.getCurrentContent()
            .getBlockForKey(editorState?.getSelection().getStartKey())
            .getType()}
        >
          <WYSIWYGEditorToggleGroupItem type='block' value='unstyled' />
          <WYSIWYGEditorToggleGroupItem type='block' value='header-one' />
          <WYSIWYGEditorToggleGroupItem type='block' value='header-two' />
          <WYSIWYGEditorToggleGroupItem type='block' value='header-three' />
          <WYSIWYGEditorToggleGroupItem type='block' value='header-four' />
          <WYSIWYGEditorToggleGroupItem type='block' value='header-five' />
          <WYSIWYGEditorToggleGroupItem type='block' value='header-six' />
        </ToggleGroup>
        <Button
          className='ml-auto gap-x-2'
          variant='secondary'
          disabled={isFetching || updateContentMutation.isPending}
          onClick={() =>
            updateContentMutation.mutate({
              projectId: params.projectId,
              noteId: params.noteId,
              editorState: serialize(editorState!),
            })
          }
        >
          Save changes
          {isFetching || updateContentMutation.isPending ? (
            <LoaderCircle className='size-4 animate-spin' />
          ) : (
            <Save className='size-4' />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'cursor-text rounded-lg border border-input text-sm [&:has(:focus-visible)]:outline-none [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-ring [&:has(:focus-visible)]:ring-offset-2 [&:has(:focus-visible)]:dark:ring-offset-0 [&_.public-DraftEditor-content]:min-h-[600px] [&_.public-DraftEditor-content]:px-3 [&_.public-DraftEditor-content]:py-2 [&_.public-DraftEditor-content_blockquote]:my-4 [&_.public-DraftEditor-content_blockquote]:border-l-4 [&_.public-DraftEditor-content_blockquote]:border-l-accent-foreground [&_.public-DraftEditor-content_blockquote]:bg-secondary [&_.public-DraftEditor-content_blockquote]:px-3 [&_.public-DraftEditor-content_blockquote]:py-2 [&_.public-DraftEditorPlaceholder-root]:left-3 [&_.public-DraftEditorPlaceholder-root]:top-2 [&_.public-DraftEditorPlaceholder-root]:hidden [&_.public-DraftEditorPlaceholder-root]:text-muted-foreground [&_h1]:text-4xl [&_h1]:font-extrabold [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:text-2xl [&_h3]:font-semibold [&_h4]:text-xl [&_h4]:font-semibold [&_h5]:text-lg [&_h5]:font-semibold [&_h6]:text-base [&_h6]:font-semibold',
            (editorState?.getCurrentContent().hasText() ||
              editorState
                ?.getCurrentContent()
                .getBlockMap()
                .first()
                .getType() === 'unstyled') &&
              '[&_.public-DraftEditorPlaceholder-root]:block'
          )}
        >
          <Editor
            editorState={editorState!}
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
        <div>{words?.length} words</div>
        <Separator className='h-5' orientation='vertical' />
        <div>{text?.length} characters</div>
      </CardFooter>
    </Card>
  )
}

export default WYSIWYGEditor
