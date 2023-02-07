import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { Draggable } from 'react-beautiful-dnd'
import { Issue } from '../../types/board'

interface IssueItemProps extends Issue {
  index: number
}

const IssueItem = ({ index, title, content }: IssueItemProps) => (
  <Draggable draggableId={title} index={index}>
    {({ draggableProps, dragHandleProps, innerRef }) => (
      <Card
        {...draggableProps}
        {...dragHandleProps}
        ref={innerRef}
        sx={{
          height: 120,
          cursor: 'grab',
          '&:hover': { bgcolor: (theme) => theme.palette.secondary.main },
          '&:first-of-type': { mt: 0.75 },
        }}
      >
        <CardHeader
          title={title}
          titleTypographyProps={{ variant: 'body1' }}
          sx={{ pb: 0 }}
        />
        <CardContent>
          <Typography
            sx={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {content}
          </Typography>
        </CardContent>
      </Card>
    )}
  </Draggable>
)

export default IssueItem
