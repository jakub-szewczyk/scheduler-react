import { Paper, styled } from '@mui/material'
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid'
import * as TABLE from '../../../modules/table'

const DataGrid = styled(MuiDataGrid)(() => ({
  border: 0,
  fontSize: 16,
  '.MuiDataGrid-columnHeaderTitleContainer': {
    paddingInline: 8,
  },
  '.MuiDataGrid-cell': {
    paddingInline: 16,
  },
  '.MuiDataGrid-footerContainer': {
    borderTop: 0,
  },
  '.MuiDataGrid-virtualScroller': {
    overflowY: 'hidden',
  },
  '.MuiDataGrid-virtualScrollerContent--overflowed .MuiDataGrid-row--lastVisible .MuiDataGrid-cell':
    {
      borderBottomColor: '#515151',
    },
  '.MuiTablePagination-selectLabel, .MuiToolbar-root, .MuiTablePagination-displayedRows':
    {
      fontSize: 16,
    },
}))

const DataGridContainer = styled(Paper)<{ height: number }>(({ height }) => ({
  width: '100%',
  height,
  marginInline: 'auto',
  marginTop: 80,
  overflow: 'hidden',
  '.MuiDataGrid-footerContainer': {
    height: TABLE.FOOTER_HEIGHT,
  },
}))

export { DataGrid, DataGridContainer }
