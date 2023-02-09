import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material'
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
          action={
            <IconButton size='small'>
              <MoreVertIcon fontSize='small' />
            </IconButton>
          }
          titleTypographyProps={{
            variant: 'body1',
            noWrap: true,
          }}
          sx={{
            pb: 0,
            '.MuiCardHeader-content': {
              width: 'calc(100% - 60px)',
            },
          }}
        />
        <CardContent sx={{ pb: '1rem !important' }}>
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
