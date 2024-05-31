import LoadingTableRows from '@/components/common/LoadingTableRows/LoadingTableRows'
import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../index.css'

const LoadingTableRowsWithHooks = (props: object) => {
  const table = useReactTable({
    data: [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
  })

  return <LoadingTableRows table={table} {...props} />
}

const meta: Meta<typeof LoadingTableRows> = {
  title: 'Common/LoadingTableRows',
  component: LoadingTableRowsWithHooks,
}

export default meta

type Story = StoryObj<typeof LoadingTableRows>

export const Primary: Story = {
  args: {},
}
