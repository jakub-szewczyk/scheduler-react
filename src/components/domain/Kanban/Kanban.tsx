import StrictModeDroppable from '@/components/common/StrictModeDroppable/StrictModeDroppable'
import useDragEndHandler from '@/hooks/useDragEndHandler'
import { PAGE_SIZE } from '@/modules/common'
import { getStatuses } from '@/services/status'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { DragDropContext } from 'react-beautiful-dnd'
import { match } from 'ts-pattern'
import { useIntersectionObserver } from 'usehooks-ts'
import KanbanStatus from './KanbanStatus/KanbanStatus'

const Kanban = () => {
  const params = useParams({
    from: '/projects/$projectId/boards/$boardId/statuses/',
  })

  const statusesQueryKey = [
    'projects',
    params.projectId,
    'boards',
    params.boardId,
    'statuses',
  ]

  const getStatusesQuery = useInfiniteQuery({
    queryKey: statusesQueryKey,
    queryFn: ({ pageParam }) =>
      getStatuses({
        page: pageParam,
        size: PAGE_SIZE,
        projectId: params.projectId,
        boardId: params.boardId,
      }),
    getNextPageParam: (page) =>
      (page.page + 1) * page.size < page.total ? page.page + 1 : null,
    initialPageParam: 0,
  })

  const { ref } = useIntersectionObserver({
    onChange: (isIntersecting) =>
      isIntersecting &&
      !getStatusesQuery.isFetching &&
      getStatusesQuery.fetchNextPage(),
  })

  const handleDragEnd = useDragEndHandler()

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StrictModeDroppable
        droppableId='board'
        type='board'
        direction='horizontal'
      >
        {({ innerRef, placeholder, droppableProps }) => (
          <div
            className='flex overflow-auto'
            ref={innerRef}
            {...droppableProps}
          >
            {match(getStatusesQuery)
              .with({ status: 'pending' }, { status: 'error' }, () =>
                Array(10)
                  .fill(null)
                  .map((_, index) => (
                    <KanbanStatus
                      key={index}
                      className='mx-2 w-[350px] flex-shrink-0'
                      index={index}
                      status='pending'
                    />
                  ))
              )
              .with({ status: 'success' }, ({ data }) => {
                const statuses = data.pages.flatMap((page) => page.content)
                return (
                  <>
                    {statuses.map((status, index) => (
                      <KanbanStatus
                        key={status.id}
                        className='mx-2 w-[350px] flex-shrink-0'
                        index={index}
                        status='success'
                        {...status}
                      />
                    ))}
                    {getStatusesQuery.hasNextPage && (
                      <KanbanStatus
                        ref={ref}
                        className='mx-2 w-[350px] flex-shrink-0'
                        index={statuses.length}
                        status='pending'
                      />
                    )}
                  </>
                )
              })
              .exhaustive()}
            {placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
}

export default Kanban
