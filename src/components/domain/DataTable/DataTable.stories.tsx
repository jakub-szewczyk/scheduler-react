import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../../../index.css'
import DataTable from './DataTable'

const queryClient = new QueryClient()

const DataTableWithHooks = (props: object) => (
  <QueryClientProvider client={queryClient}>
    <DataTable
      subject='project'
      data={[]}
      sorting={{
        state: [{ id: 'createdAt', desc: true }],
        onChange: () => {},
      }}
      filtering={{
        state: [{ id: 'title', value: '' }],
        onChange: () => {},
      }}
      pagination={{
        page: 0,
        size: 10,
        total: 100,
        onChange: () => {},
      }}
      {...props}
    />
  </QueryClientProvider>
)

const meta: Meta<typeof DataTable> = {
  title: 'Domain/DataTable',
  component: DataTableWithHooks,
}

export default meta

type Story = StoryObj<typeof DataTable>

export const Primary: Story = {
  args: {
    subject: 'project',
    data: Array(10)
      .fill(null)
      .map((_, index) => ({
        id: index.toString(),
        title: `Project #${index + 1}`,
        description: null,
        createdAt: new Date().toISOString(),
      })),
    sorting: {
      state: [{ id: 'createdAt', desc: true }],
      onChange: () => {},
    },
    filtering: {
      state: [{ id: 'title', value: '' }],
      onChange: () => {},
    },
    pagination: {
      page: 0,
      size: 10,
      total: 100,
      onChange: () => {},
    },
  },
}

export const Empty: Story = {
  args: {
    subject: 'project',
    data: [],
    sorting: {
      state: [{ id: 'createdAt', desc: true }],
      onChange: () => {},
    },
    filtering: {
      state: [{ id: 'title', value: '' }],
      onChange: () => {},
    },
    pagination: {
      page: 0,
      size: 10,
      total: 0,
      onChange: () => {},
    },
  },
}
