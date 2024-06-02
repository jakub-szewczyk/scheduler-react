import LoadingRows from '@/components/common/Table/LoadingRows/LoadingRows'
import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../../index.css'

const LoadingRowsWithHooks = (props: object) => {
  const table = useReactTable({
    data: [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
  })

  return <LoadingRows table={table} {...props} />
}

const meta: Meta<typeof LoadingRows> = {
  title: 'Common/Table/LoadingRows',
  component: LoadingRowsWithHooks,
}

export default meta

type Story = StoryObj<typeof LoadingRows>

export const Primary: Story = {
  args: {},
}
