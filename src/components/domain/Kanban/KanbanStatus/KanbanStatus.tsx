import StrictModeDroppable from '@/components/common/StrictModeDroppable/StrictModeDroppable'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
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
import { useToast } from '@/components/ui/use-toast'
import { PAGE_SIZE, cn } from '@/modules/common'
import { createIssue, getIssues } from '@/services/issue'
import {
  GetStatusesResponseBody,
  createStatus,
  deleteStatus,
  updateStatus,
} from '@/services/status'
import { Status } from '@/types/status'
import { IS_STORYBOOK } from '@/utils/storybook'
import {
  InfiniteData,
  useInfiniteQuery,
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
} from 'lucide-react'
import { ComponentProps, forwardRef } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { match } from 'ts-pattern'
import { useBoolean, useIntersectionObserver } from 'usehooks-ts'
import KanbanIssue from '../KanbanIssue/KanbanIssue'
import KanbanSheet from '../KanbanSheet/KanbanSheet'
import KanbanStatusDeleteConfirmationDialog from '../KanbanStatusDeleteConfirmationDialog/KanbanStatusDeleteConfirmationDialog'

const SIZE = 10

type KanbanStatusProps = Omit<ComponentProps<'div'>, 'id' | 'title'> & {
  index: number
} & (
    | {
        status: 'pending'
      }
    | {
        status: 'success'
        id: string
        title: string
        description?: string | null
      }
    | {
        status: 'error'
      }
  )

