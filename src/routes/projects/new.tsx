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
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/new')({
  component: () => (
    <Protected>
      <NewProject />
    </Protected>
  ),
})

function NewProject() {
  return (
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
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='flex flex-col gap-y-4'>
        <Heading3>New Project</Heading3>
        <Paragraph className='text-sm text-muted-foreground'>
          Kick off your new project by entering a title and description. Choose
          a title that captures the essence of your project and use the
          description to provide an overview of its objectives and key details.
          Once you're done, submit the form to get your project started.
        </Paragraph>
      </div>
    </div>
  )
}
