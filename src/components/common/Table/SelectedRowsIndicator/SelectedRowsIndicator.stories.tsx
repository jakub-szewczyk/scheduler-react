import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../../index.css'
import SelectedRowsIndicator from './SelectedRowsIndicator'

const SelectedRowsIndicatorWithHooks = (props: object) => {
  const table = useReactTable({
    data: Array(10).fill(null),
    columns: [],
    getCoreRowModel: getCoreRowModel(),
  })

  return <SelectedRowsIndicator table={table} {...props} />
}

const meta: Meta<typeof SelectedRowsIndicator> = {
  title: 'Common/Table/SelectedRowsIndicator',
  component: SelectedRowsIndicatorWithHooks,
}

export default meta

type Story = StoryObj<typeof SelectedRowsIndicator>

export const Primary: Story = {
  args: {},
}
