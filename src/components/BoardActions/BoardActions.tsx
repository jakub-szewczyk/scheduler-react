import TableRowsIcon from '@mui/icons-material/TableRows'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import { SpeedDial, SpeedDialAction } from '@mui/material'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import { Dispatch, SetStateAction } from 'react'
import { useBoolean } from 'usehooks-ts'
import { createIssue, createStatus } from '../../modules/board'
import { Issue, Status } from '../../types/board'
import UpsertIssueDialog from '../Board/UpsertIssueDialog'
import UpsertStatusDialog from '../Board/UpsertStatusDialog'

interface BoardActionsProps {
  statuses: Status[]
  setStatuses: Dispatch<SetStateAction<Status[]>>
}

const BoardActions = ({ statuses, setStatuses }: BoardActionsProps) => {
  const {
    value: isUpsertStatusDialogOpen,
    setFalse: closeUpsertStatusDialog,
    setTrue: openUpsertStatusDialog,
  } = useBoolean(false)
  const {
    value: isUpsertIssueDialogOpen,
    setFalse: closeUpsertIssueDialog,
    setTrue: openUpsertIssueDialog,
  } = useBoolean(false)

  const handleStatusCreate = ({ title }: Pick<Status, 'title'>) => {
    setStatuses(createStatus(title))
    closeUpsertStatusDialog()
  }

  const handleIssueCreate = (issue: Issue) => {
    setStatuses(createIssue(issue))
    closeUpsertIssueDialog()
  }

  return (
    <>
      <SpeedDial
        ariaLabel='speed-dial'
        icon={<SpeedDialIcon />}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }}
      >
        <SpeedDialAction
          tooltipTitle='Issue'
          icon={<TableRowsIcon />}
          onClick={openUpsertIssueDialog}
          FabProps={{
            disabled: statuses.length === 0,
          }}
        />
        <SpeedDialAction
          tooltipTitle='Status'
          icon={<ViewColumnIcon />}
          onClick={openUpsertStatusDialog}
        />
      </SpeedDial>
      <UpsertStatusDialog
        open={isUpsertStatusDialogOpen}
        onClose={closeUpsertStatusDialog}
        mode='CREATE'
        statuses={statuses}
        onCreate={handleStatusCreate}
      />
      <UpsertIssueDialog
        open={isUpsertIssueDialogOpen}
        onClose={closeUpsertIssueDialog}
        mode='CREATE'
        statuses={statuses}
        onCreate={handleIssueCreate}
      />
    </>
  )
}
export default BoardActions
