import { SCHEDULES_PAGE_SIZE } from '@/modules/schedule'
import { getSchedules } from '@/services/schedule'
import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  Stack,
  SwipeableDrawer,
  SwipeableDrawerProps,
  Typography,
} from '@mui/material'
import List from '@mui/material/List'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MouseEventHandler } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useParams } from 'react-router-dom'
import DrawerItemSkeleton from '../../layout/DrawerItemSkeleton/DrawerItemSkeleton'
import SchedulesDrawerItem from './SchedulesDrawerItem'

type Params = {
  projectId: string
  scheduleId: string
}

interface SchedulesDrawerProps extends Omit<SwipeableDrawerProps, 'onSelect'> {
  onCreate: MouseEventHandler<HTMLButtonElement> | undefined
  onSelect: (scheduleId: string) => void
}

const SchedulesDrawer = ({
  onCreate,
  onSelect,
  ...props
}: SchedulesDrawerProps) => {
  const params = useParams<Params>()

  /* FIXME:
   * Subsequent pages not fetching
   * when opening a drawer
   * while the initial set of items is still loading.
   */
  const {
    data: schedules,
    isLoading: isEachScheduleLoading,
    isFetching: isEachScheduleFetching,
    isSuccess: isEachScheduleFetchedSuccessfully,
    hasNextPage: hasNextSchedulesPage,
    fetchNextPage: fetchNextSchedulesPage,
  } = useInfiniteQuery(
    ['infinite', 'projects', params.projectId, 'schedules'],
    ({ pageParam = 0 }) =>
      getSchedules({
        projectId: params.projectId!,
        page: pageParam,
        size: SCHEDULES_PAGE_SIZE,
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.page < Math.ceil(lastPage.total / SCHEDULES_PAGE_SIZE) - 1
          ? lastPage.page + 1
          : undefined,
    }
  )

  return (
    <SwipeableDrawer
      {...props}
      anchor='right'
      PaperProps={{
        sx: { width: 320 },
      }}
    >
      <Stack
        padding={2}
        justifyContent='space-between'
        height='100%'
        rowGap={2}
      >
        <Stack spacing={2} overflow='auto'>
          <Typography variant='h6' align='center'>
            Select & manage schedules
          </Typography>
          <List
            sx={{
              overflow: 'auto',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 1,
              '::-webkit-scrollbar': {
                width: {
                  xs: 4,
                  sm: 8,
                },
              },
              '::-webkit-scrollbar-track': {
                bgcolor: (theme) => theme.palette.secondary.light,
                borderRadius: (theme) => theme.shape.borderRadius,
              },
              '::-webkit-scrollbar-thumb': {
                bgcolor: (theme) => theme.palette.primary.main,
                borderRadius: (theme) => theme.shape.borderRadius,
                '&:hover': {
                  bgcolor: (theme) => theme.palette.primary.dark,
                },
              },
            }}
          >
            {isEachScheduleLoading &&
              Array(3)
                .fill(null)
                .map((_, index) => <DrawerItemSkeleton key={index} />)}
            {isEachScheduleFetchedSuccessfully && (
              <InfiniteScroll
                useWindow={false}
                hasMore={!!hasNextSchedulesPage}
                loader={<DrawerItemSkeleton key={0} />}
                loadMore={(page) =>
                  page > 1 &&
                  !isEachScheduleFetching &&
                  fetchNextSchedulesPage()
                }
              >
                {schedules.pages.flatMap((page) =>
                  page.content.map((schedule) => (
                    <SchedulesDrawerItem
                      key={schedule.id}
                      schedule={schedule}
                      schedules={schedules.pages.flatMap(
                        (page) => page.content
                      )}
                      onSelect={onSelect}
                    />
                  ))
                )}
              </InfiniteScroll>
            )}
          </List>
        </Stack>
        <Box>
          <Button
            variant='outlined'
            endIcon={<AddIcon />}
            onClick={onCreate}
            fullWidth
          >
            New schedule
          </Button>
        </Box>
      </Stack>
    </SwipeableDrawer>
  )
}

export default SchedulesDrawer
