import Protected from '@/components/common/Protected/Protected'
import DataForm from '@/components/domain/DataForm/DataForm'
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
import { getSchedule, updateSchedule } from '@/services/schedule'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Edit Schedule'

export const Route = createFileRoute(
  '/projects/$projectId/schedules/$scheduleId/edit'
)({
  component: () => (
    <Protected>
      <EditSchedule />
    </Protected>
  ),
})

function EditSchedule() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const navigate = Route.useNavigate()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const getScheduleQuery = useQuery({
    queryKey: ['projects', params.projectId, 'schedules', params.scheduleId],
    queryFn: () =>
      getSchedule({
        projectId: params.projectId,
        scheduleId: params.scheduleId,
      }),
  })

  const updateScheduleMutation = useMutation({
    mutationFn: updateSchedule,
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', params.projectId, 'schedules'],
      })
      navigate({
        to: '/projects/$projectId/schedules/$scheduleId',
        params: { projectId: params.projectId, scheduleId: schedule.id },
      })
      toast({
        title: 'Schedule updated',
        description: `${schedule.title} has been successfully updated`,
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
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader>
            <CardTitle>{pageTitle}</CardTitle>
            <CardDescription>
              Modify your existing schedule by updating the title and
              description. Adjust the title to reflect any changes in focus and
              use the description to detail revised key events and timelines.
              Once your updates are complete, submit the form to keep your
              schedule current.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataForm
              isLoading={getScheduleQuery.isLoading}
              isFetching={getScheduleQuery.isFetching}
              isPlaceholderData={getScheduleQuery.isPlaceholderData}
              isPending={updateScheduleMutation.isPending}
              subject='schedule'
              values={
                getScheduleQuery.data
                  ? {
                      title: getScheduleQuery.data.title,
                      description: getScheduleQuery.data.description || '',
                    }
                  : undefined
              }
              onSubmit={(inputs) =>
                updateScheduleMutation.mutate({
                  projectId: params.projectId,
                  scheduleId: params.scheduleId,
                  ...inputs,
                })
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
