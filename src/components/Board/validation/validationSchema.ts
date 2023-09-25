import { Status, UpsertStatusDialogMode } from '@/types/status'
import { prop } from 'fp-ts-ramda'
import { map } from 'fp-ts/lib/Array'
import { identity, pipe } from 'fp-ts/lib/function'
import { includes, toLower } from 'ramda'
import { object, string } from 'yup'
import * as STATUS from '../../../modules/status'

export const upsertStatusValidationSchema = (
  mode: UpsertStatusDialogMode,
  status: Status | undefined,
  statuses: Status[]
) =>
  object().shape({
    title: string()
      .trim()
      .required('Required')
      .test(
        'unique status titles',
        'This title has already been used by one of your statuses',
        (title = '') =>
          !pipe(
            statuses,
            mode === 'EDIT' && status ? STATUS.remove(status.title) : identity,
            map(prop('title')),
            includes(toLower(title))
          )
      ),
  })

export const upsertIssueValidationSchema = object().shape({
  title: string().trim().required('Required'),
  content: string().trim().required('Required'),
})
