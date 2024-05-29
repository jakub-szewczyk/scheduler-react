import DataTable from '@/components/domain/DataTable/DataTable'
import Heading3 from '@/components/common/Heading3/Heading3'
import Paragraph from '@/components/common/Paragraph/Paragraph'
import Protected from '@/components/common/Protected/Protected'
import { Button } from '@/components/ui/button'
import { getProjects, getProjectsSearchParamsSchema } from '@/services/project'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CirclePlus } from 'lucide-react'

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