const KanbanStatus = forwardRef<HTMLDivElement, KanbanStatusProps>(
  (props, statusRef) => {
    const statusId = props.status === 'success' ? props.id : undefined

    const {
      value: isUpdateStatusSheetOpen,
      setValue: setIsUpdateStatusSheetOpen,
      setTrue: openUpdateStatusSheet,
      setFalse: closeUpdateStatusSheet,
    } = useBoolean()

    const {
      value: isInsertIssueSheetOpen,
      setValue: setIsInsertIssueSheetOpen,
      setTrue: openInsertIssueSheet,
      setFalse: closeInsertIssueSheet,
    } = useBoolean()

    const {
      value: isInsertStatusSheetOpen,
      setValue: setIsInsertStatusSheetOpen,
      setTrue: openInsertStatusSheet,
      setFalse: closeInsertStatusSheet,
    } = useBoolean()

    const {
      value: isInsertLeftStatusSheetOpen,
      setValue: setIsInsertLeftStatusSheetOpen,
      setTrue: openInsertLeftStatusSheet,
      setFalse: closeInsertLeftStatusSheet,
    } = useBoolean()

    const {
      value: isInsertRightStatusSheetOpen,
      setValue: setIsInsertRightStatusSheetOpen,
      setTrue: openInsertRightStatusSheet,
      setFalse: closeInsertRightStatusSheet,
    } = useBoolean()

    const {
      value: isDeleteStatusDialogOpen,
      setValue: setIsDeleteStatusDialogOpen,
      setTrue: openDeleteStatusDialog,
      setFalse: closeDeleteStatusDialog,
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

    const getIssuesQuery = useInfiniteQuery({
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: [
        'projects',
        params.projectId,
        'boards',
        params.boardId,
        'statuses',
        statusId,
        'issues',
      ],
      queryFn: ({ pageParam }) =>
        getIssues({
          page: pageParam,
          size: PAGE_SIZE,
          projectId: params.projectId!,
          boardId: params.boardId!,
          statusId: statusId!,
        }),
      getNextPageParam: (page) =>
        (page.page + 1) * page.size < page.total ? page.page + 1 : null,
      initialPageParam: 0,
      enabled: !!statusId && !IS_STORYBOOK,
    })

    const updateStatusMutation = useMutation({
      mutationFn: updateStatus,
      onSuccess: (status) => {
        queryClient.invalidateQueries({
          queryKey: [
            'projects',
            params.projectId,
            'boards',
            params.boardId,
            'statuses',
          ],
        })
        closeUpdateStatusSheet()
        toast({
          title: 'Status updated',
          description: `${status.title} has been successfully updated`,
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

    const createStatusMutation = useMutation({
      mutationFn: createStatus,
      onSuccess: (status) => {
        queryClient.invalidateQueries({
          queryKey: [
            'projects',
            params.projectId,
            'boards',
            params.boardId,
            'statuses',
          ],
        })
        closeInsertStatusSheet()
        closeInsertLeftStatusSheet()
        closeInsertRightStatusSheet()
        toast({
          title: 'Status created',
          description: `${status.title} has been successfully created`,
        })
      },
      onError: (error) =>
        toast({
          variant: 'destructive',
          title: 'Form submission failed',
          description: error.response?.data?.[0]?.msg,
        }),
    })

    const deleteStatusMutation = useMutation({
      mutationFn: deleteStatus,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'projects',
            params.projectId,
            'boards',
            params.boardId,
            'statuses',
          ],
          predicate: (query) => !query.options.queryKey?.includes(statusId),
        })
        closeDeleteStatusDialog()
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

    const { ref: issueRef } = useIntersectionObserver({
      onChange: (isIntersecting) =>
        isIntersecting &&
        !getIssuesQuery.isFetching &&
        getIssuesQuery.fetchNextPage(),
    })

    return (
      <>
        <Draggable
          draggableId={statusId || `status-${props.index}`}
          index={props.index}
          isDragDisabled={!statusId}
        >
          {({ innerRef, draggableProps, dragHandleProps }) => (
            <div ref={innerRef} {...draggableProps}>
              <Card ref={statusRef} className={props.className}>
                <CardHeader className='flex-row gap-x-2'>
                  <Button
                    className='size-8 flex-shrink-0 cursor-grab'
                    size='icon'
                    variant='ghost'
                    disabled={!statusId || isFetching}
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
                            <div className='h-7 w-[82.5%]'>
                              <Skeleton className='h-5 w-full' />
                            </div>
                          )
                        )
                        .with({ status: 'success' }, (props) => (
                          <CardTitle
                            className={cn(
                              'truncate text-xl',
                              isFetching && 'opacity-50'
                            )}
                          >
                            {props.title}
                          </CardTitle>
                        ))
                        .exhaustive()}
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className='size-8 flex-shrink-0 p-0'
                            disabled={!statusId || isFetching}
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
                            onClick={openUpdateStatusSheet}
                          >
                            <Pencil className='size-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className='gap-x-2'
                            onClick={openInsertIssueSheet}
                          >
                            <Plus className='size-4' />
                            Insert issue
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                              className='gap-x-2'
                              onClick={openInsertStatusSheet}
                            >
                              <Plus className='size-4' />
                              Insert status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  className='gap-x-2'
                                  onClick={openInsertLeftStatusSheet}
                                >
                                  <ArrowLeft className='size-4' />
                                  Insert status left
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className='gap-x-2'
                                  onClick={openInsertRightStatusSheet}
                                >
                                  <ArrowRight className='size-4' />
                                  Insert status right
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            className='gap-x-2 text-destructive'
                            onClick={openDeleteStatusDialog}
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
                          <Skeleton className='h-3.5' />
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
                <StrictModeDroppable
                  droppableId={statusId || `status-${props.index}`}
                  type='status'
                >
                  {({ innerRef, placeholder, droppableProps }) => (
                    <CardContent
                      className='flex flex-col'
                      ref={innerRef}
                      {...droppableProps}
                    >
                      {match(props)
                        .with({ status: 'pending' }, { status: 'error' }, () =>
                          Array(SIZE)
                            .fill(null)
                            .map((_, index) => (
                              <KanbanIssue
                                key={index}
                                className='mb-2'
                                index={index}
                                status='pending'
                              />
                            ))
                        )
                        .with({ status: 'success' }, () =>
                          match(getIssuesQuery)
                            .with(
                              { status: 'pending' },
                              { status: 'error' },
                              () =>
                                Array(SIZE)
                                  .fill(null)
                                  .map((_, index) => (
                                    <KanbanIssue
                                      key={index}
                                      className='mb-2'
                                      index={index}
                                      status='pending'
                                    />
                                  ))
                            )
                            .with({ status: 'success' }, ({ data }) => {
                              const issues = data.pages.flatMap(
                                (page) => page.content
                              )
                              return (
                                <>
                                  {issues.map((issue, index) => (
                                    <KanbanIssue
                                      key={issue.id}
                                      className='mb-2'
                                      index={index}
                                      status='success'
                                      {...issue}
                                    />
                                  ))}
                                  {getIssuesQuery.hasNextPage && (
                                    <KanbanIssue
                                      ref={issueRef}
                                      className='mb-2'
                                      index={issues.length}
                                      status='pending'
                                    />
                                  )}
                                </>
                              )
                            })
                            .exhaustive()
                        )
                        .exhaustive()}
                      {placeholder}
                    </CardContent>
                  )}
                </StrictModeDroppable>
              </Card>
            </div>
          )}
        </Draggable>
        <KanbanSheet
          open={isUpdateStatusSheetOpen}
          onOpenChange={setIsUpdateStatusSheetOpen}
          isPending={updateStatusMutation.isPending}
          type='update-status'
          values={match(props)
            .with({ status: 'pending' }, { status: 'error' }, () => ({
              title: '',
              description: '',
            }))
            .with({ status: 'success' }, (props) => ({
              title: props.title,
              description: props.description || '',
            }))
            .exhaustive()}
          onSubmit={(inputs) =>
            updateStatusMutation.mutate({
              projectId: params.projectId!,
              boardId: params.boardId!,
              statusId: statusId!,
              title: inputs.title,
              description: inputs.description,
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
          open={isInsertStatusSheetOpen}
          onOpenChange={setIsInsertStatusSheetOpen}
          isPending={createStatusMutation.isPending}
          type='create-status'
          onSubmit={(inputs) =>
            createStatusMutation.mutate({
              projectId: params.projectId!,
              boardId: params.boardId!,
              title: inputs.title,
              description: inputs.description,
            })
          }
        />
        <KanbanSheet
          open={isInsertLeftStatusSheetOpen}
          onOpenChange={setIsInsertLeftStatusSheetOpen}
          isPending={createStatusMutation.isPending}
          type='create-status'
          onSubmit={(inputs) => {
            const getStatusesQueryData = queryClient.getQueryData<
              InfiniteData<GetStatusesResponseBody, number>
            >([
              'projects',
              params.projectId,
              'boards',
              params.boardId,
              'statuses',
            ])
            const statuses = getStatusesQueryData!.pages.flatMap(
              (page) => page.content
            )
            const prevStatus: Status | undefined = statuses[props.index - 1]
            createStatusMutation.mutate({
              projectId: params.projectId!,
              boardId: params.boardId!,
              title: inputs.title,
              description: inputs.description,
              prevStatusId: prevStatus?.id,
              nextStatusId: statusId,
            })
          }}
        />
        <KanbanSheet
          open={isInsertRightStatusSheetOpen}
          onOpenChange={setIsInsertRightStatusSheetOpen}
          isPending={createStatusMutation.isPending}
          type='create-status'
          onSubmit={(inputs) => {
            const getStatusesQueryData = queryClient.getQueryData<
              InfiniteData<GetStatusesResponseBody, number>
            >([
              'projects',
              params.projectId,
              'boards',
              params.boardId,
              'statuses',
            ])
            const statuses = getStatusesQueryData!.pages.flatMap(
              (page) => page.content
            )
            const nextStatus: Status | undefined = statuses[props.index + 1]
            createStatusMutation.mutate({
              projectId: params.projectId!,
              boardId: params.boardId!,
              title: inputs.title,
              description: inputs.description,
              prevStatusId: statusId,
              nextStatusId: nextStatus?.id,
            })
          }}
        />
        <KanbanStatusDeleteConfirmationDialog
          open={isDeleteStatusDialogOpen}
          onOpenChange={setIsDeleteStatusDialogOpen}
          isPending={deleteStatusMutation.isPending}
          status={match(props)
            .with({ status: 'pending' }, { status: 'error' }, () => ({
              title: '',
            }))
            .with({ status: 'success' }, (props) => ({
              title: props.title,
            }))
            .exhaustive()}
          onConfirm={() =>
            deleteStatusMutation.mutate({
              projectId: params.projectId!,
              boardId: params.boardId!,
              statusId: statusId!,
            })
          }
        />
      </>
    )
  }
)

export default KanbanStatus
