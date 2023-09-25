import { TextField } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { DesktopTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Updater } from 'use-immer'
import { Row } from '../../types/row'

interface TimeCellProps extends GridRenderCellParams<any, Row> {
  setRows: Updater<Row[]>
}

const TimeCell = ({ id, field, row, setRows }: TimeCellProps) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DesktopTimePicker
      value={row[field as keyof Row] || null}
      onChange={(value) =>
        setRows((rows) => {
          const row = rows.find((row) => row.id === id)!
          row[field as keyof Pick<Row, 'starts' | 'ends'>] = value as string
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          size='small'
          inputProps={{ ...params.inputProps, placeholder: '' }}
        />
      )}
      OpenPickerButtonProps={{
        size: 'small',
        sx: { translate: 6, svg: { width: 20, height: 20 } },
      }}
    />
  </LocalizationProvider>
)

export default TimeCell
