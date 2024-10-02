import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../../index.css'
import TableSearch from './TableSearch'

const TableSearchWithHooks = (props: object) => {
  const table = useReactTable({
    data: [],
    columns: [{ id: 'title' }, { id: 'description' }, { id: 'createdAt' }],
    getCoreRowModel: getCoreRowModel(),
  })
  return <TableSearch table={table} {...props} />
}

const meta: Meta<typeof TableSearch> = {
  title: 'Common/Table/TableSearch',
  component: TableSearchWithHooks,
}

export default meta

type Story = StoryObj<typeof TableSearch>

export const Primary: Story = {
  args: {},
}
