import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { useState } from 'react'
import initialRows from './constants/initialRows'
import updateSubject from './functions/updateSubject'
import columns from './helpers/columns'

const Table = () => {
  const [rows, setRows] = useState(initialRows)

  return (
    <Box
      sx={{ width: '100%', maxWidth: 1000, height: 600, mx: 'auto', mt: 10 }}
    >
      <DataGrid
        columns={columns(rows, setRows)}
        rows={rows}
        onCellEditCommit={({ id, value }) =>
          setRows(updateSubject(id, rows, value))
        }
      />
    </Box>
  )
}

export default Table
