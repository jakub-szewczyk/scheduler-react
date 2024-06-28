import Protected from '@/components/common/Protected/Protected'
import DataTable from '@/components/domain/DataTable/DataTable'
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
import { getBoards, getBoardsSearchParamsSchema } from '@/services/board'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CirclePlus } from 'lucide-react'
import { useDebounceValue, useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Boards'

export const Route = createFileRoute('/projects/$projectId/boards/')({
  component: () => (
    <Protected>
      <Boards />
    </Protected>
  ),
  validateSearch: getBoardsSearchParamsSchema,
})

function Boards() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const search = Route.useSearch()

  const navigate = Route.useNavigate()

  const [debouncedSearch] = useDebounceValue(search, 500)

  const query = {
    ...search,
    page:
      search.title === debouncedSearch.title
        ? search.page
        : debouncedSearch.page,
    title: debouncedSearch.title,
  }

  const getBoardsQuery = useQuery({
    queryKey: ['projects', params.projectId, 'boards', query],
    queryFn: () => getBoards({ projectId: params.projectId, ...query }),
    placeholderData: keepPreviousData,
  })

  return (
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
      <div className='flex flex-col gap-y-12'>
        <Card>
          <CardHeader>
            <CardTitle>{pageTitle}</CardTitle>
            <CardDescription>
              Welcome to your boards page. Here you can view and manage all your
              kanban boards seamlessly. Create new boards, edit existing ones,
              and remove those that are no longer relevant. Boards consist of
              status columns and issue rows, making it easy to track progress
              and organize tasks. Search by title and sort by creation date to
              keep everything tidy. Click on any board to see its full details
              and keep your projects on track.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className='w-full gap-x-2 sm:w-fit'
              variant='secondary'
              asChild
            >
              <Link
                to='/projects/$projectId/boards/new'
                params={{ projectId: params.projectId }}
              >
                New Board <CirclePlus className='size-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <DataTable
          isFetching={getBoardsQuery.isFetching}
          isPlaceholderData={getBoardsQuery.isPlaceholderData}
          subject='board'
          data={getBoardsQuery.data?.content}
          sorting={{
            state: [{ id: 'createdAt', desc: search.createdAt === 'DESC' }],
            onChange: ([{ desc }]) =>
              navigate({
                search: (search) => ({
                  ...search,
                  createdAt: !desc ? 'ASC' : 'DESC',
                }),
                replace: true,
              }),
          }}
          filtering={{
            state: [{ id: 'title', value: search.title }],
            onChange: (state) =>
              navigate({
                search: (search) => ({
                  ...search,
                  page: 0,
                  title: (state.at(0)?.value as string) || '',
                }),
                replace: true,
              }),
          }}
          pagination={{
            page: search.page,
            size: search.size,
            total: getBoardsQuery.data?.total,
            onChange: ({ page, size }) =>
              navigate({
                search: (search) => ({ ...search, page, size }),
                replace: true,
              }),
          }}
        />
      </div>
    </div>
  )
}
