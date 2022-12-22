import { constant, pipe } from 'fp-ts/lib/function'
import * as Option from 'fp-ts/Option'
import { map } from 'ramda'
import { utils, writeFileXLSX } from 'xlsx'
import * as TIME from '../modules/time'
import { Row } from '../types/row'
import { Schedule } from '../types/schedule'

const rowToXLSX = ({ day, starts, ends, room, subject }: Row) => ({
  Day: day,
  Starts: pipe(TIME.format(starts), Option.getOrElse(constant(''))),
  Ends: pipe(TIME.format(ends), Option.getOrElse(constant(''))),
  Room: room,
  Subject: subject,
})

const exportScheduleToXLSX = (schedule: Schedule) => () => {
  const ws = utils.json_to_sheet(pipe(schedule.rows, map(rowToXLSX)))
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, 'Data')
  writeFileXLSX(wb, `${schedule.name}.xlsx`)
}

export { exportScheduleToXLSX }
