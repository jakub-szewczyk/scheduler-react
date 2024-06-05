import Paragraph from '@/components/typography/Paragraph/Paragraph'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/modules/common'
import { Row, Table } from '@tanstack/react-table'
import { Trash } from 'lucide-react'

interface DeleteConfirmationDialogProps<Data> {
  table: Table<Data>
  subject: string
  onConfirm: (rows: Row<Data>[]) => void
}

const DeleteConfirmationDialog = <Data,>({
  table,
  subject,
  onConfirm,
}: DeleteConfirmationDialogProps<Data>) => {
  const selectedRows = table.getSelectedRowModel().rows

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='gap-x-2 text-destructive' variant='ghost'>
          <span className='hidden sm:inline'>Delete selected</span>
          <Trash className='size-4' />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className='overflow-x-hidden'>
          <AlertDialogTitle>Warning: Permanent Deletion</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              This action cannot be undone. It will delete your {subject}s and
              all data associated with them.
              <Paragraph className='mt-4'>
                The following {subject}s will cease to exist:
              </Paragraph>
              <ScrollArea className='mt-4 p-2.5 text-destructive border border-destructive rounded-md whitespace-nowrap'>
                {selectedRows
                  .map((selectedRow) => selectedRow.getValue('title'))
                  .join(', ')}
                <ScrollBar orientation='horizontal' />
              </ScrollArea>
              <Paragraph className='mt-4'>
                Are you sure you want to proceed?
              </Paragraph>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className={cn(
                buttonVariants({ variant: 'destructive' }),
                'gap-x-2'
              )}
              onClick={(event) => {
                event.preventDefault()
                onConfirm(selectedRows)
              }}
            >
              Yes, delete
              <Trash className='size-4' />
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteConfirmationDialog
