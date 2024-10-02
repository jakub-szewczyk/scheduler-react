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
import { createBoard } from '@/services/board'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'New Board'

export const Route = createFileRoute('/projects/$projectId/boards/new')({
  component: () => (
    <Protected>
      <NewBoard />
    </Protected>
  ),
})

function NewBoard() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const navigate = Route.useNavigate()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const createBoardMutation = useMutation({
    mutationFn: createBoard,
    onSuccess: (board) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', params.projectId, 'boards'],
      })
      navigate({
        to: '/projects/$projectId/boards/$boardId',
        params: { projectId: params.projectId, boardId: board.id },
      })
      toast({
        title: 'Board created',
        description: `${board.title} has been successfully created`,
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
                  to='/projects/$projectId/boards'
                  params={{ projectId: params.projectId }}
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                >
                  Boards
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
              Set up your new board by entering a title and description. Choose
              a title that reflects the purpose of your board and use the
              description to detail its objectives and the types of tasks it
              will manage. Once you're done, submit the form to create your
              kanban board and start organizing your tasks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataForm
              isPending={createBoardMutation.isPending}
              subject='board'
              onSubmit={(inputs) =>
                createBoardMutation.mutate({
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
