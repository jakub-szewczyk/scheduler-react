import { Box, styled } from '@mui/material'

const DataGridWrapper = styled(Box)<{ height: number }>(({ height }) => ({
  width: '100%',
  maxWidth: 1000,
  height,
  marginInline: 'auto',
  marginTop: 80,
  overflow: 'hidden',
  '.MuiDataGrid-virtualScroller': {
    overflowY: 'hidden',
  },
}))

export default DataGridWrapper
