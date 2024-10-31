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
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { formatRelative } from 'date-fns'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { Pie, PieChart, Sector } from 'recharts'
import { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { useDocumentTitle } from 'usehooks-ts'

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

  const [isOpen, setIsOpen] = useState(false)
  const [projectId, setProjectId] = useState('')

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

  const { data: totals } = useQuery({
    queryKey: ['projects', projectId, 'subject'],
    queryFn: () =>
      Promise.all([
        getSchedules({ projectId }),
        getBoards({ projectId }),
        getNotes({ projectId }),
      ]),
    placeholderData: keepPreviousData,
    enabled: !!projectId,
    select: (subjects) => subjects.map((subject) => subject.total),
  })

  const projects = getProjectsQuery.data?.pages.flatMap((page) => page.content)

  // const hasTotals = !!(totals && totals.some((total) => total !== 0))

  return (
    <div className='flex flex-col gap-y-12'>
      <Card>
        <CardHeader>
          <CardTitle className='flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5'>
            <span className='truncate'>
              {greeting()}
              {user?.firstName && `, ${user.firstName}`} 👋
            </span>
            {user?.lastSignInAt && (
              <span className='text-xs font-normal text-muted-foreground'>
                Last signed in: {formatRelative(user.lastSignInAt, new Date())}
              </span>
            )}
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
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                className='w-full max-w-[13.625rem] justify-between'
                variant='outline'
                role='combobox'
                aria-expanded={isOpen}
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
                          setIsOpen(false)
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
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <ChartContainer
            className='mx-auto aspect-square max-h-60'
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
                nameKey='subject'
                dataKey='total'
                data={[
                  {
                    subject: 'schedules',
                    total: totals?.[0],
                    fill: '#fb923c',
                  },
                  {
                    subject: 'boards',
                    total: totals?.[1],
                    fill: '#c084fc',
                  },
                  { subject: 'notes', total: totals?.[2], fill: '#2dd4bf' },
                ]}
                blendStroke
                innerRadius={60}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <Sector {...props} outerRadius={outerRadius + 8} />
                )}
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className='flex-wrap gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <span className='block size-3 rounded bg-[#fb923c]' />
            <span className='text-sm text-muted-foreground'>Schedules</span>
          </div>
          <div className='flex items-center gap-x-2'>
            <span className='block size-3 rounded bg-[#c084fc]' />
            <span className='text-sm text-muted-foreground'>Boards</span>
          </div>
          <div className='flex items-center gap-x-2'>
            <span className='block size-3 rounded bg-[#2dd4bf]' />
            <span className='text-sm text-muted-foreground'>Notes</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
