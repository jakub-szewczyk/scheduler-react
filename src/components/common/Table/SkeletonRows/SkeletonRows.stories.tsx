import SkeletonRows from '@/components/common/Table/SkeletonRows/SkeletonRows'
import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../../index.css'

const SkeletonRowsWithHooks = (props: object) => {
  const table = useReactTable({
    data: [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
  })

  return <SkeletonRows table={table} {...props} />
}

const meta: Meta<typeof SkeletonRows> = {
  title: 'Common/Table/SkeletonRows',
  component: SkeletonRowsWithHooks,
}

export default meta

type Story = StoryObj<typeof SkeletonRows>

export const Primary: Story = {
  args: {},
}
