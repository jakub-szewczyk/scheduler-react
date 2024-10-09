import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/modules/common'
import { Draggable } from 'react-beautiful-dnd'
import { GripVertical } from 'lucide-react'
import { ComponentProps, forwardRef } from 'react'
import { match } from 'ts-pattern'

type KanbanIssueProps = ComponentProps<'div'> & { index: number } & (
    | {
        status: 'pending'
      }
    | {
        status: 'success'
        title: string
        description?: string | null
      }
    | {
        status: 'error'
      }
  )

const KanbanIssue = forwardRef<HTMLDivElement, KanbanIssueProps>(
  (props, ref) => {
    const issueId = props.status === 'success' ? props.id : undefined

    return (
      <Draggable
        draggableId={issueId || `issue-${props.index}`}
        index={props.index}
      >
        {({ innerRef, draggableProps, dragHandleProps }) => (
          <div ref={innerRef} {...draggableProps}>
            <Card
              ref={ref}
              className={cn('flex-shrink-0 bg-secondary', props.className)}
            >
              <CardHeader className='flex-row gap-x-2 p-4'>
                <Button
                  className='size-8 flex-shrink-0 cursor-grab hover:bg-primary-foreground/80'
                  size='icon'
                  variant='ghost'
                  disabled={!issueId}
                  {...dragHandleProps}
                >
                  <GripVertical className='size-6' />
                </Button>
                <div className='!mt-0 w-full space-y-1.5 truncate'>
                  {match(props)
                    .with({ status: 'pending' }, { status: 'error' }, () => (
                      <div className='h-6'>
                        <Skeleton className='h-4 bg-background' />
                      </div>
                    ))
                    .with({ status: 'success' }, (props) => (
                      <CardTitle className='truncate text-base font-semibold'>
                        {props.title}
                      </CardTitle>
                    ))
                    .exhaustive()}
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
                          props.description && 'visible'
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
