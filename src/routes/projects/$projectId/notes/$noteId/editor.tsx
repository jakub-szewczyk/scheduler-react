import Protected from '@/components/common/Protected/Protected'
import WYSIWYGEditor from '@/components/domain/WYSIWYGEditor/WYSIWYGEditor'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link, createFileRoute } from '@tanstack/react-router'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useDocumentTitle } from 'usehooks-ts'

const pageTitle = 'Editor'

export const Route = createFileRoute(
  '/projects/$projectId/notes/$noteId/editor'
)({
  component: () => (
    <Protected>
      <Editor />
    </Protected>
  ),
})

function Editor() {
  useDocumentTitle(`Scheduler - ${pageTitle}`)

  const params = Route.useParams()

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
              <BreadcrumbLink asChild>
                <Link
                  to='/projects/$projectId/notes/$noteId'
                  params={{
                    projectId: params.projectId,
                    noteId: params.noteId,
                  }}
                >
                  Note Details
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
              This page provides a clear overview of all project-related issues.
              Use the kanban board layout to track issue details, update their
              statuses, and add new ones to keep the project on track.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <WYSIWYGEditor />
    </div>
  )
}
