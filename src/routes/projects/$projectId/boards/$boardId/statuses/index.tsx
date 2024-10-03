import Protected from '@/components/common/Protected/Protected'
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
import { getStatuses } from '@/services/status'
import { Status } from '@/types/status'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CirclePlus } from 'lucide-react'
import { useState } from 'react'
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

  const [draggedStatusId, setDraggedStatusId] = useState<Status['id'] | null>(
    null
  )

  const params = Route.useParams()

  const getStatusesQuery = useInfiniteQuery({
    queryKey: [
      'projects',
      params.projectId,
      'boards',
      params.boardId,
      'statuses',
    ],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getStatuses({
        page: pageParam,
        projectId: params.projectId,
        boardId: params.boardId,
      }),
    getNextPageParam: (page) =>
      (page.page + 1) * page.size < page.total ? page.page + 1 : null,
  })

  const { ref } = useIntersectionObserver({
    onChange: (isIntersecting) =>
      isIntersecting &&
      !getStatusesQuery.isFetching &&
      getStatusesQuery.fetchNextPage(),
  })

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
      <div className='flex gap-x-4 overflow-x-auto'>
        {match(getStatusesQuery)
          .with({ status: 'pending' }, { status: 'error' }, () =>
            Array(10)
              .fill(null)
              .map((_, index) => (
                <KanbanStatus
                  key={index}
                  className='w-[350px] flex-shrink-0'
                  status='pending'
                />
              ))
          )
          .with({ status: 'success' }, ({ data }) => {
            const statuses = data.pages.flatMap((page) => page.content)
            return (
              <>
                <DndContext
                  onDragStart={(event) =>
                    setDraggedStatusId(event.active.id as Status['id'])
                  }
                  onDragEnd={() => setDraggedStatusId(null)}
                >
                  <SortableContext items={statuses.map((status) => status.id)}>
                    {statuses.map((status) => (
                      <KanbanStatus
                        key={status.id}
                        className='w-[350px] flex-shrink-0'
                        status='success'
                        {...status}
                      />
                    ))}
                  </SortableContext>
                  <DragOverlay>
                    <KanbanStatus
                      className='w-[350px] flex-shrink-0 ring-2 ring-ring'
                      status='success'
                      {...statuses.find(
                        (status) => status.id === draggedStatusId
                      )!}
                    />
                  </DragOverlay>
                </DndContext>
                {getStatusesQuery.hasNextPage && (
                  <KanbanStatus
                    ref={ref}
                    className='w-[350px] flex-shrink-0'
                    status='pending'
                  />
                )}
              </>
            )
          })
          .exhaustive()}
      </div>
    </div>
  )
}
