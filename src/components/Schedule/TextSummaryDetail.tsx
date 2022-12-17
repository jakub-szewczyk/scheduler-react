import { Typography } from '@mui/material'

interface TextSummaryDetailProps {
  label: string
  children: string | undefined
}

const TextSummaryDetail = ({ label, children }: TextSummaryDetailProps) =>
  children ? (
    <Typography>
      {label}: {children}
    </Typography>
  ) : null

export default TextSummaryDetail
