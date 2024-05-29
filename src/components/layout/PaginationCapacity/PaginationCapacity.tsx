import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table } from '@tanstack/react-table'

interface PaginationCapacityProps<Data> {
  table: Table<Data>
  sizes?: number[]
}

const PaginationCapacity = <Data,>({
  table,
  sizes = [10, 20, 50, 100],
}: PaginationCapacityProps<Data>) => (
  <div className='flex items-center gap-x-2'>
    <p className='hidden text-sm text-muted-foreground whitespace-nowrap md:block'>
      Rows per page
    </p>
    <Select
      value={table.getState().pagination.pageSize.toString()}
      onValueChange={(value) => table.setPageSize(+value)}
    >
      <SelectTrigger className='h-8 gap-x-2'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sizes.map((size) => (
          <SelectItem key={size} value={size.toString()}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

export default PaginationCapacity
