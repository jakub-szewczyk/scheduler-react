import { Paper, Stack, Typography } from '@mui/material'
import { Status } from '../../types/board'
import StrictModeDroppable from '../layout/StrictModeDroppable/StrictModeDroppable'
import IssueItem from './IssueItem'

const StatusColumn = ({ title, issues }: Status) => (
  <StrictModeDroppable droppableId={title}>
    {({ droppableProps, innerRef, placeholder }) => (
      <Paper
        {...droppableProps}
        ref={innerRef}
        elevation={0}
        sx={{
          flexShrink: 0,
          width: 280,
          p: 0.75,
        }}
      >
        <Typography
          component={Paper}
          elevation={0}
          padding={1}
          textAlign='center'
          textTransform='uppercase'
          sx={{
            color: (theme) => theme.palette.common.black,
            bgcolor: (theme) => theme.palette.primary.main,
            '&:hover': {
              bgcolor: (theme) => theme.palette.primary.dark,
            },
          }}
        >
          {title}
        </Typography>
        <Stack spacing={0.75}>
          {issues.map((issue, index) => (
            <IssueItem key={issue.title} {...issue} index={index} />
          ))}
          {placeholder}
        </Stack>
      </Paper>
    )}
  </StrictModeDroppable>
)

export default StatusColumn
