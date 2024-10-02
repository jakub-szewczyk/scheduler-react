import { DATA_TABLE_PREVIEW_SIZE, subjectToQueryFn } from '@/modules/common'
import { Subject } from '@/types/common'
import { useQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import DataTablePreview from '../DataTablePreview/DataTablePreview'

interface DataTabContentProps {
  subject: Subject
}

const DataTabContent = ({ subject }: DataTabContentProps) => {
  const params = useParams({ from: '/projects/$projectId/' })

  const query = { projectId: params.projectId, size: DATA_TABLE_PREVIEW_SIZE }

  const subjectQuery = useQuery({
    queryKey: [subject, query],
    queryFn: () => subjectToQueryFn(subject)(query),
  })

  return (
    <DataTablePreview
      isFetching={subjectQuery.isFetching}
      isPlaceholderData={subjectQuery.isPlaceholderData}
      subject={subject}
      data={subjectQuery.data?.content}
      projectId={params.projectId}
    />
  )
}

export default DataTabContent
