import ColumnSelector from '@/components/common/Table/ColumnSelector/ColumnSelector'
import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../../index.css'

const ColumnSelectorWithHooks = (props: object) => {
  const table = useReactTable({
    data: [],
    columns: [{ id: 'title' }, { id: 'description' }, { id: 'createdAt' }],
    getCoreRowModel: getCoreRowModel(),
  })

  return <ColumnSelector table={table} {...props} />
}

const meta: Meta<typeof ColumnSelector> = {
  title: 'Common/Table/ColumnSelector',
  component: ColumnSelectorWithHooks,
}

export default meta

type Story = StoryObj<typeof ColumnSelector>

export const Primary: Story = {
  args: { dropdownMenuContentProps: { align: 'start' } },
}
