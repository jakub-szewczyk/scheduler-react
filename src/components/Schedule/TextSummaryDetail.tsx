import { Typography } from '@mui/material'

interface TextSummaryDetailProps {
  label: string
  children: string | undefined
}

const TextSummaryDetail = ({ label, children }: TextSummaryDetailProps) =>
  children ? (
    <Typography overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'>
      {label}: {children}
    </Typography>
  ) : null

export default TextSummaryDetail
