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
import { getEvent, updateEvent } from '@/services/event'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Edit Event'

export const Route = createFileRoute(
  '/projects/$projectId/schedules/$scheduleId/events/$eventId/edit'
)({
  component: () => (
    <Protected>
      <EditEvent />
    </Protected>
  ),
})

function EditEvent() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const navigate = Route.useNavigate()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const getEventQuery = useQuery({
    queryKey: [
      'projects',
      params.projectId,
      'schedules',
      params.scheduleId,
      'events',
      params.eventId,
    ],
    queryFn: () =>
      getEvent({
        projectId: params.projectId,
        scheduleId: params.scheduleId,
        eventId: params.eventId,
      }),
  })

  const updateEventMutation = useMutation({
    mutationFn: updateEvent,
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
        to: '/projects/$projectId/schedules/$scheduleId/events',
        params: {
          projectId: params.projectId,
          scheduleId: params.scheduleId,
        },
        search: { page: 0, size: 0, title: '', createdAt: 'DESC' },
      })
      toast({
        title: 'Event updated',
        description: `${event.title} has been successfully updated`,
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
              Edit your event by updating the title, description, start date,
              end date and choosing a new color if necessary. Ensure the title
              succinctly describes the event, and use the description to provide
              key details and objectives. Adjust the start date and end date to
              redefine the duration of the event as needed. Select a color to
              categorize your event visually. Once you're done, submit the form
              to save your changes and keep your calendar up to date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarEventForm
              isLoading={getEventQuery.isLoading}
              isFetching={getEventQuery.isFetching}
              isPlaceholderData={getEventQuery.isPlaceholderData}
              isPending={updateEventMutation.isPending}
              values={
                getEventQuery.data
                  ? {
                      title: getEventQuery.data.title,
                      description: getEventQuery.data.description || '',
                      startsAt: new Date(getEventQuery.data.startsAt),
                      endsAt: new Date(getEventQuery.data.endsAt),
                      color: getEventQuery.data.color,
                    }
                  : undefined
              }
              onSubmit={(inputs) =>
                updateEventMutation.mutate({
                  ...inputs,
                  projectId: params.projectId,
                  scheduleId: params.scheduleId,
                  eventId: params.eventId,
                  startsAt: inputs.startsAt.toISOString(),
                  endsAt: inputs.endsAt.toISOString(),
                })
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EditEvent
