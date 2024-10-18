import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { prioritySchema } from '@/types/issue'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogProps } from '@radix-ui/react-dialog'
import { capitalize } from 'lodash/fp'
import { LoaderCircle, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { match } from 'ts-pattern'
import { z } from 'zod'

const statusFormSchema = z.object({
  title: z.string().min(1, 'This field is required'),
  description: z.string(),
})

const issueFormSchema = statusFormSchema.extend({
  priority: prioritySchema,
})

type StatusInputs = z.infer<typeof statusFormSchema>

type IssueInputs = z.infer<typeof issueFormSchema>

type KanbanSheetProps = DialogProps & {
  isLoading?: boolean
  isPending?: boolean
  isFetching?: boolean
  isPlaceholderData?: boolean
} & (
    | { type: 'create-status'; onSubmit: (inputs: StatusInputs) => void }
    | {
        type: 'update-status'
        values: StatusInputs
        onSubmit: (inputs: StatusInputs) => void
      }
    | { type: 'create-issue'; onSubmit: (inputs: IssueInputs) => void }
    | {
        type: 'update-issue'
        values: IssueInputs
        onSubmit: (inputs: IssueInputs) => void
      }
  )

const KanbanSheet = ({
  isLoading,
  isFetching,
  isPlaceholderData,
  isPending,
  ...props
}: KanbanSheetProps) => {
  const form = useForm<StatusInputs | IssueInputs>({
    values: match(props)
      .with({ type: 'create-status' }, () => ({
        title: '',
        description: '',
      }))
      .with({ type: 'update-status' }, (props) => ({
        title: props.values.title,
        description: props.values.description,
      }))
      .with({ type: 'create-issue' }, () => ({
        title: '',
        description: '',
        priority: 'MEDIUM',
      }))
      .with({ type: 'update-issue' }, (props) => ({
        title: props.values.title,
        description: props.values.description,
        priority: props.values.priority,
      }))
      .exhaustive(),
    resolver: zodResolver(
      match(props.type)
        .with('create-status', 'update-status', () => statusFormSchema)
        .with('create-issue', 'update-issue', () => issueFormSchema)
        .exhaustive()
    ),
  })

  return (
    <Sheet {...props}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {match(props.type)
              .with('create-status', () => 'New Status')
              .with('update-status', () => 'Edit Status')
              .with('create-issue', () => 'New Issue')
              .with('update-issue', () => 'Edit Issue')
              .exhaustive()}
          </SheetTitle>
          <SheetDescription>
            {match(props.type)
              .with(
                'create-status',
                () =>
                  'Create a new status by entering a title and optional description. Choose a title that clearly represents the stage (e.g., "To Do," "In Progress"). Use the description for additional details or guidelines. Submit to add the status to your Kanban board.'
              )
              .with(
                'update-status',
                () =>
                  'Edit the status by updating the title or optional description. Ensure the title clearly represents the stage (e.g., "To Do," "In Progress"). Use the description to add or modify details and guidelines. Submit to save your changes to the Kanban board.'
              )
              .with('create-issue', () => 'TODO')
              .with('update-issue', () => 'TODO')
              .exhaustive()}
          </SheetDescription>
        </SheetHeader>
        <div className='py-4'>
          <Form {...form}>
            <form
              className='flex flex-col gap-y-6'
              onSubmit={form.handleSubmit(
                // @ts-expect-error exhaustive
                match(props)
                  .with(
                    { type: 'create-status' },
                    { type: 'update-status' },
                    { type: 'create-issue' },
                    { type: 'update-issue' },
                    (props) => props.onSubmit
                  )
                  .exhaustive()
              )}
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Title<span className='text-destructive'>*</span>
                    </FormLabel>
                    {isLoading ? (
                      <Skeleton className='h-10 w-full' />
                    ) : (
                      <FormControl>
                        <Input
                          placeholder='Enter title'
                          disabled={isFetching && !isPlaceholderData}
                          {...field}
                        />
                      </FormControl>
                    )}
                    <FormDescription>
                      This value has to be unique. There can only be one{' '}
                      {match(props.type)
                        .with('create-status', 'update-status', () => 'status')
                        .with('create-issue', 'update-issue', () => 'issue')
                        .exhaustive()}{' '}
                      associated with this title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      {isLoading ? (
                        <Skeleton className='h-20 w-full' />
                      ) : (
                        <Textarea
                          className='resize-none'
                          placeholder='Enter description'
                          disabled={isFetching && !isPlaceholderData}
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(props.type === 'create-issue' ||
                props.type === 'update-issue') && (
                <FormField
                  control={form.control}
                  name='priority'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Priority<span className='text-destructive'>*</span>
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Assign priority' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {prioritySchema.options.map((priority) => (
                            <SelectItem
                              key={priority}
                              className='[&>span:last-of-type]:w-full'
                              value={priority}
                            >
                              <div className='flex w-full items-center justify-between gap-x-2'>
                                {capitalize(priority)}
                                {/* TODO */}
                                <div className='mr-1.5 size-2 rounded-full bg-destructive' />
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button
                className='flex gap-x-2 sm:w-fit'
                type='submit'
                disabled={
                  isLoading || (isFetching && !isPlaceholderData) || isPending
                }
              >
                Submit
                {isPending ? (
                  <LoaderCircle className='size-4 animate-spin' />
                ) : (
                  <Send className='size-4' />
                )}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default KanbanSheet
