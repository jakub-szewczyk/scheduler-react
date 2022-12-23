import { DataGrid } from '@mui/x-data-grid'
import { Dispatch, SetStateAction } from 'react'
import * as ROW from '../../modules/row'
import * as TABLE from '../../modules/table'
import { Row } from '../../types/row'
import createColumns from './helpers/createColumns'
import DataGridWrapper from './styles/DataGridWrapper.styled'

interface ScheduleProps {
  rows: Row[]
  setRows: Dispatch<SetStateAction<Row[]>>
}

const Schedule = ({ rows, setRows }: ScheduleProps) => {
  const columns = createColumns(rows, setRows)

  return (
    <DataGridWrapper
      height={TABLE.calculateHeight(rows)}
      maxWidth={TABLE.calculateMaxWidth(columns)}
    >
      <DataGrid
        disableVirtualization
        headerHeight={TABLE.HEADER_HEIGHT}
        rowHeight={TABLE.ROW_HEIGHT}
        columns={columns}
        rows={rows}
        onCellEditCommit={({ field, value, id }) =>
          setRows(ROW.update(field, value, id, rows))
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
