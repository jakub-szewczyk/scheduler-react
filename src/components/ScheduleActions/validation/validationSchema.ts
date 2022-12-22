import { prop } from 'fp-ts-ramda'
import { pipe } from 'fp-ts/lib/function'
import { includes, map, trim } from 'ramda'
import { object, string } from 'yup'
import { Schedule } from '../../../types/schedule'

const validationSchema = (schedules: Schedule[]) =>
  object().shape({
    name: string()
      .required('Required')
      .test(
        'unique schedule names',
        'This name has already been used by one of your schedules',
        (name = '') => !pipe(schedules, map(prop('name')), includes(trim(name)))
      ),
  })

export default validationSchema
