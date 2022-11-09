import { DataGrid, GridEventListener } from '@mui/x-data-grid'
import { useLocalStorage } from 'usehooks-ts'
import initialRows from './constants/initialRows'
import updateRowField from './functions/updateRowField'
import columns from './helpers/columns'
import DataGridWrapper from './styled/DataGridWrapper.styled'

const Table = () => {
  const [rows, setRows] = useLocalStorage('rows', initialRows)

  const handleCellEditCommit:
    | GridEventListener<'cellEditCommit'>
    | undefined = ({ field, value, id }) =>
    setRows(updateRowField(field, value, id, rows))

  return (
    <DataGridWrapper height={56 + 52 * rows.length + 53}>
      <DataGrid
        columns={columns(rows, setRows)}
        rows={rows}
        onCellEditCommit={handleCellEditCommit}
      />
    </DataGridWrapper>
  )
}

export default Table
