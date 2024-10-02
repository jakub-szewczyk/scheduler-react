import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../../index.css'
import Pagination from './Pagination'

const PaginationWithHooks = (props: object) => {
  const table = useReactTable({
    data: [],
    columns: [{ id: 'title' }, { id: 'description' }, { id: 'createdAt' }],
    getCoreRowModel: getCoreRowModel(),
  })

  return <Pagination table={table} {...props} />
}

const meta: Meta<typeof Pagination> = {
  title: 'Common/Table/Pagination/Pagination',
  component: PaginationWithHooks,
}

export default meta

type Story = StoryObj<typeof Pagination>

export const Primary: Story = {
  args: {},
}
