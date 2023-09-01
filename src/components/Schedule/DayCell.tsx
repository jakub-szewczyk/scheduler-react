import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { IconButton, Stack, Typography } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { nanoid } from 'nanoid'
import { Updater } from 'use-immer'
import { Row } from '../../types/row'

interface DayCellProps extends GridRenderCellParams {
  setRows: Updater<Row[]>
}

const DayCell = ({ id, value, row, setRows }: DayCellProps) => (
  <Stack
    direction='row'
    justifyContent='space-between'
    alignItems='center'
    width='100%'
  >
    <Typography>{value}</Typography>
    {row.rowId ? (
      <IconButton
        size='small'
        onClick={() => setRows((rows) => rows.filter((row) => row.id !== id))}
      >
        <RemoveIcon fontSize='small' />
      </IconButton>
    ) : (
      <IconButton
        size='small'
        onClick={() =>
          setRows(
            (rows) =>
              void rows.splice(
                rows.findIndex((row) => row.id === id) +
                  rows.filter((row) => row.rowId === id).length +
                  1,
                0,
                {
                  id: nanoid(),
                  rowId: id.toString(),
                }
              )
          )
        }
      >
        <AddIcon fontSize='small' />
      </IconButton>
    )}
  </Stack>
)

export default DayCell
