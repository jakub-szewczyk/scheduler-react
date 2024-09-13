import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover-without-portal'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { TimePicker } from '@/components/ui/time-picker'
import { cn } from '@/modules/common'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode } from '@tanstack/react-router'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { Event } from 'react-big-calendar'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = (event: Event) =>
  z
    .object({
      title: z.string().min(1, 'This field is required').default(''),
      description: z.string().default(''),
      startsAt: z.date({ message: 'This field is required' }),
      isActive: z.boolean(),
    })
    .refine((schema) => schema.startsAt.getTime() >= event.start!.getTime(), {
      path: ['endsAt'],
      message: 'The end date cannot precede the start date',
    })

type Inputs = z.infer<ReturnType<typeof formSchema>>

interface NotificationFormProps {
  children?: ReactNode
  isLoading?: boolean
  isFetching?: boolean
  isPlaceholderData?: boolean
  event: Event
  values?: Inputs
  onSubmit: (inputs: Inputs) => void
}

const NotificationForm = forwardRef<HTMLFormElement, NotificationFormProps>(
  (
    {
      children,
      isLoading,
      isFetching,
      isPlaceholderData,
      event,
      values,
      onSubmit,
    },
    ref
  ) => {
    const form = useForm<Inputs>({
      defaultValues: { isActive: values ? values.isActive : true },
      values,
      resolver: zodResolver(formSchema(event)),
    })

    return (
      <Form {...form}>
        <form
          ref={ref}
          className='flex flex-col gap-y-6'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title<span className='text-destructive'>*</span>
                </FormLabel>
                {isLoading ? (
                  <Skeleton className='h-10 w-full' />
                ) : (
                  <FormControl>
                    <Input
                      placeholder='Enter title'
                      disabled={isFetching && !isPlaceholderData}
                      {...field}
                    />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  {isLoading ? (
                    <Skeleton className='h-20 w-full' />
                  ) : (
                    <Textarea
                      className='resize-none'
                      placeholder='Enter description'
                      disabled={isFetching && !isPlaceholderData}
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='startsAt'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>
                  Starts at <span className='text-destructive'>*</span>
                </FormLabel>
                <Popover>
                  {isLoading ? (
                    <Skeleton className='h-10 w-full' />
                  ) : (
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          className={cn(
                            'justify-start text-left font-normal [&[aria-invalid="true"]]:border-destructive',
                            !field.value && 'text-muted-foreground'
                          )}
                          variant='outline'
                          disabled={isFetching && !isPlaceholderData}
                        >
                          <CalendarIcon className='mr-2 size-4 flex-shrink-0' />
                          {field.value ? (
                            format(field.value, 'PPP HH:mm:ss')
                          ) : (
                            <span>Enter time & date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                  )}
                  <PopoverContent className='w-auto p-0'>
                    <Calendar
                      initialFocus
                      mode='single'
                      // TODO
                      // disabled={{
                      //   before: new Date(),
                      //   after: event.start,
                      // }}
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                    <div className='border-t border-border p-3'>
                      <TimePicker date={field.value} setDate={field.onChange} />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='isActive'
            render={({ field }) =>
              isLoading ? (
                <Skeleton className='h-16 w-full' />
              ) : (
                <FormItem className='flex flex-row items-center justify-between rounded-md border px-3 py-2'>
                  <div
                    className={cn(
                      'space-y-0.5',
                      isFetching && !isPlaceholderData && 'opacity-50'
                    )}
                  >
                    {/* TODO */}
                    <FormLabel>Lorem ipsum</FormLabel>
                    <FormDescription>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isFetching && !isPlaceholderData}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )
            }
          />
          {children}
        </form>
      </Form>
    )
  }
)

export default NotificationForm
