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
import { getEvents, getEventsSearchParamsSchema } from '@/services/event'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CirclePlus } from 'lucide-react'
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

  /**
   * TODO:
   * Handle pagination.
   */
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
    enabled: !!search.startAt && !!search.endAt,
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
            {/* TODO: Update description */}
            <CardDescription>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore
              magni doloremque consequuntur voluptatibus quasi vero ullam quo
              sed, ipsum possimus impedit eligendi omnis, ipsa iure aliquid
              quidem veniam eaque recusandae!
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
        <CardContent className='h-[600px] pt-6'>
          <Calendar
            events={getEventsQuery.data?.content.map((event) => ({
              title: event.title,
              start: new Date(event.startsAt),
              end: new Date(event.endsAt),
            }))}
            onRangeChange={(range) => {
              if (!('start' in range)) return
              navigate({
                search: (search) => ({
                  ...search,
                  startAt: range.start.toISOString(),
                  endAt: range.end.toISOString(),
                }),
              })
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
