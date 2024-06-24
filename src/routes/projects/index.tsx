import Protected from '@/components/common/Protected/Protected'
import DataTable from '@/components/domain/DataTable/DataTable'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getProjects, getProjectsSearchParamsSchema } from '@/services/project'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CirclePlus } from 'lucide-react'
import { useDebounceValue, useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Projects'

export const Route = createFileRoute('/projects/')({
  component: () => (
    <Protected>
      <Projects />
    </Protected>
  ),
  validateSearch: getProjectsSearchParamsSchema,
})

function Projects() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

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

  const projectsQuery = useQuery({
    queryKey: ['projects', query],
    queryFn: () => getProjects(query),
    placeholderData: keepPreviousData,
  })

  return (
    <div className='flex flex-col gap-y-12'>
      <Card>
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
          <CardDescription>
            Welcome to your project management page. View and manage all your
            projects effortlessly. Create new projects, edit existing ones, and
            delete those you no longer need. Easily search by title and sort by
            creation date to keep everything organized. Click on any project to
            see its full details.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className='w-full gap-x-2 sm:w-fit'
            variant='secondary'
            asChild
          >
            <Link to='/projects/new'>
              New Project <CirclePlus className='size-4' />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <DataTable
        isFetching={projectsQuery.isFetching}
        isPlaceholderData={projectsQuery.isPlaceholderData}
        subject='project'
        data={projectsQuery.data?.content}
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
          total: projectsQuery.data?.total,
          onChange: ({ page, size }) =>
            navigate({
              search: (search) => ({ ...search, page, size }),
              replace: true,
            }),
        }}
      />
    </div>
  )
}
