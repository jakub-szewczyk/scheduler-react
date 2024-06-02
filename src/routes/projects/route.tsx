import Protected from '@/components/common/Protected/Protected'
import DataTable from '@/components/domain/DataTable/DataTable'
import Heading3 from '@/components/typography/Heading3/Heading3'
import Paragraph from '@/components/typography/Paragraph/Paragraph'
import { Button } from '@/components/ui/button'
import { getProjects, getProjectsSearchParamsSchema } from '@/services/project'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CirclePlus } from 'lucide-react'
import { useDebounceValue } from 'usehooks-ts'

export const Route = createFileRoute('/projects')({
  component: () => (
    <Protected>
      <Projects />
    </Protected>
  ),
  validateSearch: getProjectsSearchParamsSchema,
})

function Projects() {
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
      <div className='flex flex-col gap-y-4'>
        <Heading3>Projects</Heading3>
        <Paragraph className='text-sm text-muted-foreground'>
          Welcome to your project management page. View and manage all your
          projects effortlessly. Create new projects, edit existing ones, and
          delete those you no longer need. Easily search by title and sort by
          creation date to keep everything organized. Click on any project to
          see its full details.
        </Paragraph>
        <Button className='gap-x-2 sm:w-fit' size='sm' variant='outline'>
          New Project <CirclePlus className='w-4 h-4' />
        </Button>
      </div>
      <DataTable
        isFetching={projectsQuery.isFetching}
        isPlaceholderData={projectsQuery.isPlaceholderData}
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
                title: state.at(0)?.value || '',
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
