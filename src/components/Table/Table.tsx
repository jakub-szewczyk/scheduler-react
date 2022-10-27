import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { IconButton, Stack, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRowId,
} from '@mui/x-data-grid'
import { prop } from 'fp-ts-ramda'
import { flow } from 'fp-ts/lib/function'
import { nanoid } from 'nanoid'
import { equals, findIndex, insert, remove, update } from 'ramda'
import { Dispatch, MouseEventHandler, SetStateAction, useState } from 'react'
import { Row } from './Table.types'

const Table = () => {
  const [rows, setRows] = useState(initialRows)

  return (
    <Box
      sx={{ width: '100%', maxWidth: 1000, height: 600, mx: 'auto', mt: 10 }}
    >
      <DataGrid
        columns={columns(rows, setRows)}
        rows={rows}
        onCellEditCommit={handleCellEditCommit(rows, setRows)}
      />
    </Box>
  )
}

const columns = (
  rows: Row[],
  setRows: Dispatch<SetStateAction<Row[]>>
): GridColDef[] => [
  {
    field: 'day',
    headerName: 'Day',
    sortable: false,
    width: 150,
    renderCell: renderDayCell(rows, setRows),
  },
  {
    field: 'subject',
    headerName: 'Subject',
    sortable: false,
    editable: true,
    width: 200,
  },
]

const initialRows: Row[] = [
  { id: 'Monday', day: 'Monday', subject: 'Mathematics' },
  { id: 'Tuesday', day: 'Tuesday' },
  { id: 'Wednesday', day: 'Wednesday' },
  { id: 'Thursday', day: 'Thursday' },
  { id: 'Friday', day: 'Friday' },
]

const renderDayCell =
  (
    rows: Row[],
    setRows: Dispatch<SetStateAction<Row[]>>
  ): GridColDef['renderCell'] =>
  ({ id, value }) =>
    (
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        width='100%'
      >
        <Typography>{value}</Typography>
        {id === value ? (
          <IconButton
            size='small'
            onClick={handleAddRowIconClick(id, rows, setRows)}
          >
            <AddIcon fontSize='small' />
          </IconButton>
        ) : (
          <IconButton
            size='small'
            onClick={handleRemoveRowIconClick(id, rows, setRows)}
          >
            <RemoveIcon fontSize='small' />
          </IconButton>
        )}
      </Stack>
    )

const equalsToRowId = (id: GridRowId) => flow(prop('id'), equals(id))

const rowIndex = (id: GridRowId, rows: Row[]) =>
  findIndex(equalsToRowId(id), rows)

const handleAddRowIconClick =
  (
    id: GridRowId,
    rows: Row[],
    setRows: Dispatch<SetStateAction<Row[]>>
  ): MouseEventHandler<HTMLButtonElement> | undefined =>
  () =>
    setRows(insert(rowIndex(id, rows) + 1, { id: nanoid(), subject: '' }, rows))

const handleRemoveRowIconClick =
  (
    id: GridRowId,
    rows: Row[],
    setRows: Dispatch<SetStateAction<Row[]>>
  ): MouseEventHandler<HTMLButtonElement> | undefined =>
  () =>
    setRows(remove(rowIndex(id, rows), 1, rows))

const handleCellEditCommit =
  (
    rows: Row[],
    setRows: Dispatch<SetStateAction<Row[]>>
  ): GridEventListener<'cellEditCommit'> | undefined =>
  ({ id, value }) =>
    setRows(
      update(
        rowIndex(id, rows),
        { ...rows[rowIndex(id, rows)], subject: value },
        rows
      )
    )

export default Table
