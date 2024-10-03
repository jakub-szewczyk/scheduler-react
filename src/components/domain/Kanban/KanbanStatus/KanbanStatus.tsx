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
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { ComponentProps, forwardRef } from 'react'
import { match } from 'ts-pattern'
import { useIntersectionObserver } from 'usehooks-ts'
import KanbanIssue from '../KanbanIssue/KanbanIssue'
import { Button } from '@/components/ui/button'
import { GripVertical } from 'lucide-react'

const SIZE = 10

type KanbanStatusProps = Omit<ComponentProps<'div'>, 'id'> &
  (
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

    const {
      attributes,
      listeners,
      transform,
      transition,
      isDragging,
      setNodeRef,
    } = useSortable({
      id: statusId || '',
      disabled: !statusId,
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
      <div
        ref={setNodeRef}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
        }}
      >
        <Card
          ref={statusRef}
          className={cn(isDragging && 'opacity-50', props.className)}
        >
          <CardHeader className='flex-row gap-x-2'>
            <Button
              className={cn(
                'size-8 flex-shrink-0 cursor-grab',
                isDragging && 'cursor-grabbing'
              )}
              size='icon'
              variant='ghost'
              disabled={!statusId}
              {...attributes}
              {...listeners}
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
          <CardContent className='flex h-[75vh] flex-col gap-y-2 overflow-y-auto'>
            {match(props)
              .with({ status: 'pending' }, { status: 'error' }, () =>
                Array(SIZE)
                  .fill(null)
                  .map((_, index) => (
                    <KanbanIssue key={index} status='pending' />
                  ))
              )
              .with({ status: 'success' }, () =>
                match(getIssuesQuery)
                  .with({ status: 'pending' }, { status: 'error' }, () =>
                    Array(SIZE)
                      .fill(null)
                      .map((_, index) => (
                        <KanbanIssue key={index} status='pending' />
                      ))
                  )
                  .with({ status: 'success' }, ({ data }) => (
                    <>
                      {data.pages.flatMap((page) =>
                        page.content.map((issue) => (
                          <KanbanIssue
                            key={issue.id}
                            status='success'
                            {...issue}
                          />
                        ))
                      )}
                      {getIssuesQuery.hasNextPage && (
                        <KanbanIssue ref={issueRef} status='pending' />
                      )}
                    </>
                  ))
                  .exhaustive()
              )
              .exhaustive()}
          </CardContent>
        </Card>
      </div>
    )
  }
)

export default KanbanStatus
