import DataTable from '@/components/layout/DataTable/DataTable'
import Heading3 from '@/components/layout/Heading3/Heading3'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
  component: Projects,
})

function Projects() {
  return (
    <div className='flex flex-col gap-y-4 sm:gap-y-6'>
      <Heading3>Projects</Heading3>
      <DataTable />
    </div>
  )
}
