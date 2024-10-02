import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../../../index.css'
import PaginationControls from './PaginationControls'

const PaginationControlsWithHooks = (props: object) => {
  const table = useReactTable({
    data: [],
    columns: [{ id: 'title' }, { id: 'description' }, { id: 'createdAt' }],
    getCoreRowModel: getCoreRowModel(),
  })

  return <PaginationControls table={table} {...props} />
}

const meta: Meta<typeof PaginationControls> = {
  title: 'Common/Table/Pagination/PaginationControls',
  component: PaginationControlsWithHooks,
}

export default meta

type Story = StoryObj<typeof PaginationControls>

export const Primary: Story = {
  args: {},
}
