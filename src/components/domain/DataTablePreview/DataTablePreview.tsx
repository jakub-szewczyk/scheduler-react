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
import { Subject } from '@/types/common'
import { Project } from '@/types/project'
import { Link } from '@tanstack/react-router'
import { ArrowRight, CirclePlus, Frown } from 'lucide-react'

interface DataTablePreviewProps<Data> {
  isFetching?: boolean
  isPlaceholderData?: boolean
  subject: Subject
  data: Data[] | undefined
  projectId: string
}

const DataTablePreview = <
  Data extends Project /*TODO: `, Schedule, Board, Note` */,
>({
  isFetching,
  isPlaceholderData,
  subject,
  data = [],
  projectId,
}: DataTablePreviewProps<Data>) => (
  <Table className='min-w-[36rem]'>
    {data.length > 0 && (
      <TableCaption>
        <Button className='gap-x-2' variant='secondary' asChild>
          <Link to={`/projects/$projectId/${subject}s`} params={{ projectId }}>
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
            <TableCell
              className={cn(
                'max-w-0 truncate',
                isFetching && !isPlaceholderData && 'opacity-50'
              )}
            >
              <Link
                className='hover:underline'
                to={`/projects/$projectId/${subject}s/$${subject}Id`}
                params={{
                  projectId,
                  [`${subject}Id`]: entry.id,
                }}
              >
                {entry.title}
              </Link>
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
                'max-w-0 whitespace-nowrap',
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
            <div className='flex items-center justify-center gap-x-2'>
              <Button className='gap-x-2' variant='outline' asChild>
                <Link
                  to={`/projects/$projectId/${subject}s/new`}
                  params={{ projectId }}
                >
                  Create your first entry <CirclePlus className='size-4' />
                </Link>
              </Button>
              or
              <Button className='gap-x-2' variant='secondary' asChild>
                <Link
                  to={`/projects/$projectId/${subject}s`}
                  params={{ projectId }}
                >
                  Navigate to the full page <ArrowRight className='size-4' />
                </Link>
              </Button>
            </div>
          </div>
        </NoResultsRow>
      )}
    </TableBody>
  </Table>
)

export default DataTablePreview
