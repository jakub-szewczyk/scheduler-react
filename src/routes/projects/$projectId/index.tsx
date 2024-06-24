import Protected from '@/components/common/Protected/Protected'
import DataTabContent from '@/components/domain/DataTabContent/DataTabContent'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, toDateFormat } from '@/modules/common'
import { getProject } from '@/services/project'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Calendar, Columns3, FileText, Pencil, StickyNote } from 'lucide-react'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Project Details'

export const Route = createFileRoute('/projects/$projectId/')({
  component: () => (
    <Protected>
      <ProjectDetails />
    </Protected>
  ),
})

function ProjectDetails() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const projectQuery = useQuery({
    queryKey: ['projects', params.projectId],
    queryFn: () => getProject(params.projectId),
  })

  return (
    <div className='flex flex-col gap-y-12'>
      <div className='flex flex-col gap-y-4'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to='/projects'
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                >
                  Projects
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader>
            <CardTitle>{pageTitle}</CardTitle>
            <CardDescription>
              View your project's title, description, and creation date. Easily
              navigate to the edit page for updates. Additionally, this screen
              should serve you as a gateway to manage schedules, boards and
              notes, keeping your project organized and efficient from a single,
              streamlined hub.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className='w-full gap-x-2 sm:w-fit'
              variant='secondary'
              asChild
            >
              <Link
                to='/projects/$projectId/edit'
                params={{ projectId: params.projectId }}
              >
                Edit Project <Pencil className='size-4' />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Tabs defaultValue='details'>
        <TabsList>
          <TabsTrigger className='gap-x-2' value='details'>
            Details <FileText className='size-4' />
          </TabsTrigger>
          <TabsTrigger className='gap-x-2' value='schedules'>
            Schedules <Calendar className='size-4' />
          </TabsTrigger>
          <TabsTrigger className='gap-x-2' value='boards'>
            Boards <Columns3 className='size-4' />
          </TabsTrigger>
          <TabsTrigger className='gap-x-2' value='notes'>
            Notes <StickyNote className='size-4' />
          </TabsTrigger>
        </TabsList>
        <TabsContent value='details'>
          <Card>
            <CardContent className='pt-6 text-sm'>
              <dl
                className={cn(
                  'space-y-4',
                  projectQuery.isFetching &&
                    !projectQuery.isPlaceholderData &&
                    'opacity-50'
                )}
              >
                <div className='text-muted-foreground'>
                  <dt className='font-bold'>Created at</dt>
                  <dd>
                    {projectQuery.isLoading ? (
                      <Skeleton className='max-w-xs h-5' />
                    ) : (
                      projectQuery.data?.createdAt &&
                      toDateFormat(projectQuery.data.createdAt)
                    )}
                  </dd>
                </div>
                <div>
                  <dt className='font-bold'>Title</dt>
                  <dd>
                    {projectQuery.isLoading ? (
                      <Skeleton className='max-w-screen-sm h-5' />
                    ) : (
                      projectQuery.data?.title
                    )}
                  </dd>
                </div>
                {projectQuery.isLoading ? (
                  <div>
                    <dt className='font-bold'>Description</dt>
                    <Skeleton className='h-10' />
                  </div>
                ) : (
                  projectQuery.data?.description && (
                    <div>
                      <dt className='font-bold'>Description</dt>
                      <dd>{projectQuery.data.description}</dd>
                    </div>
                  )
                )}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='schedules'>
          <Card>
            <CardContent className='pt-6 text-sm'>
              <DataTabContent subject='schedule' />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='boards'>
          <Card>
            <CardContent className='pt-6 text-sm'>
              <DataTabContent subject='board' />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='notes'>
          <Card>
            <CardContent className='pt-6 text-sm'>
              <DataTabContent subject='note' />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
