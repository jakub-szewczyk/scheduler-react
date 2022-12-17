import { DataGrid } from '@mui/x-data-grid'
import { Dispatch, SetStateAction } from 'react'
import headerHeight from './constants/headerHeight'
import rowHeight from './constants/rowHeight'
import calculateTableHeight from './functions/calculateTableHeight'
import calculateTableMaxWidth from './functions/calculateTableMaxWidth'
import updateRowField from './functions/updateRowField'
import createColumns from './helpers/createColumns'
import DataGridWrapper from './styles/DataGridWrapper.styled'
import { Row } from './types/Schedule.types'

interface ScheduleProps {
  rows: Row[]
  setRows: Dispatch<SetStateAction<Row[]>>
}

const Schedule = ({ rows, setRows }: ScheduleProps) => {
  const columns = createColumns(rows, setRows)

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

export default Schedule
