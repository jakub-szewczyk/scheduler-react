import { prop } from 'fp-ts-ramda'
import { filter, map } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { includes } from 'ramda'
import { object, string } from 'yup'
import { Schedule } from '../../../types/schedule'

const validationSchema = (schedule: Schedule, schedules: Schedule[]) =>
  object().shape({
    name: string()
      .trim()
      .required('Required')
      .notOneOf(
        ['unsaved', 'unsaved*'],
        'This name has been set aside for exclusive purposes'
      )
      .test(
        'unique schedule names',
        'This name has already been used by one of your schedules',
        (name = '') =>
          !pipe(
            schedules,
            filter(({ name }) => name !== schedule.name),
            map(prop('name')),
            includes(name)
          )
      ),
  })

export default validationSchema
