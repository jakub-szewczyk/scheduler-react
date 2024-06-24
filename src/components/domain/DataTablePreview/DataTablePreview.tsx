import NoResultsRow from '@/components/common/Table/NoResultsRow/NoResultsRow'
import Paragraph from '@/components/typography/Paragraph/Paragraph'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DATA_TABLE_PREVIEW_SIZE, cn, toDateFormat } from '@/modules/common'
import { Project } from '@/types/project'
import { Link } from '@tanstack/react-router'
import { ArrowRight, CirclePlus, Frown } from 'lucide-react'

interface DataTablePreviewProps<Data> {
  isFetching?: boolean
  isPlaceholderData?: boolean
  size?: number
  data: Data[] | undefined
}

const DataTablePreview = <
  Data extends Project /*TODO: `, Schedule, Board, Note` */,
>({
  isFetching,
  isPlaceholderData,
  data = [],
}: DataTablePreviewProps<Data>) => (
  <Table className='min-w-[36rem]'>
    {data.length > 0 && (
      <TableCaption>
        <Button className='gap-x-2' variant='secondary' asChild>
          <Link>
            See full details <ArrowRight className='size-4' />
          </Link>
        </Button>
      </TableCaption>
    )}
    <TableHeader>
      <TableRow>
        <TableHead className='w-1/4'>Title</TableHead>
        <TableHead>Description</TableHead>
        <TableHead className='w-[15%] whitespace-nowrap'>Created at</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.length > 0 ? (
        data.map((entry) => (
          <TableRow key={entry.id}>
            {/* TODO: Render as link */}
            <TableCell
              className={cn(
                'max-w-0 truncate',
                isFetching && !isPlaceholderData && 'opacity-50'
              )}
            >
              {entry.title}
            </TableCell>
            <TableCell
              className={cn(
                'max-w-0 truncate',
                isFetching && !isPlaceholderData && 'opacity-50'
              )}
            >
              {entry.description}
            </TableCell>
            <TableCell
              className={cn(
                'max-w-0 truncate',
                isFetching && !isPlaceholderData && 'opacity-50'
              )}
            >
              {toDateFormat(entry.createdAt)}
            </TableCell>
          </TableRow>
        ))
      ) : isFetching ? (
        Array(DATA_TABLE_PREVIEW_SIZE)
          .fill(null)
          .map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className='w-full h-4' />
              </TableCell>
              <TableCell>
                <Skeleton className='w-full h-4' />
              </TableCell>
              <TableCell>
                <Skeleton className='w-full h-4' />
              </TableCell>
            </TableRow>
          ))
      ) : (
        <NoResultsRow columnsLength={3}>
          <div className='flex flex-col gap-y-8'>
            <Paragraph className='flex items-center justify-center gap-x-2'>
              Ups, looks like there is no data to display
              <Frown className='size-4' />
            </Paragraph>
            {/* TODO: Render as links */}
            <div className='flex items-center justify-center gap-x-2'>
              <Button className='gap-x-2' variant='outline'>
                Create your first entry <CirclePlus className='size-4' />
              </Button>
              or
              <Button className='gap-x-2' variant='secondary'>
                Navigate to the full page <ArrowRight className='size-4' />
              </Button>
            </div>
          </div>
        </NoResultsRow>
      )}
    </TableBody>
  </Table>
)

export default DataTablePreview
