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
import { createNote } from '@/services/note'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'New Note'

export const Route = createFileRoute('/projects/$projectId/notes/new')({
  component: () => (
    <Protected>
      <NewNote />
    </Protected>
  ),
})

function NewNote() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const navigate = Route.useNavigate()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (note) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', params.projectId, 'notes'],
      })
      navigate({
        to: '/projects/$projectId/notes/$noteId',
        params: { projectId: params.projectId, noteId: note.id },
      })
      toast({
        title: 'Note created',
        description: `${note.title} has been successfully created`,
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
                  to='/projects/$projectId/notes'
                  params={{ projectId: params.projectId }}
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                >
                  Notes
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
              Create a new note by entering a title and description. Choose a
              title that captures the essence of your note, and use the
              description to elaborate on the key points or details. Once you're
              done, submit the form to save your note and keep your information
              organized.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataForm
              isPending={createNoteMutation.isPending}
              subject='note'
              onSubmit={(inputs) =>
                createNoteMutation.mutate({
                  projectId: params.projectId,
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
