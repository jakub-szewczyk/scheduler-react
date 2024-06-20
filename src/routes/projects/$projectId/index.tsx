import Protected from '@/components/common/Protected/Protected'
import Heading3 from '@/components/typography/Heading3/Heading3'
import Paragraph from '@/components/typography/Paragraph/Paragraph'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getProject } from '@/services/project'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
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

  const { data } = useQuery({
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
        <Heading3>{pageTitle}</Heading3>
        <Paragraph className='text-sm text-muted-foreground'>
          {JSON.stringify(data, null, 2)}
        </Paragraph>
      </div>
    </div>
  )
}
