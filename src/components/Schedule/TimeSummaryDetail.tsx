import { Typography } from '@mui/material'
import { constant, pipe } from 'fp-ts/lib/function'
import { getOrElse, Option } from 'fp-ts/lib/Option'
import { ReactElement } from 'react'
import toTimeFormat from './functions/toTimeFormat'
import { Time } from './types/Schedule.types'

interface TimeSummaryDetailProps {
  label: string
  children: Time
}

const TimeSummaryDetail = ({ label, children }: TimeSummaryDetailProps) =>
  children ? (
    <Typography>
      {label}:{' '}
      {pipe(
        toTimeFormat(children) as Option<ReactElement>,
        getOrElse(
          constant(
            <Typography component='span' color='error'>
              invalid date format
            </Typography>
          )
        )
      )}
    </Typography>
  ) : null

export default TimeSummaryDetail
