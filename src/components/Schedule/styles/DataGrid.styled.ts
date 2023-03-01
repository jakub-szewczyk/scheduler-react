import { Paper, styled } from '@mui/material'
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid'
import * as TABLE from '../../../modules/table'

const DataGrid = styled(MuiDataGrid)(({ theme }) => ({
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
    '::-webkit-scrollbar': {
      height: 8,
    },
    '::-webkit-scrollbar-track': {
      background: theme.palette.secondary.light,
      borderRadius: theme.shape.borderRadius,
    },
    '::-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main,
      borderRadius: theme.shape.borderRadius,
      '&:hover': {
        background: theme.palette.primary.dark,
      },
    },
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

const DataGridContainer = styled(Paper)<{ height: number }>(
  ({ theme, height }) => ({
    width: 'calc(100% - 32px)',
    height,
    margin: '3.5rem auto 0 auto',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      width: 'calc(100% - 48px)',
      marginTop: '4rem',
    },
    '.MuiDataGrid-footerContainer': {
      height: TABLE.FOOTER_HEIGHT,
    },
  })
)

export { DataGrid, DataGridContainer }
