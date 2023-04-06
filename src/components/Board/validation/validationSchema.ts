import { prop } from 'fp-ts-ramda'
import { filter, map } from 'fp-ts/lib/Array'
import { identity, pipe } from 'fp-ts/lib/function'
import { includes, toLower } from 'ramda'
import { object, string } from 'yup'
import { deleteStatus } from '../../../modules/board'
import { Status, UpsertStatusDialogMode } from '@/types/status'
import { Issue, UpsertIssueDialogMode } from '@/types/issue'

const upsertStatusValidationSchema = (
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
            mode === 'EDIT' && status ? deleteStatus(status.title) : identity,
            map(prop('title')),
            includes(toLower(title))
          )
      ),
  })

const upsertIssueValidationSchema = (
  mode: UpsertIssueDialogMode,
  issue: Issue | undefined,
  statuses: Status[]
) =>
  object().shape({
    title: string()
      .trim()
      .required('Required')
      .test(
        'unique status titles',
        'This title has already been used by one of your issues',
        (title = '') =>
          !pipe(
            statuses.flatMap((status) => status.issues),
            mode === 'EDIT' && issue
              ? filter(({ title }) => title !== issue.title)
              : identity,
            map(prop('title')),
            includes(title)
          )
      ),
    content: string().trim().required('Required'),
  })

export { upsertStatusValidationSchema, upsertIssueValidationSchema }
