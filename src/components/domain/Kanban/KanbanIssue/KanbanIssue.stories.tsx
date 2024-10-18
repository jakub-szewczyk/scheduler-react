import StrictModeDroppable from '@/components/common/StrictModeDroppable/StrictModeDroppable'
import { Issue } from '@/types/issue'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ComponentProps } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import '../../../../index.css'
import KanbanIssue from './KanbanIssue'

const queryClient = new QueryClient()

const KanbanIssueWithHooks = (props: ComponentProps<typeof KanbanIssue>) => (
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
            <KanbanIssue {...props} />
            {placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  </QueryClientProvider>
)

const meta: Meta<typeof KanbanIssue> = {
  title: 'Domain/KanbanIssue',
  component: KanbanIssueWithHooks,
}

export default meta

type Story = StoryObj<typeof KanbanIssue>

const ISSUE: Issue = {
  id: '1',
  createdAt: new Date().toISOString(),
  title: 'Issue #1',
  description:
    'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.',
  priority: 'MEDIUM',
}

export const Primary: Story = {
  args: {
    className: 'w-[350px] flex-shrink-0',
    status: 'success',
    ...ISSUE,
  },
}

export const Pending: Story = {
  args: {
    className: 'w-[350px] flex-shrink-0',
    status: 'pending',
    ...ISSUE,
  },
}
