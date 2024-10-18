import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/modules/common'
import { priorityColor } from '@/modules/issue'
import { Issue } from '@/types/issue'
import { IS_STORYBOOK } from '@/utils/storybook'
import { useIsFetching } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { capitalize } from 'lodash/fp'
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
} from 'lucide-react'
import { ComponentProps, forwardRef } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { match } from 'ts-pattern'

type KanbanIssueProps = ComponentProps<'div'> & { index: number } & (
    | {
        status: 'pending'
      }
    | {
        status: 'success'
        title: Issue['title']
        description?: Issue['description']
        priority: Issue['priority']
      }
    | {
        status: 'error'
      }
  )

const KanbanIssue = forwardRef<HTMLDivElement, KanbanIssueProps>(
  (props, ref) => {
    const issueId = props.status === 'success' ? props.id : undefined

    const params = useParams(
      IS_STORYBOOK
        ? { strict: false }
        : {
            strict: true,
            from: '/projects/$projectId/boards/$boardId/statuses/',
          }
    )

    const isFetching = !!useIsFetching({
      queryKey: [
        'projects',
        params.projectId,
        'boards',
        params.boardId,
        'statuses',
      ],
    })

    return (
      <Draggable
        draggableId={issueId || `issue-${props.index}`}
        index={props.index}
        isDragDisabled={!issueId}
      >
        {({ innerRef, draggableProps, dragHandleProps }) => (
          <div ref={innerRef} {...draggableProps}>
            <Card
              ref={ref}
              className={cn('flex-shrink-0 bg-secondary', props.className)}
            >
              <CardHeader className='flex-row p-4'>
                <Button
                  className='size-8 flex-shrink-0 cursor-grab hover:bg-primary-foreground/80'
                  size='icon'
                  variant='ghost'
                  disabled={!issueId || isFetching}
                  {...dragHandleProps}
                >
                  <GripVertical className='size-6' />
                </Button>
                <div className='!mt-0 w-full space-y-1.5 truncate'>
                  <div className='flex items-center justify-between gap-x-2'>
                    {match(props)
                      .with({ status: 'pending' }, { status: 'error' }, () => (
                        <div className='h-6 w-[82.5%]'>
                          <Skeleton className='h-4 bg-background' />
                        </div>
                      ))
                      .with({ status: 'success' }, (props) => (
                        <div className='flex items-center truncate'>
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className='p-2'>
                                  <div
                                    className={cn(
                                      'size-2 flex-shrink-0 rounded-full',
                                      priorityColor(props.priority)
                                    )}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {capitalize(props.priority)}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <CardTitle
                            className={cn(
                              'truncate text-base font-semibold',
                              isFetching && 'opacity-50'
                            )}
                          >
                            {props.title}
                          </CardTitle>
                        </div>
                      ))
                      .exhaustive()}
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className='size-8 flex-shrink-0 p-0 hover:bg-primary-foreground/80'
                          disabled={!issueId || isFetching}
                          variant='ghost'
                        >
                          <MoreHorizontal className='size-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='start'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='gap-x-2'
                          // onClick={openUpdateSheet}
                        >
                          <Pencil className='size-4' />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger
                            className='gap-x-2'
                            // onClick={openCreateSheet}
                          >
                            <Plus className='size-4' />
                            Insert issue
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                className='gap-x-2'
                                // onClick={openInsertAboveSheet}
                              >
                                <ArrowUp className='size-4' />
                                Insert issue above
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className='gap-x-2'
                                // onClick={openInsertBelowSheet}
                              >
                                <ArrowDown className='size-4' />
                                Insert issue below
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem
                          className='gap-x-2 text-destructive'
                          // onClick={openDeleteDialog}
                        >
                          <Trash className='size-4' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {match(props)
                    .with({ status: 'pending' }, { status: 'error' }, () => (
                      <div className='h-5'>
                        <Skeleton className='h-3.5 bg-background' />
                      </div>
                    ))
                    .with({ status: 'success' }, (props) => (
                      <CardDescription
                        className={cn(
                          'invisible truncate',
                          props.description && 'visible',
                          isFetching && 'opacity-50'
                        )}
                      >
                        {props.description || 'DESCRIPTION'}
                      </CardDescription>
                    ))
                    .exhaustive()}
                </div>
              </CardHeader>
            </Card>
          </div>
        )}
      </Draggable>
    )
  }
)

export default KanbanIssue
