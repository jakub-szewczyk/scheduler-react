import Box from '@mui/material/Box'
import { DataGrid, GridEventListener } from '@mui/x-data-grid'
import { constant } from 'fp-ts/lib/function'
import { useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import initialRows from './constants/initialRows'
import updateRowField from './functions/updateRowField'
import columns from './helpers/columns'
import getRowsFromLocalStorage from './helpers/getRowsFromLocalStorage'
import saveRowsToLocalStorage from './helpers/saveRowsToLocalStorage'

const Table = () => {
  const [rows, setRows] = useState(getRowsFromLocalStorage() || initialRows)

  useUpdateEffect(constant(saveRowsToLocalStorage(rows)), [rows])

  const handleCellEditCommit:
    | GridEventListener<'cellEditCommit'>
    | undefined = ({ id, value, field }) =>
    setRows(updateRowField(id, rows, field, value))

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1000,
        height: 56 + 52 * rows.length + 53,
        mx: 'auto',
        mt: 10,
        overflow: 'hidden',
        '.MuiDataGrid-virtualScroller': {
          overflowY: 'hidden',
        },
      }}
    >
      <DataGrid
        columns={columns(rows, setRows)}
        rows={rows}
        onCellEditCommit={handleCellEditCommit}
      />
    </Box>
  )
}

export default Table
