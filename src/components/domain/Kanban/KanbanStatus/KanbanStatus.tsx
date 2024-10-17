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
import { getIssues } from '@/services/issue'
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
      value: isUpdateSheetOpen,
      setValue: setIsUpdateSheetOpen,
      setTrue: openUpdateSheet,
      setFalse: closeUpdateSheet,
    } = useBoolean()

    const {
      value: isCreateSheetOpen,
      setValue: setIsCreateSheetOpen,
      setTrue: openCreateSheet,
      setFalse: closeCreateSheet,
    } = useBoolean()

    const {
      value: isInsertLeftSheetOpen,
      setValue: setIsInsertLeftSheetOpen,
      setTrue: openInsertLeftSheet,
      setFalse: closeInsertLeftSheet,
    } = useBoolean()

    const {
      value: isInsertRightSheetOpen,
      setValue: setIsInsertRightSheetOpen,
      setTrue: openInsertRightSheet,
      setFalse: closeInsertRightSheet,
    } = useBoolean()

    const {
      value: isDeleteDialogOpen,
      setValue: setIsDeleteDialogOpen,
      setTrue: openDeleteDialog,
      setFalse: closeDeleteDialog,
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
        closeUpdateSheet()
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
        closeCreateSheet()
        closeInsertLeftSheet()
        closeInsertRightSheet()
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
        closeDeleteDialog()
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
                    <div className='flex items-center justify-between'>
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
                            onClick={openUpdateSheet}
                          >
                            <Pencil className='size-4' />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className='gap-x-2'>
                            <Plus className='size-4' />
                            Insert issue
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                              className='gap-x-2'
                              onClick={openCreateSheet}
                            >
                              <Plus className='size-4' />
                              Insert status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem
                                  className='gap-x-2'
                                  onClick={openInsertLeftSheet}
                                >
                                  <ArrowLeft className='size-4' />
                                  Insert status left
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className='gap-x-2'
                                  onClick={openInsertRightSheet}
                                >
                                  <ArrowRight className='size-4' />
                                  Insert status right
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuItem
                            className='gap-x-2 text-destructive'
                            onClick={openDeleteDialog}
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
          open={isUpdateSheetOpen}
          onOpenChange={setIsUpdateSheetOpen}
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
          open={isCreateSheetOpen}
          onOpenChange={setIsCreateSheetOpen}
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
          open={isInsertLeftSheetOpen}
          onOpenChange={setIsInsertLeftSheetOpen}
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
          open={isInsertRightSheetOpen}
          onOpenChange={setIsInsertRightSheetOpen}
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
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
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
