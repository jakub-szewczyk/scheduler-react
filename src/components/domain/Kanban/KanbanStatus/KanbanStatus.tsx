import StrictModeDroppable from '@/components/common/StrictModeDroppable/StrictModeDroppable'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/modules/common'
import { getIssues } from '@/services/issue'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { GripVertical } from 'lucide-react'
import { ComponentProps, forwardRef } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { match } from 'ts-pattern'
import { useIntersectionObserver } from 'usehooks-ts'
import KanbanIssue from '../KanbanIssue/KanbanIssue'

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

    const params = useParams({
      from: '/projects/$projectId/boards/$boardId/statuses/',
    })

    const getIssuesQuery = useInfiniteQuery({
      queryKey: [
        'projects',
        params.projectId,
        'boards',
        params.boardId,
        'statuses',
        statusId,
      ],
      queryFn: ({ pageParam }) =>
        getIssues({
          page: pageParam,
          size: 1_000_000,
          projectId: params.projectId,
          boardId: params.boardId,
          statusId: statusId!,
        }),
      getNextPageParam: (page) =>
        (page.page + 1) * page.size < page.total ? page.page + 1 : null,
      initialPageParam: 0,
      enabled: !!statusId,
    })

    const { ref: issueRef } = useIntersectionObserver({
      onChange: (isIntersecting) =>
        isIntersecting &&
        !getIssuesQuery.isFetching &&
        getIssuesQuery.fetchNextPage(),
    })

    return (
      <Draggable
        draggableId={statusId || `status-${props.index}`}
        index={props.index}
      >
        {({ innerRef, draggableProps, dragHandleProps }) => (
          <div ref={innerRef} {...draggableProps}>
            <Card ref={statusRef} className={props.className}>
              <CardHeader className='flex-row gap-x-2'>
                <Button
                  className='size-8 flex-shrink-0 cursor-grab'
                  size='icon'
                  variant='ghost'
                  disabled={!statusId}
                  {...dragHandleProps}
                >
                  <GripVertical className='size-6' />
                </Button>
                <div className='!mt-0 w-full space-y-1.5 truncate'>
                  {match(props)
                    .with({ status: 'pending' }, { status: 'error' }, () => (
                      <div className='h-7'>
                        <Skeleton className='h-5' />
                      </div>
                    ))
                    .with({ status: 'success' }, (props) => (
                      <CardTitle className='truncate text-xl'>
                        {props.title}
                      </CardTitle>
                    ))
                    .exhaustive()}
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
                          props.description && 'visible'
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
                    className='flex flex-col space-y-2'
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
                                    index={index}
                                    status='success'
                                    {...issue}
                                  />
                                ))}
                                {getIssuesQuery.hasNextPage && (
                                  <KanbanIssue
                                    ref={issueRef}
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
    )
  }
)

export default KanbanStatus
