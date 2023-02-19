import { Paper, Stack, Typography } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Status } from '../../types/board'
import StrictModeDroppable from '../layout/StrictModeDroppable/StrictModeDroppable'
import IssueItem from './IssueItem'
import StatusActionsMenu from './StatusActionsMenu'

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
  <Draggable draggableId={status.title} index={index}>
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
          <StatusActionsMenu
            status={status}
            statuses={statuses}
            setStatuses={setStatuses}
          />
        </Paper>
        <StrictModeDroppable type='status' droppableId={status.title}>
          {({ droppableProps, innerRef, placeholder }) => (
            <Stack
              {...droppableProps}
              ref={innerRef}
              spacing={0.75}
              height='calc(100% - 40px)'
            >
              {status.issues.map((issue, index) => (
                <IssueItem
                  key={issue.title}
                  index={index}
                  issue={issue}
                  issues={status.issues}
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
