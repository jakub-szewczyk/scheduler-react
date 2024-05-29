import DataTable from '@/components/domain/DataTable/DataTable'
import Heading3 from '@/components/layout/Heading3/Heading3'
import Paragraph from '@/components/layout/Paragraph/Paragraph'
import Protected from '@/components/layout/Protected/Protected'
import { getProjects, getProjectsSearchParamsSchema } from '@/services/project'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

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

  const projectsQuery = useQuery({
    queryKey: ['projects', search],
    queryFn: () => getProjects(search),
    placeholderData: keepPreviousData,
  })

  return (
    <div className='flex flex-col gap-y-4 sm:gap-y-6'>
      <Heading3>Projects</Heading3>
      <Paragraph className='text-sm text-muted-foreground'>
        Welcome to your project management page. View and manage all your
        projects effortlessly. Create new projects, edit existing ones, and
        delete those you no longer need. Easily search by title and sort by
        creation date to keep everything organized. Click on any project to see
        its full details.
      </Paragraph>
      <DataTable
        data={projectsQuery.data?.content}
        isFetching={projectsQuery.isFetching}
        isPlaceholderData={projectsQuery.isPlaceholderData}
        pagination={{
          page: search.page,
          size: search.size,
          total: projectsQuery.data?.total,
          onChange: (updater) => {
            if (typeof updater !== 'function') return
            const { pageIndex, pageSize } = updater({
              pageIndex: search.page,
              pageSize: search.size,
            })
            navigate({
              search: (search) => ({
                ...search,
                page: pageIndex,
                size: pageSize,
              }),
            })
          },
        }}
      />
    </div>
  )
}
