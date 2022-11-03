import { DataGrid } from '@mui/x-data-grid'
import { constant } from 'fp-ts/lib/function'
import { useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import updateRowField from './functions/updateRowField'
import columns from './helpers/columns'
import getInitialRows from './procedures/getInitialRows'
import saveRowsToLocalStorage from './procedures/saveRowsToLocalStorage'
import DataGridWrapper from './styled/DataGridWrapper.styled'

const Table = () => {
  const [rows, setRows] = useState(getInitialRows())

  useUpdateEffect(constant(saveRowsToLocalStorage(rows)), [rows])

  return (
    <DataGridWrapper height={56 + 52 * rows.length + 53}>
      <DataGrid
        columns={columns(rows, setRows)}
        rows={rows}
        onCellEditCommit={({ field, value, id }) =>
          setRows(updateRowField(field, value, id, rows))
        }
      />
    </DataGridWrapper>
  )
}

export default Table
