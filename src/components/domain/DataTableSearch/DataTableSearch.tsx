import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/modules/common'
import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'

interface DataTableSearchProps<Data> {
  table: Table<Data>
}

const DataTableSearch = <Data,>({ table }: DataTableSearchProps<Data>) => {
  const title = (table.getColumn('title')?.getFilterValue() as string) || ''

  return (
    <div className='relative flex w-full sm:max-w-sm'>
      <Input
        className='pr-12'
        placeholder='Search by title'
        value={title}
        onChange={(event) =>
          table.getColumn('title')?.setFilterValue(event.target.value)
        }
      />
      <Button
        className={cn(
          'absolute bottom-0 right-0 invisible flex-shrink-0',
          title && 'visible'
        )}
        size='icon'
        variant='ghost'
        onClick={() => table.getColumn('title')?.setFilterValue('')}
      >
        <X className='size-4' />
      </Button>
    </div>
  )
}

export default DataTableSearch
