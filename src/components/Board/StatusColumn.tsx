import { Paper, Stack, Typography } from '@mui/material'
import { Draggable } from 'react-beautiful-dnd'
import { Status } from '../../types/board'
import StrictModeDroppable from '../layout/StrictModeDroppable/StrictModeDroppable'
import IssueItem from './IssueItem'

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
        <Typography
          {...dragHandleProps}
          component={Paper}
          elevation={0}
          padding={1}
          textAlign='center'
          textTransform='uppercase'
          sx={{
            cursor: 'grab',
            color: (theme) => theme.palette.common.black,
            bgcolor: (theme) => theme.palette.primary.main,
            '&:hover': {
              bgcolor: (theme) => theme.palette.primary.dark,
            },
          }}
        >
          {title}
        </Typography>
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
