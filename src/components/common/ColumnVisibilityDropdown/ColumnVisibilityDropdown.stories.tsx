import ColumnVisibilityDropdown from '@/components/common/ColumnVisibilityDropdown/ColumnVisibilityDropdown'
import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../index.css'

const ColumnVisibilityDropdownWithHooks = (props: object) => {
  const table = useReactTable({
    data: [],
    columns: [{ id: 'title' }, { id: 'description' }, { id: 'createdAt' }],
    getCoreRowModel: getCoreRowModel(),
  })

  return <ColumnVisibilityDropdown table={table} {...props} />
}

const meta: Meta<typeof ColumnVisibilityDropdown> = {
  title: 'Common/ColumnVisibilityDropdown',
  component: ColumnVisibilityDropdownWithHooks,
}

export default meta

type Story = StoryObj<typeof ColumnVisibilityDropdown>

export const Primary: Story = {
  args: { dropdownMenuContentProps: { align: 'start' } },
}
