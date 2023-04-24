import { Note } from '@/types/note'
import { prop } from 'fp-ts-ramda'
import { filter, map } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { includes } from 'ramda'
import { object, string } from 'yup'

const validationSchema = (note: Note, notes: Note[]) =>
  object().shape({
    name: string()
      .trim()
      .required('Required')
      .notOneOf(
        ['unsaved', 'unsaved*'],
        'This name has been set aside for exclusive purposes'
      )
      .test(
        'unique note names',
        'This name has already been used by one of your notes',
        (name = '') =>
          !pipe(
            notes,
            filter(({ name }) => name !== note.name),
            map(prop('name')),
            includes(name)
          )
      ),
  })

export default validationSchema
