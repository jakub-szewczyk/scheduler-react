import Protected from '@/components/common/Protected/Protected'
import StrictModeDroppable from '@/components/common/StrictModeDroppable/StrictModeDroppable'
import KanbanStatus from '@/components/domain/Kanban/KanbanStatus/KanbanStatus'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PAGE_SIZE } from '@/modules/status'
import {
  GetStatusesResponseBody,
  getStatuses,
  updateStatus,
} from '@/services/status'
import { Status } from '@/types/status'
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { produce } from 'immer'
import { CirclePlus } from 'lucide-react'
import { DragDropContext, OnDragEndResponder } from 'react-beautiful-dnd'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { match } from 'ts-pattern'
import { useDocumentTitle, useIntersectionObserver } from 'usehooks-ts'

const pageTitle = 'Statuses'

export const Route = createFileRoute(
  '/projects/$projectId/boards/$boardId/statuses/'
)({
  component: () => (
    <Protected>
      <Statuses />
    </Protected>
  ),
})

function Statuses() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const queryClient = useQueryClient()

  const queryKey = [
    'projects',
    params.projectId,
    'boards',
    params.boardId,
    'statuses',
  ]

  const getStatusesQuery = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getStatuses({
        page: pageParam,
        size: PAGE_SIZE,
        projectId: params.projectId,
        boardId: params.boardId,
      }),
    getNextPageParam: (page) =>
      (page.page + 1) * page.size < page.total ? page.page + 1 : null,
  })

  const updateStatusMutation = useMutation({
    mutationFn: updateStatus,
  })

  const { ref } = useIntersectionObserver({
    onChange: (isIntersecting) =>
      isIntersecting &&
      !getStatusesQuery.isFetching &&
      getStatusesQuery.fetchNextPage(),
  })

  /**
   * NOTE:
   * The destination status can be either to the left or right of the dropped status,
   * depending on the drag direction (left-to-right or right-to-left).
   */
  const handleDragEnd: OnDragEndResponder = ({ source, destination }) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return
    // NOTE: Dragging statuses
    if (source.droppableId === 'board' && destination.droppableId === 'board') {
      const sourcePageIndex = Math.floor(source.index / PAGE_SIZE)
      const sourceContentIndex = source.index % PAGE_SIZE
      const sourceStatus =
        getStatusesQuery.data!.pages[sourcePageIndex].content[
          sourceContentIndex
        ]
      const destinationPageIndex = Math.floor(destination.index / PAGE_SIZE)
      const destinationContentIndex = destination.index % PAGE_SIZE
      // const destinationStatus =
      //   getStatusesQuery.data!.pages[destinationPageIndex].content[
      //     destinationContentIndex
      //   ]
      const isLeftToRight = source.index < destination.index
      const isRightToLeft = source.index > destination.index
      const prevPageIndex = Math.floor(
        (destination.index - +isRightToLeft) / PAGE_SIZE
      )
      const prevContentIndex = (destination.index - +isRightToLeft) % PAGE_SIZE
      const nextPageIndex = Math.floor(
        (destination.index + +isLeftToRight) / PAGE_SIZE
      )
      const nextContentIndex = (destination.index + +isLeftToRight) % PAGE_SIZE
      const prevStatus: Status | undefined =
        getStatusesQuery.data!.pages[prevPageIndex]?.content[prevContentIndex]
      const nextStatus: Status | undefined =
        getStatusesQuery.data!.pages[nextPageIndex]?.content[nextContentIndex]
      queryClient.setQueryData<InfiniteData<GetStatusesResponseBody, number>>(
        queryKey,
        (getStatusesQueryData) =>
          produce(getStatusesQueryData, (draft) => {
            if (!draft) return draft
            const [status] = draft.pages[sourcePageIndex].content.splice(
              sourceContentIndex,
              1
            )
            draft.pages[destinationPageIndex].content.splice(
              destinationContentIndex,
              0,
              status
            )
          })
      )
      return updateStatusMutation.mutate(
        {
          projectId: params.projectId,
          boardId: params.boardId,
          statusId: sourceStatus.id,
          title: sourceStatus.title,
          description: sourceStatus.description,
          ...(prevStatus && { prevStatusId: prevStatus.id }),
          ...(nextStatus && { nextStatusId: nextStatus.id }),
        },
        {
          onError: () =>
            queryClient.setQueryData<
              InfiniteData<GetStatusesResponseBody, number>
            >(queryKey, (getStatusesQueryData) =>
              produce(getStatusesQueryData, (draft) => {
                if (!draft) return draft
                const [status] = draft.pages[
                  destinationPageIndex
                ].content.splice(destinationContentIndex, 1)
                draft.pages[sourcePageIndex].content.splice(
                  sourceContentIndex,
                  0,
                  status
                )
              })
            ),
          onSettled: () => queryClient.invalidateQueries({ queryKey }),
        }
      )
    }
    // NOTE: Dragging issues within a status
    if (source.droppableId === destination.droppableId)
      return console.log('ISSUE WITHIN')
    // NOTE: Dragging issues between statuses
    return console.log('ISSUE BETWEEN')
  }

  return (
    <div className='flex flex-col gap-y-12'>
      <div className='flex flex-col gap-y-4'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to='/projects'
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                >
                  Projects
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to='/projects/$projectId'
                  params={{ projectId: params.projectId }}
                >
                  Project Details
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to='/projects/$projectId/boards'
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                  params={{ projectId: params.projectId }}
                >
                  Boards
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to='/projects/$projectId/boards/$boardId'
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                  params={{
                    projectId: params.projectId,
                    boardId: params.boardId,
                  }}
                >
                  Board Details
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader>
            <CardTitle>{pageTitle}</CardTitle>
            <CardDescription>
              This page provides a clear overview of all project-related issues.
              Use the kanban board layout to track issue details, update their
              statuses, and add new ones to keep the project on track.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className='w-full gap-x-2 sm:w-fit'
              variant='secondary'
              asChild
            >
              <Link
                to='/projects/$projectId/boards/$boardId/statuses/new'
                params={{
                  projectId: params.projectId,
                  boardId: params.boardId,
                }}
              >
                New Status <CirclePlus className='size-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable
          droppableId='board'
          type='board'
          direction='horizontal'
        >
          {({ innerRef, placeholder, droppableProps }) => (
            <div
              className='flex space-x-4 overflow-auto'
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
                        index={index}
                        className='w-[350px] flex-shrink-0'
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
                          index={index}
                          className='w-[350px] flex-shrink-0'
                          status='success'
                          {...status}
                        />
                      ))}
                      {getStatusesQuery.hasNextPage && (
                        <KanbanStatus
                          ref={ref}
                          index={statuses.length}
                          className='w-[350px] flex-shrink-0'
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
    </div>
  )
}
