import { DataGrid } from '@mui/x-data-grid'
import { lensProp, map, prop, set, when } from 'ramda'
import { Dispatch, SetStateAction } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import headerHeight from './constants/headerHeight'
import initialSchedules from './constants/initialSchedules'
import rowHeight from './constants/rowHeight'
import calculateTableHeight from './functions/calculateTableHeight'
import calculateTableMaxWidth from './functions/calculateTableMaxWidth'
import findSelectedSchedule from './functions/findSelectedSchedule'
import updateRowField from './functions/updateRowField'
import createColumns from './helpers/createColumns'
import DataGridWrapper from './styles/DataGridWrapper.styled'
import { Row } from './types/Table.types'

const Table = () => {
  const [schedules, setSchedules] = useLocalStorage(
    'schedules',
    initialSchedules
  )

  const { rows } = findSelectedSchedule(schedules)!

  const setRows = (rows: Row[]) =>
    setSchedules(map(when(prop('selected'), set(lensProp('rows'), rows))))

  const columns = createColumns(
    rows,
    setRows as Dispatch<SetStateAction<Row[]>>
  )

  return (
    <DataGridWrapper
      height={calculateTableHeight(rows)}
      maxWidth={calculateTableMaxWidth(columns)}
    >
      <DataGrid
        headerHeight={headerHeight}
        rowHeight={rowHeight}
        columns={columns}
        rows={rows}
        onCellEditCommit={({ field, value, id }) =>
          setRows(updateRowField(field, value, id, rows))
        }
        sx={{
          fontSize: 16,
          '.MuiTablePagination-selectLabel, .MuiToolbar-root, .MuiTablePagination-displayedRows':
            {
              fontSize: 16,
            },
        }}
      />
    </DataGridWrapper>
  )
}

export default Table
