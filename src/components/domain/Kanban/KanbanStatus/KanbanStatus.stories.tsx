import StrictModeDroppable from '@/components/common/StrictModeDroppable/StrictModeDroppable'
import { Status } from '@/types/status'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ComponentProps } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import '../../../../index.css'
import KanbanStatus from './KanbanStatus'

const queryClient = new QueryClient()

const KanbanStatusWithHooks = (props: ComponentProps<typeof KanbanStatus>) => (
  <QueryClientProvider client={queryClient}>
    <DragDropContext onDragEnd={console.log}>
      <StrictModeDroppable
        droppableId='board'
        type='board'
        direction='horizontal'
      >
        {({ innerRef, placeholder, droppableProps }) => (
          <div
            className='flex overflow-auto'
            ref={innerRef}
            {...droppableProps}
          >
            <KanbanStatus {...props} />
            {placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  </QueryClientProvider>
)

const meta: Meta<typeof KanbanStatus> = {
  title: 'Domain/KanbanStatus',
  component: KanbanStatusWithHooks,
}

export default meta

type Story = StoryObj<typeof KanbanStatus>

const STATUS: Status = {
  id: '1',
  title: 'Status #1',
  description:
    'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
  createdAt: new Date().toISOString(),
}

export const Primary: Story = {
  args: {
    className: 'w-[350px] flex-shrink-0',
    status: 'success',
    ...STATUS,
  },
}

export const Pending: Story = {
  args: {
    className: 'w-[350px] flex-shrink-0',
    status: 'pending',
    ...STATUS,
  },
}
