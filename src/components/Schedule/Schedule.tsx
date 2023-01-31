import { Dispatch, SetStateAction } from 'react'
import * as ROW from '../../modules/row'
import * as TABLE from '../../modules/table'
import { Row } from '../../types/row'
import createColumns from './helpers/createColumns'
import { DataGrid, DataGridContainer } from './styles/DataGrid.styled'

interface ScheduleProps {
  rows: Row[]
  setRows: Dispatch<SetStateAction<Row[]>>
}

const Schedule = ({ rows, setRows }: ScheduleProps) => {
  const columns = createColumns(rows, setRows)

  return (
    <DataGridContainer
      elevation={0}
      height={TABLE.calculateHeight(rows)}
      sx={{
        maxWidth: TABLE.calculateMaxWidth(columns),
      }}
    >
      <DataGrid
        disableColumnMenu
        hideFooterPagination
        disableVirtualization
        headerHeight={TABLE.HEADER_HEIGHT}
        rowHeight={TABLE.ROW_HEIGHT}
        columns={columns}
        rows={rows}
        onCellEditCommit={({ field, value, id }) =>
          setRows(ROW.update(field, value, id, rows))
        }
      />
    </DataGridContainer>
  )
}

export default Schedule
