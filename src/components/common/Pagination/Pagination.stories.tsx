import Pagination from '@/components/common/Pagination/Pagination'
import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../index.css'

const PaginationWithHooks = (props: object) => {
  const table = useReactTable({
    data: [],
    columns: [{ id: 'title' }, { id: 'description' }, { id: 'createdAt' }],
    getCoreRowModel: getCoreRowModel(),
  })

  return <Pagination table={table} {...props} />
}

const meta: Meta<typeof Pagination> = {
  title: 'Common/Pagination/Pagination',
  component: PaginationWithHooks,
}

export default meta

type Story = StoryObj<typeof Pagination>

export const Primary: Story = {
  args: {},
}
