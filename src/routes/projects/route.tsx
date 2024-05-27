import DataTable from '@/components/layout/DataTable/DataTable'
import Heading3 from '@/components/layout/Heading3/Heading3'
import {
  getProjectsQueryOptions,
  getProjectsSearchParamsSchema,
} from '@/services/project'
import { RedirectToSignIn } from '@clerk/clerk-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useSearch } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
  component: Projects,
  validateSearch: getProjectsSearchParamsSchema,
  loaderDeps: ({ search }) => search,
  beforeLoad: ({ context }) => {
    if (!context.isSignedIn) throw new Error('unauthorized')
  },
  errorComponent: (props) =>
    props.error.message === 'unauthorized' ? <RedirectToSignIn /> : null,
  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(
      getProjectsQueryOptions(opts.deps)
    ),
})

function Projects() {
  const search = useSearch({ from: '/projects' })

  const suspenseQuery = useSuspenseQuery(getProjectsQueryOptions(search))

  console.log('suspenseQuery', suspenseQuery)

  return (
    <div className='flex flex-col gap-y-4 sm:gap-y-6'>
      <Heading3>Projects</Heading3>
      <DataTable />
    </div>
  )
}
