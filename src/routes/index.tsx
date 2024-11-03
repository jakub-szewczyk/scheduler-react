import Protected from '@/components/common/Protected/Protected'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PAGE_SIZE, cn, greeting } from '@/modules/common'
import { getBoards } from '@/services/board'
import { getNotes } from '@/services/note'
import { getProjects } from '@/services/project'
import { getSchedules } from '@/services/schedule'
import { useUser } from '@clerk/clerk-react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Check,
  ChevronsUpDown,
  FolderSearch,
  Frown,
  LoaderCircle,
} from 'lucide-react'
import { useState } from 'react'
import { Pie, PieChart, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { match } from 'ts-pattern'
import {
  useBoolean,
  useDocumentTitle,
  useIntersectionObserver,
} from 'usehooks-ts'

const pageTitle = 'Dashboard'

export const Route = createFileRoute('/')({
  component: () => (
    <Protected>
      <Dashboard />
    </Protected>
  ),
})

function Dashboard() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const [projectId, setProjectId] = useState('')

  const {
    value: isProjectComboboxOpen,
    setValue: setIsProjectComboboxOpen,
    setFalse: closeProjectCombobox,
  } = useBoolean()

  const { user } = useUser()

  const getProjectsQuery = useInfiniteQuery({
    queryKey: ['projects', 'infinite'],
    queryFn: ({ pageParam }) =>
      getProjects({
        page: pageParam,
        size: PAGE_SIZE,
      }),
    getNextPageParam: (page) =>
      (page.page + 1) * page.size < page.total ? page.page + 1 : null,
    initialPageParam: 0,
  })

  // TODO: Handle searching
  const getSubjectsQuery = useQuery({
    queryKey: ['projects', projectId, 'subject'],
    queryFn: () =>
      Promise.all([
        getSchedules({ projectId }),
        getBoards({ projectId }),
        getNotes({ projectId }),
      ]),
    enabled: !!projectId,
    select: (subjects) => subjects.map((subject) => subject.total),
  })

  const { ref } = useIntersectionObserver({
    onChange: (isIntersecting) =>
      isIntersecting &&
      !getProjectsQuery.isFetching &&
      getProjectsQuery.fetchNextPage(),
  })

  const projects = getProjectsQuery.data?.pages.flatMap((page) => page.content)

  return (
    <div className='flex flex-col gap-y-12'>
      <Card>
        <CardHeader>
          <CardTitle>
            {greeting()}
            {user?.firstName && `, ${user.firstName}`} 👋
          </CardTitle>
          <CardDescription>
            Your projects await your brilliance. Dive into the creative process,
            explore new ideas, and watch your visions come to life. Embrace the
            possibilities ahead, and let’s turn today into a canvas for
            inspiration and accomplishment. Here’s to making strides and
            achieving your goals!
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className='lg:w-1/2 2xl:w-1/3'>
        <CardHeader>
          <CardTitle>Project Entries Count</CardTitle>
          <CardDescription>
            View the total number of schedules, boards, and notes associated
            with each project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Popover
            open={isProjectComboboxOpen}
            onOpenChange={setIsProjectComboboxOpen}
          >
            <PopoverTrigger asChild>
              <Button
                className='w-full max-w-[13.625rem] justify-between'
                variant='outline'
                role='combobox'
                aria-expanded={isProjectComboboxOpen}
              >
                {projectId ? (
                  <span className='truncate'>
                    {
                      projects?.find((project) => project.id === projectId)
                        ?.title
                    }
                  </span>
                ) : (
                  <span className='text-muted-foreground'>Select project</span>
                )}
                <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[13.625rem] p-0'>
              <Command>
                <CommandInput placeholder='Search project...' />
                <CommandList>
                  <CommandEmpty>No project found</CommandEmpty>
                  <CommandGroup>
                    {projects?.map((project) => (
                      <CommandItem
                        key={project.id}
                        value={project.id}
                        onSelect={(value) => {
                          setProjectId(value === projectId ? '' : value)
                          closeProjectCombobox()
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 size-4',
                            projectId === project.id
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {project.title}
                      </CommandItem>
                    ))}
                    {getProjectsQuery.hasNextPage && (
                      <CommandItem ref={ref}>
                        <LoaderCircle className='mx-auto size-4 animate-spin' />
                      </CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {!projectId ? (
            <div className='flex h-60 flex-col items-center justify-center gap-y-2'>
              <FolderSearch className='size-8 text-muted-foreground' />
              <span className='text-center text-sm text-muted-foreground'>
                Choose a project from the dropdown to display its entry counts
              </span>
            </div>
          ) : (
            match(getSubjectsQuery)
              .with({ status: 'pending' }, { status: 'error' }, () => (
                <div className='flex h-60 flex-col items-center justify-center gap-y-2'>
                  <LoaderCircle className='size-8 animate-spin text-muted-foreground' />
                  <span className='text-center text-sm text-muted-foreground'>
                    Loading...
                  </span>
                </div>
              ))
              .with({ status: 'success' }, ({ data: totals }) =>
                totals.every((total) => total === 0) ? (
                  <div className='flex h-60 flex-col items-center justify-center gap-y-2'>
                    <Frown className='size-8 text-muted-foreground' />
                    <span className='text-center text-sm text-muted-foreground'>
                      It looks like this project is empty. Start by adding{' '}
                      <Button className='h-fit p-0' variant='link' asChild>
                        <Link
                          to='/projects/$projectId/schedules/new'
                          params={{ projectId }}
                        >
                          schedules
                        </Link>
                      </Button>
                      ,{' '}
                      <Button className='h-fit p-0' variant='link' asChild>
                        <Link
                          to='/projects/$projectId/boards/new'
                          params={{ projectId }}
                        >
                          boards
                        </Link>
                      </Button>
                      , or{' '}
                      <Button className='h-fit p-0' variant='link' asChild>
                        <Link
                          to='/projects/$projectId/notes/new'
                          params={{ projectId }}
                        >
                          notes
                        </Link>
                      </Button>{' '}
                      to help you get started!
                    </span>
                  </div>
                ) : (
                  <ChartContainer
                    className='mx-auto aspect-square max-h-60 [&_svg]:overflow-visible'
                    config={{
                      schedules: { label: 'Schedules' },
                      boards: { label: 'Boards' },
                      notes: { label: 'Notes' },
                    }}
                  >
                    <PieChart>
                      {totals && (
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                      )}
                      <Pie
                        label
                        nameKey='subject'
                        dataKey='total'
                        data={[
                          ...(totals?.[0]
                            ? [
                                {
                                  subject: 'schedules',
                                  total: totals[0],
                                  fill: '#fb923c',
                                },
                              ]
                            : []),
                          ...(totals?.[1]
                            ? [
                                {
                                  subject: 'boards',
                                  total: totals[1],
                                  fill: '#c084fc',
                                },
                              ]
                            : []),
                          ...(totals?.[2]
                            ? [
                                {
                                  subject: 'notes',
                                  total: totals[2],
                                  fill: '#2dd4bf',
                                },
                              ]
                            : []),
                        ]}
                        blendStroke
                        innerRadius={60}
                        activeShape={ActiveShape}
                      />
                    </PieChart>
                  </ChartContainer>
                )
              )
              .exhaustive()
          )}
        </CardContent>
        <CardFooter className='flex-wrap gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <span className='block size-3 rounded bg-orange-400' />
            <span className='text-sm text-muted-foreground'>Schedules</span>
          </div>
          <div className='flex items-center gap-x-2'>
            <span className='block size-3 rounded bg-purple-400' />
            <span className='text-sm text-muted-foreground'>Boards</span>
          </div>
          <div className='flex items-center gap-x-2'>
            <span className='block size-3 rounded bg-teal-400' />
            <span className='text-sm text-muted-foreground'>Notes</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

const ActiveShape = ({ outerRadius = 0, ...props }: PieSectorDataItem) => (
  <Sector {...props} outerRadius={outerRadius + 8} />
)
