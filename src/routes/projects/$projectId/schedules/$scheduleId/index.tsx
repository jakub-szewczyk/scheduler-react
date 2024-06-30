import Protected from '@/components/common/Protected/Protected'
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
import { Skeleton } from '@/components/ui/skeleton'
import { cn, toDateFormat } from '@/modules/common'
import { getSchedule } from '@/services/schedule'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CalendarClock, Pencil } from 'lucide-react'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Schedule Details'

export const Route = createFileRoute(
  '/projects/$projectId/schedules/$scheduleId/'
)({
  component: () => (
    <Protected>
      <ScheduleDetails />
    </Protected>
  ),
})
function ScheduleDetails() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const getProjectQuery = useQuery({
    queryKey: ['projects', params.projectId, 'schedules', params.scheduleId],
    queryFn: () =>
      getSchedule({
        projectId: params.projectId,
        scheduleId: params.scheduleId,
      }),
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
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader>
            <CardTitle>{pageTitle}</CardTitle>
            <CardDescription>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolore
              magni doloremque consequuntur voluptatibus quasi vero ullam quo
              sed, ipsum possimus impedit eligendi omnis, ipsa iure aliquid
              quidem veniam eaque recusandae!
            </CardDescription>
          </CardHeader>
          <CardFooter className='flex-col gap-x-2 gap-y-4 sm:flex-row'>
            <Button
              className='w-full gap-x-2 sm:w-fit'
              variant='secondary'
              asChild
            >
              <Link
                to='/projects/$projectId/schedules/$scheduleId/edit'
                params={{
                  projectId: params.projectId,
                  scheduleId: params.scheduleId,
                }}
              >
                Edit Schedule <Pencil className='size-4' />
              </Link>
            </Button>
            <Button
              className='w-full gap-x-2 sm:w-fit'
              variant='outline'
              asChild
            >
              <Link
                to='/projects/$projectId/schedules/$scheduleId/events'
                params={{
                  projectId: params.projectId,
                  scheduleId: params.scheduleId,
                }}
              >
                See the Calendar <CalendarClock className='size-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Card>
        <CardContent className='pt-6 text-sm'>
          <dl
            className={cn(
              'space-y-4',
              getProjectQuery.isFetching &&
                !getProjectQuery.isPlaceholderData &&
                'opacity-50'
            )}
          >
            <div className='text-muted-foreground'>
              <dt className='font-bold'>Created at</dt>
              <dd>
                {getProjectQuery.isLoading ? (
                  <Skeleton className='max-w-xs h-5' />
                ) : (
                  getProjectQuery.data?.createdAt &&
                  toDateFormat(getProjectQuery.data.createdAt)
                )}
              </dd>
            </div>
            <div>
              <dt className='font-bold'>Title</dt>
              <dd>
                {getProjectQuery.isLoading ? (
                  <Skeleton className='max-w-screen-sm h-5' />
                ) : (
                  getProjectQuery.data?.title
                )}
              </dd>
            </div>
            {getProjectQuery.isLoading ? (
              <div>
                <dt className='font-bold'>Description</dt>
                <Skeleton className='h-10' />
              </div>
            ) : (
              getProjectQuery.data?.description && (
                <div>
                  <dt className='font-bold'>Description</dt>
                  <dd>{getProjectQuery.data.description}</dd>
                </div>
              )
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
