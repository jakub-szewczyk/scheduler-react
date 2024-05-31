import PaginationCapacity from '@/components/common/PaginationCapacity/PaginationCapacity'
import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../index.css'

const PaginationCapacityWithHooks = (props: object) => {
  const table = useReactTable({
    data: [],
    columns: [{ id: 'title' }, { id: 'description' }, { id: 'createdAt' }],
    getCoreRowModel: getCoreRowModel(),
  })

  return <PaginationCapacity table={table} {...props} />
}

const meta: Meta<typeof PaginationCapacity> = {
  title: 'Common/PaginationCapacity',
  component: PaginationCapacityWithHooks,
}

export default meta

type Story = StoryObj<typeof PaginationCapacity>

export const Primary: Story = {
  args: { sizes: [10, 20, 30, 50] },
}
