import { Project } from '@/types/project'
import type { Meta, StoryObj } from '@storybook/react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import '../../../../index.css'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'

const DeleteConfirmationDialogWithHooks = (props: object) => {
  const table = useReactTable<Project>({
    data: [
      {
        id: '1',
        createdAt: new Date().toISOString(),
        title: 'Project #1',
        description: '',
      },
    ],
    columns: [{ accessorKey: 'title' }],
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DeleteConfirmationDialog
      open
      rows={table.getRowModel().rows}
      subject='project'
      onConfirm={console.log}
      {...props}
    />
  )
}

const meta: Meta<typeof DeleteConfirmationDialog> = {
  title: 'Common/Table/DeleteConfirmationDialog',
  component: DeleteConfirmationDialogWithHooks,
}

export default meta

type Story = StoryObj<typeof DeleteConfirmationDialog>

export const Primary: Story = {
  args: { open: true, subject: 'project' },
}
