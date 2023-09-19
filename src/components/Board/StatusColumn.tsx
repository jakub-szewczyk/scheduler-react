import { Paper, Stack, Typography } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import StrictModeDroppable from '../../layout/StrictModeDroppable/StrictModeDroppable'
import IssueItem from './IssueItem'
import StatusActionsMenu from './StatusActionsMenu'
import { Status } from '@/types/status'

interface StatusColumnProps {
  index: number
  status: Status
  statuses: Status[]
  setStatuses: Dispatch<SetStateAction<Status[]>>
}

const StatusColumn = ({
  index,
  status,
  statuses,
  setStatuses,
}: StatusColumnProps) => (
  <Draggable draggableId={status.id} index={index}>
    {({ draggableProps, dragHandleProps, innerRef }) => (
      <Paper
        {...draggableProps}
        ref={innerRef}
        elevation={0}
        sx={{
          flexShrink: 0,
          width: 280,
          p: 0.75,
          mx: 1,
          bgcolor: 'rgba(0, 0, 0, 0.35)',
        }}
      >
        <Paper
          {...dragHandleProps}
          elevation={0}
          sx={{
            position: 'relative',
            p: 1,
            cursor: 'grab',
            color: (theme) => theme.palette.common.black,
            bgcolor: (theme) => theme.palette.primary.main,
            '&:hover': {
              bgcolor: (theme) => theme.palette.primary.dark,
            },
          }}
        >
          <Typography
            noWrap
            textAlign='center'
            textTransform='uppercase'
            marginX={3.75}
          >
            {status.title}
          </Typography>
          <StatusActionsMenu status={status} statuses={statuses} />
        </Paper>
        <StrictModeDroppable type='status' droppableId={status.id}>
          {({ droppableProps, innerRef, placeholder }) => (
            <Stack
              {...droppableProps}
              ref={innerRef}
              spacing={0.75}
              height='calc(100% - 40px)'
            >
              {status.issues.map((issue, index) => (
                <IssueItem
                  key={issue.id}
                  index={index}
                  issue={issue}
                  statuses={statuses}
                  setStatuses={setStatuses}
                />
              ))}
              {placeholder}
            </Stack>
          )}
        </StrictModeDroppable>
      </Paper>
    )}
  </Draggable>
)

export default StatusColumn
