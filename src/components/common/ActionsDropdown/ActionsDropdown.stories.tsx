import type { Meta, StoryObj } from '@storybook/react'
import { FileText, Pencil, Trash } from 'lucide-react'
import '../../../index.css'
import ActionsDropdown from './ActionsDropdown'

const meta: Meta<typeof ActionsDropdown> = {
  title: 'Common/ActionsDropdown',
  component: ActionsDropdown,
}

export default meta

type Story = StoryObj<typeof ActionsDropdown>

export const Primary: Story = {
  args: {
    items: [
      {
        children: (
          <div className='flex items-center justify-center gap-x-2'>
            <FileText className='size-4' />
            Details
          </div>
        ),
      },
      {
        children: (
          <div className='flex items-center justify-center gap-x-2'>
            <Pencil className='size-4' />
            Edit
          </div>
        ),
      },
      {
        children: (
          <div className='flex items-center justify-center gap-x-2 text-destructive'>
            <Trash className='size-4' />
            Delete
          </div>
        ),
      },
    ],
    buttonProps: { disabled: false },
    dropdownMenuContentProps: { align: 'start' },
  },
}
