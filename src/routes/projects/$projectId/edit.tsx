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
import { getProject, updateProject } from '@/services/project'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Edit Project'

export const Route = createFileRoute('/projects/$projectId/edit')({
  component: () => (
    <Protected>
      <EditProject />
    </Protected>
  ),
})

function EditProject() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const navigate = Route.useNavigate()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const getProjectQuery = useQuery({
    queryKey: ['projects', params.projectId],
    queryFn: () => getProject(params.projectId),
  })

  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate({
        to: '/projects/$projectId',
        params: { projectId: project.id },
      })
      toast({
        title: 'Project updated',
        description: `${project.title} has been successfully updated`,
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
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader>
            <CardTitle>{pageTitle}</CardTitle>
            <CardDescription>
              Update your project details by modifying the title and
              description. Ensure the title accurately represents your project's
              current direction and use the description to highlight new goals,
              progress, and essential information. Once you've made your edits,
              submit the form to keep your project information up-to-date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataForm
              isLoading={getProjectQuery.isLoading}
              isFetching={getProjectQuery.isFetching}
              isPlaceholderData={getProjectQuery.isPlaceholderData}
              isPending={updateProjectMutation.isPending}
              subject='project'
              values={
                getProjectQuery.data
                  ? {
                      title: getProjectQuery.data.title,
                      description: getProjectQuery.data.description || '',
                    }
                  : undefined
              }
              onSubmit={(inputs) =>
                updateProjectMutation.mutate({
                  id: params.projectId,
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
