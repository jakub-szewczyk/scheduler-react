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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { PAGE_SIZE, cn } from '@/modules/common'
import { getIssues } from '@/services/issue'
import { updateStatus } from '@/services/status'
import { IS_STORYBOOK } from '@/utils/storybook'
import {
  useInfiniteQuery,
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { GripVertical, MoreHorizontal, Pencil, Trash } from 'lucide-react'
import { ComponentProps, forwardRef } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { match } from 'ts-pattern'
import { useBoolean, useIntersectionObserver } from 'usehooks-ts'
import KanbanIssue from '../KanbanIssue/KanbanIssue'
import KanbanSheet from '../KanbanSheet/KanbanSheet'

const SIZE = 10

type KanbanStatusProps = Omit<ComponentProps<'div'>, 'id'> & {
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
      value: isSheetOpen,
      setValue: setIsSheetOpen,
      setTrue: openSheet,
      setFalse: closeSheet,
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
        closeSheet()
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
                          <DropdownMenuItem onClick={openSheet}>
                            <div className='flex items-center justify-center gap-x-2'>
                              <Pencil className='size-4' />
                              Edit
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <div className='flex items-center justify-center gap-x-2 text-destructive'>
                              <Trash className='size-4' />
                              Delete
                            </div>
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
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
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
      </>
    )
  }
)

export default KanbanStatus
