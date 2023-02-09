import { Paper, Stack, Typography } from '@mui/material'
import { Draggable } from 'react-beautiful-dnd'
import { Status } from '../../types/board'
import StrictModeDroppable from '../layout/StrictModeDroppable/StrictModeDroppable'
import IssueItem from './IssueItem'
import StatusActionsMenu from './StatusActionsMenu'

interface StatusColumnProps extends Status {
  index: number
}

const StatusColumn = ({ index, title, issues }: StatusColumnProps) => (
  <Draggable draggableId={title} index={index}>
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
            {title}
          </Typography>
          <StatusActionsMenu />
        </Paper>
        <StrictModeDroppable type='status' droppableId={title}>
          {({ droppableProps, innerRef, placeholder }) => (
            <Stack
              {...droppableProps}
              ref={innerRef}
              spacing={0.75}
              height='calc(100% - 40px)'
            >
              {issues.map((issue, index) => (
                <IssueItem {...issue} key={issue.title} index={index} />
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
