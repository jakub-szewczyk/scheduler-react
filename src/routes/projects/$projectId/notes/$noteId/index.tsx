import Protected from '@/components/common/Protected/Protected'
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
import { getNote } from '@/services/note'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { FileText, FileType2, Pencil } from 'lucide-react'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Note Details'

export const Route = createFileRoute('/projects/$projectId/notes/$noteId/')({
  component: () => (
    <Protected>
      <NoteDetails />
    </Protected>
  ),
})

function NoteDetails() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

  const getNoteQuery = useQuery({
    queryKey: ['projects', params.projectId, 'notes', params.noteId],
    queryFn: () =>
      getNote({
        projectId: params.projectId,
        noteId: params.noteId,
      }),
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
              <BreadcrumbLink asChild>
                <Link
                  to='/projects/$projectId'
                  params={{ projectId: params.projectId }}
                >
                  Project Details
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to='/projects/$projectId/notes'
                  search={{ page: 0, size: 10, title: '', createdAt: 'DESC' }}
                  params={{ projectId: params.projectId }}
                >
                  Notes
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
              Review the detailed information about the selected note, including
              its creation date, title, and content. Use the options below to
              make edits or open the WYSIWYG editor to view and modify the
              note's content.
            </CardDescription>
          </CardHeader>
          <CardFooter className='flex-col gap-2 sm:flex-row'>
            <Button
              className='w-full gap-x-2 sm:w-fit'
              variant='outline'
              asChild
            >
              <Link
                to='/projects/$projectId/notes/$noteId/editor'
                params={{
                  projectId: params.projectId,
                  noteId: params.noteId,
                }}
              >
                Go to Editor <FileType2 className='size-4' />
              </Link>
            </Button>
            <Button
              className='w-full gap-x-2 sm:w-fit'
              variant='secondary'
              asChild
            >
              <Link
                to='/projects/$projectId/notes/$noteId/edit'
                params={{
                  projectId: params.projectId,
                  noteId: params.noteId,
                }}
              >
                Edit Note <Pencil className='size-4' />
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
        </TabsList>
        <TabsContent value='details'>
          <Card>
            <CardContent className='pt-6 text-sm'>
              <dl
                className={cn(
                  'space-y-4',
                  getNoteQuery.isFetching &&
                    !getNoteQuery.isPlaceholderData &&
                    'opacity-50'
                )}
              >
                <div className='text-muted-foreground'>
                  <dt className='font-bold'>Created at</dt>
                  <dd>
                    {getNoteQuery.isLoading ? (
                      <Skeleton className='h-5 max-w-xs' />
                    ) : (
                      getNoteQuery.data?.createdAt &&
                      toDateFormat(getNoteQuery.data.createdAt)
                    )}
                  </dd>
                </div>
                <div>
                  <dt className='font-bold'>Title</dt>
                  <dd>
                    {getNoteQuery.isLoading ? (
                      <Skeleton className='h-5 max-w-screen-sm' />
                    ) : (
                      getNoteQuery.data?.title
                    )}
                  </dd>
                </div>
                {getNoteQuery.isLoading ? (
                  <div>
                    <dt className='font-bold'>Description</dt>
                    <Skeleton className='h-10' />
                  </div>
                ) : (
                  getNoteQuery.data?.description && (
                    <div>
                      <dt className='font-bold'>Description</dt>
                      <dd>{getNoteQuery.data.description}</dd>
                    </div>
                  )
                )}
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
