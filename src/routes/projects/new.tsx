import Protected from '@/components/common/Protected/Protected'
import DataForm from '@/components/domain/DataForm/DataForm'
import Heading3 from '@/components/typography/Heading3/Heading3'
import Paragraph from '@/components/typography/Paragraph/Paragraph'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useToast } from '@/components/ui/use-toast'
import { createProject } from '@/services/project'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'New Project'

export const Route = createFileRoute('/projects/new')({
  component: () => (
    <Protected>
      <NewProject />
    </Protected>
  ),
})

function NewProject() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const navigate = Route.useNavigate()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: (project) => {
      navigate({
        to: '/projects/$projectId',
        params: { projectId: project.id },
      })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast({
        title: 'Project created',
        description: `${project.title} has been successfully created`,
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
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Heading3>{pageTitle}</Heading3>
        <Paragraph className='text-sm text-muted-foreground'>
          Kick off your new project by entering a title and description. Choose
          a title that captures the essence of your project and use the
          description to provide an overview of its objectives and key details.
          Once you're done, submit the form to get your project started.
        </Paragraph>
      </div>
      <DataForm isPending={isPending} subject='project' onSubmit={mutate} />
    </div>
  )
}