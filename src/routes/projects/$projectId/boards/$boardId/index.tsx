import Protected from '@/components/common/Protected/Protected'
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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, toDateFormat } from '@/modules/common'
import { getBoard } from '@/services/board'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { FileText, Pencil, SquareKanban } from 'lucide-react'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Board Details'

export const Route = createFileRoute('/projects/$projectId/boards/$boardId/')({
  component: () => (
    <Protected>
      <BoardDetails />
    </Protected>
  ),
})

function BoardDetails() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const getBoardQuery = useQuery({
    queryKey: ['projects', params.projectId, 'boards', params.boardId],
    queryFn: () =>
      getBoard({
        projectId: params.projectId,
        boardId: params.boardId,
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
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                  params={{ projectId: params.projectId }}
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
              Review the detailed information about the selected board,
              including its creation date, title, and description. Use the
              options below to make edits or view the kanban board to see
              associated issues and their statuses.
            </CardDescription>
          </CardHeader>
          <CardFooter className='flex-col gap-2 sm:flex-row'>
            <Button
              className='w-full gap-x-2 sm:w-fit'
              variant='outline'
              asChild
            >
              <Link
                to='/projects/$projectId/boards/$boardId/statuses'
                search={{
                  page: 0,
                  size: 10,
                  title: '',
                  createdAt: 'DESC',
                }}
                params={{
                  projectId: params.projectId,
                  boardId: params.boardId,
                }}
              >
                Open Kanban <SquareKanban className='size-4' />
              </Link>
            </Button>
            <Button
              className='w-full gap-x-2 sm:w-fit'
              variant='secondary'
              asChild
            >
              <Link
                to='/projects/$projectId/boards/$boardId/edit'
                params={{
                  projectId: params.projectId,
                  boardId: params.boardId,
                }}
              >
                Edit Board <Pencil className='size-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Tabs defaultValue='details'>
        <TabsList>
          <TabsTrigger className='gap-x-2' value='details'>
            Details <FileText className='size-4' />
          </TabsTrigger>
        </TabsList>
        <TabsContent value='details'>
          <Card>
            <CardContent className='pt-6 text-sm'>
              <dl
                className={cn(
                  'space-y-4',
                  getBoardQuery.isFetching &&
                    !getBoardQuery.isPlaceholderData &&
                    'opacity-50'
                )}
              >
                <div className='text-muted-foreground'>
                  <dt className='font-bold'>Created at</dt>
                  <dd>
                    {getBoardQuery.isLoading ? (
                      <Skeleton className='h-5 max-w-xs' />
                    ) : (
                      getBoardQuery.data?.createdAt &&
                      toDateFormat(getBoardQuery.data.createdAt)
                    )}
                  </dd>
                </div>
                <div>
                  <dt className='font-bold'>Title</dt>
                  <dd>
                    {getBoardQuery.isLoading ? (
                      <Skeleton className='h-5 max-w-screen-sm' />
                    ) : (
                      getBoardQuery.data?.title
                    )}
                  </dd>
                </div>
                {getBoardQuery.isLoading ? (
                  <div>
                    <dt className='font-bold'>Description</dt>
                    <Skeleton className='h-10' />
                  </div>
                ) : (
                  getBoardQuery.data?.description && (
                    <div>
                      <dt className='font-bold'>Description</dt>
                      <dd>{getBoardQuery.data.description}</dd>
                    </div>
                  )
                )}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
