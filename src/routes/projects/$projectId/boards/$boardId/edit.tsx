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
import { getBoard, updateBoard } from '@/services/board'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Edit Board'

export const Route = createFileRoute(
  '/projects/$projectId/boards/$boardId/edit'
)({
  component: () => (
    <Protected>
      <EditBoard />
    </Protected>
  ),
})

function EditBoard() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const navigate = Route.useNavigate()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const getBoardQuery = useQuery({
    queryKey: ['projects', params.projectId, 'boards', params.boardId],
    queryFn: () =>
      getBoard({
        projectId: params.projectId,
        boardId: params.boardId,
      }),
  })

  const updateBoardMutation = useMutation({
    mutationFn: updateBoard,
    onSuccess: (board) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', params.projectId, 'boards'],
      })
      navigate({
        to: '/projects/$projectId/boards/$boardId',
        params: { projectId: params.projectId, boardId: board.id },
      })
      toast({
        title: 'Board updated',
        description: `${board.title} has been successfully updated`,
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
              <BreadcrumbLink asChild>
                <Link
                  to='/projects/$projectId/boards/$boardId'
                  params={{
                    projectId: params.projectId,
                    boardId: params.boardId,
                  }}
                >
                  Board Details
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
              Edit your board by updating its title and description. Adjust the
              title to better reflect the board's current purpose, and revise
              the description to accurately capture any new objectives or
              changes in the types of tasks it manages. Once you're done, submit
              the form to save your updates and keep your kanban board current.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataForm
              isLoading={getBoardQuery.isLoading}
              isFetching={getBoardQuery.isFetching}
              isPlaceholderData={getBoardQuery.isPlaceholderData}
              isPending={updateBoardMutation.isPending}
              subject='board'
              values={
                getBoardQuery.data
                  ? {
                      title: getBoardQuery.data.title,
                      description: getBoardQuery.data.description || '',
                    }
                  : undefined
              }
              onSubmit={(inputs) =>
                updateBoardMutation.mutate({
                  projectId: params.projectId,
                  boardId: params.boardId,
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
