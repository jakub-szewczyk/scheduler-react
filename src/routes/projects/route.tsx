import DataTable from '@/components/layout/DataTable/DataTable'
import Heading3 from '@/components/layout/Heading3/Heading3'
import {
  getProjectsQueryOptions,
  getProjectsSearchParamsSchema,
} from '@/services/project'
import { useAuth } from '@clerk/clerk-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
  component: Projects,
  validateSearch: getProjectsSearchParamsSchema,
  loaderDeps: ({ search }) => search,
  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(
      getProjectsQueryOptions(opts.context.getToken, opts.deps)
    ),
})

function Projects() {
  const search = useSearch({ from: '/projects' })

  const { getToken } = useAuth()

  const suspenseQuery = useSuspenseQuery(
    getProjectsQueryOptions(getToken, search)
  )

  console.log('suspenseQuery', suspenseQuery)

  return (
    <div className='flex flex-col gap-y-4 sm:gap-y-6'>
      <Heading3>Projects</Heading3>
      <DataTable />
    </div>
  )
}
