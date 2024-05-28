import DataTable from '@/components/layout/DataTable/DataTable'
import Heading3 from '@/components/layout/Heading3/Heading3'
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
      <DataTable
        isFetching={projectsQuery.isFetching}
        isPlaceholderData={projectsQuery.isPlaceholderData}
        data={projectsQuery.data?.content}
        pagination={{
          rowCount: projectsQuery.data?.total,
          pageIndex: search.page,
          pageSize: search.size,
          onPaginationChange: (updater) => {
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
