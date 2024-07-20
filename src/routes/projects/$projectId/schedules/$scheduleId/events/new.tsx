import Protected from '@/components/common/Protected/Protected'
import CalendarEventForm from '@/components/domain/Calendar/CalendarEventForm/CalendarEventForm'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { createEvent } from '@/services/event'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'New Event'

export const Route = createFileRoute(
  '/projects/$projectId/schedules/$scheduleId/events/new'
)({
  component: () => (
    <Protected>
      <NewEvent />
    </Protected>
  ),
})

function NewEvent() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const navigate = Route.useNavigate()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: (event) => {
      queryClient.invalidateQueries({
        queryKey: [
          'projects',
          params.projectId,
          'schedules',
          params.scheduleId,
          'events',
        ],
      })
      navigate({
        to: '/projects/$projectId/schedules/$scheduleId/events/$eventId',
        params: {
          projectId: params.projectId,
          scheduleId: params.scheduleId,
          eventId: event.id,
        },
      })
      toast({
        title: 'Event created',
        description: `${event.title} has been successfully created`,
      })
    },
    onError: (error) =>
      toast({
        variant: 'destructive',
        title: 'Form submission failed',
        description: error.response?.data?.[0]?.msg,
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
                  params={{ projectId: params.projectId }}
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
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
              <BreadcrumbLink asChild>
                <Link
                  to='/projects/$projectId/schedules/$scheduleId/events'
                  params={{
                    projectId: params.projectId,
                    scheduleId: params.scheduleId,
                  }}
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                >
                  Events
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
              Create a new event by entering a title, description, start date
              and end date. Choose a title that succinctly describes the event
              and use the description to provide key details and objectives. Set
              the start date and end date to define the duration of the event.
              Once you're done, submit the form to add your event to the
              calendar and keep your timeline organized.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarEventForm
              isPending={createEventMutation.isPending}
              onSubmit={(inputs) =>
                createEventMutation.mutate({
                  ...inputs,
                  projectId: params.projectId,
                  scheduleId: params.scheduleId,
                  startsAt: inputs.startsAt.toISOString(),
                  endsAt: inputs.endsAt.toISOString(),
                  color: inputs.color,
                })
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
