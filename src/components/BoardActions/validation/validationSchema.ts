import { prop } from 'fp-ts-ramda'
import { filter, map } from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { includes } from 'ramda'
import { object, string } from 'yup'
import { Board } from '../../../types/board'

const validationSchema = (board: Board, boards: Board[]) =>
  object().shape({
    name: string()
      .trim()
      .required('Required')
      .notOneOf(
        ['unsaved', 'unsaved*'],
        'This name has been set aside for exclusive purposes'
      )
      .test(
        'unique board names',
        'This name has already been used by one of your boards',
        (name = '') =>
          !pipe(
            boards,
            filter(({ name }) => name !== board.name),
            map(prop('name')),
            includes(name)
          )
      ),
  })

export default validationSchema
