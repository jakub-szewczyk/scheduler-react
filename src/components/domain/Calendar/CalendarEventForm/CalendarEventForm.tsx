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
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { TimePicker } from '@/components/ui/time-picker'
import { cn } from '@/modules/common'
import { COLORS, COLOR_CLASSES } from '@/modules/event'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from '@tanstack/react-router'
import { endOfDay, format } from 'date-fns'
import { CalendarIcon, LoaderCircle, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z
  .object({
    title: z.string().min(1, 'This field is required').default(''),
    description: z.string().default(''),
    startsAt: z.date({ message: 'This field is required' }),
    endsAt: z.date({ message: 'This field is required' }),
    color: z
      .enum(COLORS, {
        required_error: 'This field is required',
      })
      .default('BLUE'),
  })
  .refine((schema) => schema.startsAt.getTime() <= schema.endsAt.getTime(), {
    path: ['endsAt'],
    message: 'The end date cannot precede the start date',
  })

type Inputs = z.infer<typeof formSchema>

interface CalendarEventFormProps {
  isLoading?: boolean
  isFetching?: boolean
  isPlaceholderData?: boolean
  isPending?: boolean
  values?: Inputs
  onSubmit: (inputs: Inputs) => void
}

const CalendarEventForm = ({
  isLoading,
  isFetching,
  isPlaceholderData,
  isPending,
  values,
  onSubmit,
}: CalendarEventFormProps) => {
  const form = useForm<Inputs>({
    values,
    resolver: zodResolver(formSchema),
  })

  const startsAt = form.watch('startsAt')
  const endsAt = form.watch('endsAt')

  const router = useRouter()

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-y-6'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='sm:max-w-[50%]'>
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
              <FormDescription>
                This value has to be unique. There can only be one event
                associated with this title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='sm:max-w-[50%]'>
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
        <div className='flex w-full flex-col gap-6 xl:max-w-[50%] xl:flex-row'>
          <FormField
            control={form.control}
            name='startsAt'
            render={({ field }) => (
              <FormItem className='flex flex-col sm:w-1/2'>
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
                            'justify-start text-left font-normal',
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
                      disabled={{
                        before: new Date(),
                        ...(endsAt && { after: endsAt }),
                      }}
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
            name='endsAt'
            render={({ field }) => (
              <FormItem className='flex flex-col sm:w-1/2'>
                <FormLabel>
                  Ends at <span className='text-destructive'>*</span>
                </FormLabel>
                <Popover>
                  {isLoading ? (
                    <Skeleton className='h-10 w-full' />
                  ) : (
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          className={cn(
                            'justify-start text-left font-normal',
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
                      disabled={{
                        before: startsAt || new Date(),
                      }}
                      selected={field.value}
                      onSelect={(day, ...args) =>
                        field.onChange(day ? endOfDay(day) : day, ...args)
                      }
                    />
                    <div className='border-t border-border p-3'>
                      <TimePicker
                        date={field.value || endOfDay(new Date())}
                        setDate={field.onChange}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='color'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Color <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={isLoading ? undefined : field.value || 'BLUE'}
                  onValueChange={field.onChange}
                >
                  {COLORS.map((color) => (
                    <FormItem key={color}>
                      <FormLabel className='flex w-fit items-center gap-x-2 rounded-full border px-3 py-2 font-normal'>
                        <FormControl>
                          <RadioGroupItem
                            value={color}
                            disabled={isFetching && !isPlaceholderData}
                          />
                        </FormControl>
                        <div
                          className={cn(
                            'size-5 rounded-full',
                            COLOR_CLASSES[color]
                          )}
                        />
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormDescription>
                Select the right color to easily distinguish various events on
                your calendar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex gap-x-2'>
          <Button
            className='flex gap-x-2 sm:w-fit'
            type='button'
            variant='ghost'
            disabled={isPending}
            /**
             * NOTE:
             * If `document.referrer` is an external domain, then users will navigate to that domain.
             */
            onClick={router.history.back}
          >
            Cancel
          </Button>
          <Button
            className='flex gap-x-2 sm:w-fit'
            type='submit'
            disabled={
              isLoading || (isFetching && !isPlaceholderData) || isPending
            }
          >
            Submit
            {isPending ? (
              <LoaderCircle className='size-4 animate-spin' />
            ) : (
              <Send className='size-4' />
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CalendarEventForm
