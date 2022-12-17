import { DataGrid } from '@mui/x-data-grid'
import { useLocalStorage } from 'usehooks-ts'
import headerHeight from './constants/headerHeight'
import initialRows from './constants/initialRows'
import rowHeight from './constants/rowHeight'
import calculateTableHeight from './functions/calculateTableHeight'
import calculateTableMaxWidth from './functions/calculateTableMaxWidth'
import updateRowField from './functions/updateRowField'
import createColumns from './helpers/createColumns'
import DataGridWrapper from './styles/DataGridWrapper.styled'

const Table = () => {
  const [rows, setRows] = useLocalStorage('rows', initialRows)

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

export default Table
