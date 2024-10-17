import Protected from '@/components/common/Protected/Protected'
import Kanban from '@/components/domain/Kanban/Kanban'
import KanbanSheet from '@/components/domain/Kanban/KanbanSheet/KanbanSheet'
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { createStatus } from '@/services/status'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CirclePlus } from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useBoolean, useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Statuses'

export const Route = createFileRoute(
  '/projects/$projectId/boards/$boardId/statuses/'
)({
  component: () => (
    <Protected>
      <Statuses />
    </Protected>
  ),
})

function Statuses() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const {
    value: isSheetOpen,
    setValue: setIsSheetOpen,
    setTrue: openSheet,
    setFalse: closeSheet,
  } = useBoolean()

  const params = Route.useParams()

  const { toast } = useToast()

  const queryClient = useQueryClient()

  const createStatusMutation = useMutation({
    mutationFn: createStatus,
    onSuccess: (status) => {
      queryClient.invalidateQueries({
        queryKey: [
          'projects',
          params.projectId,
          'boards',
          params.boardId,
          'statuses',
        ],
      })
      closeSheet()
      toast({
        title: 'Status created',
        description: `${status.title} has been successfully created`,
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
    <>
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
                    search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                    params={{ projectId: params.projectId }}
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
                    search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
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
                This page provides a clear overview of all project-related
                issues. Use the kanban board layout to track issue details,
                update their statuses, and add new ones to keep the project on
                track.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                className='w-full gap-x-2 sm:w-fit'
                type='button'
                variant='secondary'
                onClick={openSheet}
              >
                New Status <CirclePlus className='size-4' />
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Kanban />
      </div>
      <KanbanSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        isPending={createStatusMutation.isPending}
        type='create-status'
        onSubmit={(inputs) =>
          createStatusMutation.mutate({
            projectId: params.projectId,
            boardId: params.boardId,
            title: inputs.title,
            description: inputs.description,
          })
        }
      />
    </>
  )
}
