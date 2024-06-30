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
import { getNote, updateNote } from '@/services/note'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Edit Note'

export const Route = createFileRoute('/projects/$projectId/notes/$noteId/edit')(
  {
    component: () => (
      <Protected>
        <EditNote />
      </Protected>
    ),
  }
)

function EditNote() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const navigate = Route.useNavigate()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const getNoteQuery = useQuery({
    queryKey: ['projects', params.projectId, 'notes', params.noteId],
    queryFn: () =>
      getNote({
        projectId: params.projectId,
        noteId: params.noteId,
      }),
  })

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: (note) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', params.projectId, 'notes'],
      })
      navigate({
        to: '/projects/$projectId/notes/$noteId',
        params: { projectId: params.projectId, noteId: note.id },
      })
      toast({
        title: 'Note updated',
        description: `${note.title} has been successfully updated`,
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
              <BreadcrumbLink asChild>
                <Link
                  to='/projects/$projectId/notes/$noteId'
                  params={{
                    projectId: params.projectId,
                    noteId: params.noteId,
                  }}
                >
                  Note Details
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
              Edit your note by updating its title and description. Adjust the
              title to better reflect the note's content, and revise the
              description to include any new details or changes. Once you're
              done, submit the form to save your updates and keep your notes
              current.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataForm
              isLoading={getNoteQuery.isLoading}
              isFetching={getNoteQuery.isFetching}
              isPlaceholderData={getNoteQuery.isPlaceholderData}
              isPending={updateNoteMutation.isPending}
              subject='note'
              values={
                getNoteQuery.data
                  ? {
                      title: getNoteQuery.data.title,
                      description: getNoteQuery.data.description || '',
                    }
                  : undefined
              }
              onSubmit={(inputs) =>
                updateNoteMutation.mutate({
                  projectId: params.projectId,
                  noteId: params.noteId,
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
