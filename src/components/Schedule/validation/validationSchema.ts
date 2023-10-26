import { isSome } from 'fp-ts/lib/Option'
import { flow } from 'fp-ts/lib/function'
import { object, string } from 'yup'
import * as TIME from '../../../modules/time'

export const scheduleValidationSchema = object({
  name: string().trim().required('Required'),
})

export const notificationValidationSchema = object({
  notification: string().oneOf(
    ['0', '5', '10', '15', 'custom'],
    'Invalid option'
  ),
  time: string().when('notification', {
    is: 'custom',
    then: string()
      .nullable()
      .required('Required')
      .test(
        'matches-time-format',
        'Invalid date format',
        flow(TIME.format, isSome)
      ),
    otherwise: string().nullable().notRequired(),
  }),
  title: string().trim(),
})
