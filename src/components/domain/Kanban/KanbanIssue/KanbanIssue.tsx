import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/modules/common'
import { priorityColor } from '@/modules/issue'
import {
  GetIssuesResponseBody,
  createIssue,
  deleteIssue,
  updateIssue,
} from '@/services/issue'
import { Issue, Priority } from '@/types/issue'
import { Status } from '@/types/status'
import { IS_STORYBOOK } from '@/utils/storybook'
import {
  InfiniteData,
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { capitalize } from 'lodash/fp'
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
} from 'lucide-react'
import { ComponentProps, forwardRef } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { match } from 'ts-pattern'
import { useBoolean } from 'usehooks-ts'
import KanbanSheet from '../KanbanSheet/KanbanSheet'
import KanbanIssueDeleteConfirmationDialog from '../KanbanIssueDeleteConfirmationDialog/KanbanIssueDeleteConfirmationDialog'

type KanbanIssueProps = ComponentProps<'div'> & { index: number } & (
    | {
        status: 'pending'
      }
    | {
        status: 'success'
        statusId: Status['id']
        title: Issue['title']
        description?: Issue['description']
        priority: Issue['priority']
      }
    | {
        status: 'error'
      }
  )

const KanbanIssue = forwardRef<HTMLDivElement, KanbanIssueProps>(
  (props, ref) => {
    const issueId = props.status === 'success' ? props.id : undefined
    const statusId = props.status === 'success' ? props.statusId : undefined

    const {
      value: isUpdateIssueSheetOpen,
      setValue: setIsUpdateIssueSheetOpen,
      setTrue: openUpdateIssueSheet,
      setFalse: closeUpdateIssueSheet,
    } = useBoolean()

    const {
      value: isInsertIssueSheetOpen,
      setValue: setIsInsertIssueSheetOpen,
      setTrue: openInsertIssueSheet,
      setFalse: closeInsertIssueSheet,
    } = useBoolean()

    const {
      value: isInsertAboveIssueSheetOpen,
      setValue: setIsInsertAboveIssueSheetOpen,
      setTrue: openInsertAboveIssueSheet,
      setFalse: closeInsertAboveIssueSheet,
    } = useBoolean()

    const {
      value: isInsertBelowIssueSheetOpen,
      setValue: setIsInsertBelowIssueSheetOpen,
      setTrue: openInsertBelowIssueSheet,
      setFalse: closeInsertBelowIssueSheet,
    } = useBoolean()

    const {
      value: isDeleteIssueDialogOpen,
      setValue: setIsDeleteIssueDialogOpen,
      setTrue: openDeleteIssueDialog,
      setFalse: closeDeleteIssueDialog,
    } = useBoolean()

    const params = useParams(
      IS_STORYBOOK
        ? { strict: false }
        : {
            strict: true,
            from: '/projects/$projectId/boards/$boardId/statuses/',
          }
    )

    const { toast } = useToast()

    const queryClient = useQueryClient()

    const updateIssueMutation = useMutation({
      mutationFn: updateIssue,
      onSuccess: (issue) => {
        queryClient.invalidateQueries({
          queryKey: [
            'projects',
            params.projectId,
            'boards',
            params.boardId,
            'statuses',
            statusId,
            'issues',
          ],
        })
        closeUpdateIssueSheet()
        toast({
          title: 'Issue updated',
          description: `${issue.title} has been successfully updated`,
        })
      },
      onError: (error) =>
        toast({
          variant: 'destructive',
          title: 'Form submission failed',
          description: error.response?.data?.[0]?.msg,
        }),
    })

    const createIssueMutation = useMutation({
      mutationFn: createIssue,
      onSuccess: (issue) => {
        queryClient.invalidateQueries({
          queryKey: [
            'projects',
            params.projectId,
            'boards',
            params.boardId,
            'statuses',
            statusId,
            'issues',
          ],
        })
        closeInsertIssueSheet()
        closeInsertAboveIssueSheet()
        closeInsertBelowIssueSheet()
        toast({
          title: 'Issue created',
          description: `${issue.title} has been successfully created`,
        })
      },
      onError: (error) =>
        toast({
          variant: 'destructive',
          title: 'Form submission failed',
          description: error.response?.data?.[0]?.msg,
        }),
    })

    const deleteIssueMutation = useMutation({
      mutationFn: deleteIssue,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'projects',
            params.projectId,
            'boards',
            params.boardId,
            'statuses',
            statusId,
            'issues',
          ],
        })
        closeDeleteIssueDialog()
      },
    })

    const isFetching = !!useIsFetching({
      queryKey: [
        'projects',
        params.projectId,
        'boards',
        params.boardId,
        'statuses',
      ],
    })

    return (
      <>
        <Draggable
          draggableId={issueId || `issue-${props.index}`}
          index={props.index}
          isDragDisabled={!issueId}
        >
          {({ innerRef, draggableProps, dragHandleProps }) => (
            <div ref={innerRef} {...draggableProps}>
              <Card
                ref={ref}
                className={cn('flex-shrink-0 bg-secondary', props.className)}
              >
                <CardHeader className='flex-row p-4'>
                  <Button
                    className='size-8 flex-shrink-0 cursor-grab hover:bg-primary-foreground/80'
                    size='icon'
                    variant='ghost'
                    disabled={!issueId || isFetching}
                    {...dragHandleProps}
                  >
                    <GripVertical className='size-6' />
                  </Button>
                  <div className='!mt-0 w-full space-y-1.5 truncate'>
                    <div className='flex items-center justify-between gap-x-2'>
                      {match(props)
                        .with(
                          { status: 'pending' },
                          { status: 'error' },
                          () => (
                            <div className='h-6 w-[82.5%]'>
                              <Skeleton className='h-4 bg-background' />
                            </div>
                          )
                        )
                        .with({ status: 'success' }, (props) => (
                          <div className='flex items-center truncate'>
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className='p-2'>
                                    <div
                                      className={cn(
                                        'size-2 flex-shrink-0 rounded-full',
                                        priorityColor(props.priority)
                                      )}
                                    />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {capitalize(props.priority)}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <CardTitle
                              className={cn(
                                'truncate text-base font-semibold',
                                isFetching && 'opacity-50'
                              )}
                            >
                              {props.title}
                            </CardTitle>
                          </div>
                        ))
                        .exhaustive()}
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className='size-8 flex-shrink-0 p-0 hover:bg-primary-foreground/80'
                            disabled={!issueId || isFetching}
                            variant='ghost'
                          >
                            <MoreHorizontal className='size-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start'>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className='gap-x-2'
                            onClick={openUpdateIssueSheet}
                          >
                            <Pencil className='size-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                              className='gap-x-2'
                              onClick={openInsertIssueSheet}
                            >
                              <Plus className='size-4' />
                              Insert issue
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  className='gap-x-2'
                                  onClick={openInsertAboveIssueSheet}
                                >
                                  <ArrowUp className='size-4' />
                                  Insert issue above
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className='gap-x-2'
                                  onClick={openInsertBelowIssueSheet}
                                >
                                  <ArrowDown className='size-4' />
                                  Insert issue below
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            className='gap-x-2 text-destructive'
                            onClick={openDeleteIssueDialog}
                          >
                            <Trash className='size-4' />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {match(props)
                      .with({ status: 'pending' }, { status: 'error' }, () => (
                        <div className='h-5'>
                          <Skeleton className='h-3.5 bg-background' />
                        </div>
                      ))
                      .with({ status: 'success' }, (props) => (
                        <CardDescription
                          className={cn(
                            'invisible truncate',
                            props.description && 'visible',
                            isFetching && 'opacity-50'
                          )}
                        >
                          {props.description || 'DESCRIPTION'}
                        </CardDescription>
                      ))
                      .exhaustive()}
                  </div>
                </CardHeader>
              </Card>
            </div>
          )}
        </Draggable>
        <KanbanSheet
          open={isUpdateIssueSheetOpen}
          onOpenChange={setIsUpdateIssueSheetOpen}
          isPending={updateIssueMutation.isPending}
          type='update-issue'
          values={match(props)
            .with({ status: 'pending' }, { status: 'error' }, () => ({
              title: '',
              description: '',
              priority: 'MEDIUM' as Priority,
            }))
            .with({ status: 'success' }, (props) => ({
              title: props.title,
              description: props.description || '',
              priority: props.priority,
            }))
            .exhaustive()}
          onSubmit={(inputs) =>
            updateIssueMutation.mutate({
              projectId: params.projectId!,
              boardId: params.boardId!,
              statusId: props.status === 'success' ? props.statusId : '',
              issueId: issueId!,
              title: inputs.title,
              description: inputs.description,
              priority: inputs.priority,
            })
          }
        />
        <KanbanSheet
          open={isInsertIssueSheetOpen}
          onOpenChange={setIsInsertIssueSheetOpen}
          isPending={createIssueMutation.isPending}
          type='create-issue'
          onSubmit={(inputs) =>
            createIssueMutation.mutate({
              projectId: params.projectId!,
              boardId: params.boardId!,
              statusId: statusId!,
              title: inputs.title,
              description: inputs.description,
              priority: inputs.priority,
            })
          }
        />
        <KanbanSheet
          open={isInsertAboveIssueSheetOpen}
          onOpenChange={setIsInsertAboveIssueSheetOpen}
          isPending={createIssueMutation.isPending}
          type='create-issue'
          onSubmit={(inputs) => {
            const getIssuesQueryData = queryClient.getQueryData<
              InfiniteData<GetIssuesResponseBody, number>
            >([
              'projects',
              params.projectId,
              'boards',
              params.boardId,
              'statuses',
              statusId,
              'issues',
            ])
            const issues = getIssuesQueryData!.pages.flatMap(
              (page) => page.content
            )
            const prevIssue: Issue | undefined = issues[props.index - 1]
            createIssueMutation.mutate({
              projectId: params.projectId!,
              boardId: params.boardId!,
              statusId: statusId!,
              title: inputs.title,
              description: inputs.description,
              priority: inputs.priority,
              prevIssueId: prevIssue?.id,
              nextIssueId: issueId,
            })
          }}
        />
        <KanbanSheet
          open={isInsertBelowIssueSheetOpen}
          onOpenChange={setIsInsertBelowIssueSheetOpen}
          isPending={createIssueMutation.isPending}
          type='create-issue'
          onSubmit={(inputs) => {
            const getIssuesQueryData = queryClient.getQueryData<
              InfiniteData<GetIssuesResponseBody, number>
            >([
              'projects',
              params.projectId,
              'boards',
              params.boardId,
              'statuses',
              statusId,
              'issues',
            ])
            const issues = getIssuesQueryData!.pages.flatMap(
              (page) => page.content
            )
            const nextIssue: Issue | undefined = issues[props.index + 1]
            createIssueMutation.mutate({
              projectId: params.projectId!,
              boardId: params.boardId!,
              statusId: statusId!,
              title: inputs.title,
              description: inputs.description,
              priority: inputs.priority,
              prevIssueId: issueId,
              nextIssueId: nextIssue?.id,
            })
          }}
        />
        <KanbanIssueDeleteConfirmationDialog
          open={isDeleteIssueDialogOpen}
          onOpenChange={setIsDeleteIssueDialogOpen}
          isPending={deleteIssueMutation.isPending}
          issue={match(props)
            .with({ status: 'pending' }, { status: 'error' }, () => ({
              title: '',
            }))
            .with({ status: 'success' }, (props) => ({
              title: props.title,
            }))
            .exhaustive()}
          onConfirm={() =>
            deleteIssueMutation.mutate({
              projectId: params.projectId!,
              boardId: params.boardId!,
              statusId: statusId!,
              issueId: issueId!,
            })
          }
        />
      </>
    )
  }
)

export default KanbanIssue
