import Protected from '@/components/common/Protected/Protected'
import Calendar from '@/components/domain/Calendar/Calendar'
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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { calendarDefaultDate } from '@/modules/events'
import { getEvents, getEventsSearchParamsSchema } from '@/services/event'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CirclePlus,
} from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Events'

export const Route = createFileRoute(
  '/projects/$projectId/schedules/$scheduleId/events/'
)({
  component: () => (
    <Protected>
      <Events />
    </Protected>
  ),
  validateSearch: getEventsSearchParamsSchema,
})

function Events() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const search = Route.useSearch()

  const navigate = Route.useNavigate()

  const getEventsQuery = useQuery({
    queryKey: [
      'projects',
      params.projectId,
      'schedules',
      params.scheduleId,
      'events',
      search,
    ],
    queryFn: () =>
      getEvents({
        projectId: params.projectId,
        scheduleId: params.scheduleId,
        ...search,
      }),
    placeholderData: keepPreviousData,
    enabled: !!search.startAt && !!search.endAt,
  })

  const pages = Math.ceil((getEventsQuery.data?.total || 0) / search.size)

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
                  to='/projects/$projectId/schedules'
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                  params={{ projectId: params.projectId }}
                >
                  Schedules
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to='/projects/$projectId/schedules/$scheduleId'
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                  params={{
                    projectId: params.projectId,
                    scheduleId: params.scheduleId,
                  }}
                >
                  Schedule Details
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
              This page provides an overview of all scheduled events related to
              the project. You can view the events in a calendar format, see
              details for each event, and add new events to keep the project
              timeline up-to-date.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className='w-full gap-x-2 sm:w-fit'
              variant='secondary'
              asChild
            >
              <Link
                to='/projects/$projectId/schedules/$scheduleId/events/new'
                params={{
                  projectId: params.projectId,
                  scheduleId: params.scheduleId,
                }}
              >
                New Event <CirclePlus className='size-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card>
        <CardContent className='pb-4 pt-6'>
          <Calendar
            doShowMoreDrillDown={false}
            defaultDate={
              search.startAt && search.endAt
                ? calendarDefaultDate(search.startAt, search.endAt)
                : new Date()
            }
            events={getEventsQuery.data?.content.map((event) => ({
              id: event.id,
              title: event.title,
              start: new Date(event.startsAt),
              end: new Date(event.endsAt),
            }))}
            onRangeChange={(range) => {
              if (!('start' in range)) return
              navigate({
                search: (search) => ({
                  ...search,
                  page: 0,
                  size: 10,
                  startAt: range.start.toISOString(),
                  endAt: range.end.toISOString(),
                }),
                replace: true,
              })
            }}
            // TODO: Handle navigation
            // onSelectEvent={(event) =>
            //   navigate({
            //     to: '/projects/$projectId/schedules/$scheduleId/events/$eventId',
            //     params: {
            //       projectId: params.projectId,
            //       scheduleId: params.scheduleId,
            //       eventId: event.id,
            //     },
            //   })
            // }
            onShowMore={console.log}
          />
        </CardContent>
        <CardFooter className='justify-end'>
          <div className='flex items-center gap-x-2'>
            <div className='text-sm text-muted-foreground md:hidden'>
              {search.page + 1}/{pages}
            </div>
            <div className='hidden whitespace-nowrap text-sm text-muted-foreground md:block'>
              Page {search.page + 1} of {pages}
            </div>
            <div className='flex items-center gap-x-2'>
              <Button
                data-testid='first-page'
                className='size-8'
                size='icon'
                variant='outline'
                disabled={search.page === 0}
                onClick={() =>
                  navigate({
                    search: (search) => ({ ...search, page: 0 }),
                    replace: true,
                  })
                }
              >
                <ChevronsLeftIcon className='size-4' />
              </Button>
              <Button
                data-testid='previous-page'
                className='size-8'
                size='icon'
                variant='outline'
                disabled={search.page === 0}
                onClick={() =>
                  navigate({
                    search: (search) => ({ ...search, page: search.page! - 1 }),
                    replace: true,
                  })
                }
              >
                <ChevronLeftIcon className='size-4' />
              </Button>
              <Button
                data-testid='next-page'
                className='size-8'
                size='icon'
                variant='outline'
                disabled={search.page + 1 >= pages}
                onClick={() =>
                  navigate({
                    search: (search) => ({ ...search, page: search.page! + 1 }),
                    replace: true,
                  })
                }
              >
                <ChevronRightIcon className='size-4' />
              </Button>
              <Button
                data-testid='last-page'
                className='size-8'
                size='icon'
                variant='outline'
                disabled={search.page + 1 >= pages}
                onClick={() =>
                  navigate({
                    search: (search) => ({
                      ...search,
                      page: Math.ceil(
                        (getEventsQuery.data?.total || 0) / search.size! - 1
                      ),
                    }),
                    replace: true,
                  })
                }
              >
                <ChevronsRightIcon className='size-4' />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
