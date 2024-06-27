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
import {
  getSchedules,
  getSchedulesSearchParamsSchema,
} from '@/services/schedule'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CirclePlus } from 'lucide-react'
import { useDebounceValue, useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Schedules'

export const Route = createFileRoute('/projects/$projectId/schedules/')({
  component: () => (
    <Protected>
      <Schedules />
    </Protected>
  ),
  validateSearch: getSchedulesSearchParamsSchema,
})

function Schedules() {
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

  const schedulesQuery = useQuery({
    queryKey: ['projects', params.projectId, 'schedules', query],
    queryFn: () => getSchedules({ projectId: params.projectId, ...query }),
    placeholderData: keepPreviousData,
  })

  return (
    <div className='flex flex-col gap-y-12'>
      <Card>
        <CardHeader>
          <CardTitle>{pageTitle}</CardTitle>
          {/* TODO: Change description */}
          <CardDescription>
            Welcome to your schedules page. Effortlessly view and manage all
            your schedules in one place. Create new schedules, edit existing
            ones, and delete those you no longer need. Schedules are composed of
            events that can be timed and organized to suit your needs. Use the
            search function to find schedules by title and sort them by creation
            date for better organization. Click on any schedule to see its full
            details and manage your events effectively.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            className='w-full gap-x-2 sm:w-fit'
            variant='secondary'
            asChild
          >
            <Link
              to='/projects/$projectId/schedules/new'
              params={{ projectId: params.projectId }}
            >
              New Schedule <CirclePlus className='size-4' />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <DataTable
        isFetching={schedulesQuery.isFetching}
        isPlaceholderData={schedulesQuery.isPlaceholderData}
        subject='schedule'
        data={schedulesQuery.data?.content}
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
          total: schedulesQuery.data?.total,
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
