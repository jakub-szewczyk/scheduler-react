import DrawerEmptyItem from '@/layout/DrawerEmptyItem/DrawerEmptyItem'
import { SCHEDULES_PAGE_SIZE } from '@/modules/schedule'
import { getSchedules } from '@/services/schedule'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  SwipeableDrawer,
  SwipeableDrawerProps,
  TextField,
  Typography,
} from '@mui/material'
import List from '@mui/material/List'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ChangeEvent, MouseEventHandler, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDebounceCallback, useIntersectionObserver } from 'usehooks-ts'
import DrawerSkeletonItem from '../../layout/DrawerSkeletonItem/DrawerSkeletonItem'
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
  const [search, setSearch] = useState('')

  const params = useParams<Params>()

  const inputRef = useRef<HTMLInputElement>()

  const {
    data: schedules,
    isLoading: isEachScheduleLoading,
    isSuccess: isEachScheduleFetchedSuccessfully,
    isFetchingNextPage: isFetchingNextSchedulesPage,
    hasNextPage: hasNextSchedulesPage,
    fetchNextPage: fetchNextSchedulesPage,
  } = useInfiniteQuery(
    [
      'infinite',
      'projects',
      params.projectId,
      'schedules',
      {
        ...(search && { name: search }),
      },
    ],
    ({ pageParam = 0 }) =>
      getSchedules({
        projectId: params.projectId!,
        page: pageParam,
        size: SCHEDULES_PAGE_SIZE,
        ...(search && { name: search }),
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.page < Math.ceil(lastPage.total / SCHEDULES_PAGE_SIZE) - 1
          ? lastPage.page + 1
          : undefined,
    }
  )

  const { ref: itemRef } = useIntersectionObserver({
    freezeOnceVisible: isFetchingNextSchedulesPage,
    onChange: (isIntersecting) => isIntersecting && fetchNextSchedulesPage(),
  })

  const handleScheduleSearchChange = useDebounceCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSearch(event.target.value),
    500
  )

  const handleScheduleSearchClear = () => {
    setSearch('')
    inputRef.current!.value = ''
  }

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
          <Box>
            <TextField
              size='small'
              label='Search by name'
              fullWidth
              defaultValue={search || ''}
              onChange={handleScheduleSearchChange}
              InputProps={{
                inputRef,
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position='end'>
                    <IconButton
                      size='small'
                      onClick={handleScheduleSearchClear}
                    >
                      <ClearIcon fontSize='small' />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Box>
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
                .map((_, index) => <DrawerSkeletonItem key={index} />)}
            {isEachScheduleFetchedSuccessfully &&
              schedules.pages.flatMap((page) =>
                page.content.map((schedule) => (
                  <SchedulesDrawerItem
                    key={schedule.id}
                    schedule={schedule}
                    schedules={schedules.pages.flatMap((page) => page.content)}
                    onSelect={onSelect}
                  />
                ))
              )}
            {isEachScheduleFetchedSuccessfully &&
              schedules.pages.flatMap((page) => page.content).length === 0 && (
                <DrawerEmptyItem />
              )}
            {hasNextSchedulesPage && <DrawerSkeletonItem ref={itemRef} />}
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
