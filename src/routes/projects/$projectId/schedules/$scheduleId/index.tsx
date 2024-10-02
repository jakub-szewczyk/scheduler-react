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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, toDateFormat } from '@/modules/common'
import { getSchedule } from '@/services/schedule'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CalendarClock, FileText, Pencil } from 'lucide-react'
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

  const getScheduleQuery = useQuery({
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
              Review the detailed information about the selected schedule,
              including its creation date, title, and description. Use the
              options below to edit the schedule or view the calendar to see
              associated events.
            </CardDescription>
          </CardHeader>
          <CardFooter className='flex-col gap-2 sm:flex-row'>
            <Button
              className='w-full gap-x-2 sm:w-fit'
              variant='outline'
              asChild
            >
              <Link
                to='/projects/$projectId/schedules/$scheduleId/events'
                search={{
                  page: 0,
                  size: 10,
                  title: '',
                  createdAt: 'DESC',
                }}
                params={{
                  projectId: params.projectId,
                  scheduleId: params.scheduleId,
                }}
              >
                See the Calendar <CalendarClock className='size-4' />
              </Link>
            </Button>
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
          </CardFooter>
        </Card>
      </div>
      <Tabs defaultValue='details'>
        <TabsList>
          <TabsTrigger className='gap-x-2' value='details'>
            Details <FileText className='size-4' />
          </TabsTrigger>
        </TabsList>
        <TabsContent value='details'>
          <Card>
            <CardContent className='pt-6 text-sm'>
              <dl
                className={cn(
                  'space-y-4',
                  getScheduleQuery.isFetching &&
                    !getScheduleQuery.isPlaceholderData &&
                    'opacity-50'
                )}
              >
                <div className='text-muted-foreground'>
                  <dt className='font-bold'>Created at</dt>
                  <dd>
                    {getScheduleQuery.isLoading ? (
                      <Skeleton className='max-w-xs h-5' />
                    ) : (
                      getScheduleQuery.data?.createdAt &&
                      toDateFormat(getScheduleQuery.data.createdAt)
                    )}
                  </dd>
                </div>
                <div>
                  <dt className='font-bold'>Title</dt>
                  <dd>
                    {getScheduleQuery.isLoading ? (
                      <Skeleton className='max-w-screen-sm h-5' />
                    ) : (
                      getScheduleQuery.data?.title
                    )}
                  </dd>
                </div>
                {getScheduleQuery.isLoading ? (
                  <div>
                    <dt className='font-bold'>Description</dt>
                    <Skeleton className='h-10' />
                  </div>
                ) : (
                  getScheduleQuery.data?.description && (
                    <div>
                      <dt className='font-bold'>Description</dt>
                      <dd>{getScheduleQuery.data.description}</dd>
                    </div>
                  )
                )}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
