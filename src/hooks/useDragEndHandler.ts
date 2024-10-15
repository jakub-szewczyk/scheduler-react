import { PAGE_SIZE } from '@/modules/common'
import { GetIssuesResponseBody, updateIssue } from '@/services/issue'
import {
  GetStatusesResponseBody,
  getStatuses,
  updateStatus,
} from '@/services/status'
import { Issue } from '@/types/issue'
import { Status } from '@/types/status'
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { produce } from 'immer'
import { OnDragEndResponder } from 'react-beautiful-dnd'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import { useParams } from '@tanstack/react-router'

const useDragEndHandler = () => {
  const params = useParams({
    from: '/projects/$projectId/boards/$boardId/statuses/',
  })

  const statusesQueryKey = [
    'projects',
    params.projectId,
    'boards',
    params.boardId,
    'statuses',
  ]

  const getStatusesQuery = useInfiniteQuery({
    queryKey: statusesQueryKey,
    queryFn: ({ pageParam }) =>
      getStatuses({
        page: pageParam,
        size: PAGE_SIZE,
        projectId: params.projectId,
        boardId: params.boardId,
      }),
    getNextPageParam: (page) =>
      (page.page + 1) * page.size < page.total ? page.page + 1 : null,
    initialPageParam: 0,
  })

  const queryClient = useQueryClient()

  const updateStatusMutation = useMutation({ mutationFn: updateStatus })

  const updateIssueMutation = useMutation({ mutationFn: updateIssue })

  /**
   * NOTE:
   * The destination status can be either to the left or right of the dropped status,
   * depending on the drag direction (left-to-right or right-to-left).
   */
  const handleDragEnd: OnDragEndResponder = ({ source, destination }) => {
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return
    const sourcePageIndex = Math.floor(source.index / PAGE_SIZE)
    const sourceContentIndex = source.index % PAGE_SIZE
    const destinationPageIndex = Math.floor(destination.index / PAGE_SIZE)
    const destinationContentIndex = destination.index % PAGE_SIZE
    const isAscDrag = source.index < destination.index
    const prevPageIndex = Math.floor(
      (destination.index - +!isAscDrag) / PAGE_SIZE
    )
    const nextPageIndex = Math.floor(
      (destination.index + +isAscDrag) / PAGE_SIZE
    )
    const nextContentIndex = (destination.index + +isAscDrag) % PAGE_SIZE
    const prevContentIndex = (destination.index - +!isAscDrag) % PAGE_SIZE
    // NOTE: Dragging statuses
    if (source.droppableId === 'board' && destination.droppableId === 'board') {
      const sourceStatus =
        getStatusesQuery.data!.pages[sourcePageIndex].content[
          sourceContentIndex
        ]
      const prevStatus: Status | undefined =
        getStatusesQuery.data!.pages[prevPageIndex]?.content[prevContentIndex]
      const nextStatus: Status | undefined =
        getStatusesQuery.data!.pages[nextPageIndex]?.content[nextContentIndex]
      queryClient.setQueryData<InfiniteData<GetStatusesResponseBody, number>>(
        statusesQueryKey,
        (getStatusesQueryData) =>
          produce(getStatusesQueryData, (draft) => {
            if (!draft) return draft
            const [status] = draft.pages[sourcePageIndex].content.splice(
              sourceContentIndex,
              1
            )
            draft.pages[destinationPageIndex].content.splice(
              destinationContentIndex,
              0,
              status
            )
          })
      )
      return updateStatusMutation.mutate(
        {
          projectId: params.projectId,
          boardId: params.boardId,
          statusId: sourceStatus.id,
          title: sourceStatus.title,
          description: sourceStatus.description,
          ...(prevStatus && { prevStatusId: prevStatus.id }),
          ...(nextStatus && { nextStatusId: nextStatus.id }),
        },
        {
          onError: () =>
            queryClient.setQueryData<
              InfiniteData<GetStatusesResponseBody, number>
            >(statusesQueryKey, (getStatusesQueryData) =>
              produce(getStatusesQueryData, (draft) => {
                if (!draft) return draft
                const [status] = draft.pages[
                  destinationPageIndex
                ].content.splice(destinationContentIndex, 1)
                draft.pages[sourcePageIndex].content.splice(
                  sourceContentIndex,
                  0,
                  status
                )
              })
            ),
          onSettled: () =>
            queryClient.invalidateQueries({
              queryKey: statusesQueryKey,
              exact: true,
            }),
        }
      )
    }
    // NOTE: Dragging issues within a status
    if (source.droppableId === destination.droppableId) {
      const issuesQueryKey = [...statusesQueryKey, source.droppableId, 'issues']
      const getIssuesQueryData =
        queryClient.getQueryData<InfiniteData<GetIssuesResponseBody, number>>(
          issuesQueryKey
        )
      const sourceIssue =
        getIssuesQueryData!.pages[sourcePageIndex].content[sourceContentIndex]
      const prevIssue: Issue | undefined =
        getIssuesQueryData!.pages[prevPageIndex]?.content[prevContentIndex]
      const nextIssue: Issue | undefined =
        getIssuesQueryData!.pages[nextPageIndex]?.content[nextContentIndex]
      queryClient.setQueryData<InfiniteData<GetIssuesResponseBody, number>>(
        issuesQueryKey,
        (getIssuesQueryData) =>
          produce(getIssuesQueryData, (draft) => {
            if (!draft) return draft
            const [issue] = draft.pages[sourcePageIndex].content.splice(
              sourceContentIndex,
              1
            )
            draft.pages[destinationPageIndex].content.splice(
              destinationContentIndex,
              0,
              issue
            )
          })
      )
      return updateIssueMutation.mutate(
        {
          projectId: params.projectId,
          boardId: params.boardId,
          statusId: source.droppableId,
          issueId: sourceIssue.id,
          title: sourceIssue.title,
          description: sourceIssue.description,
          priority: sourceIssue.priority,
          ...(prevIssue && { prevIssueId: prevIssue.id }),
          ...(nextIssue && { nextIssueId: nextIssue.id }),
        },
        {
          onError: () =>
            queryClient.setQueryData<
              InfiniteData<GetIssuesResponseBody, number>
            >(issuesQueryKey, (getIssuesQueryData) =>
              produce(getIssuesQueryData, (draft) => {
                if (!draft) return draft
                const [issue] = draft.pages[
                  destinationPageIndex
                ].content.splice(destinationContentIndex, 1)
                draft.pages[sourcePageIndex].content.splice(
                  sourceContentIndex,
                  0,
                  issue
                )
              })
            ),
          onSettled: () =>
            queryClient.invalidateQueries({ queryKey: issuesQueryKey }),
        }
      )
    }
    // NOTE: Dragging issues between statuses
    const sourceIssuesQueryKey = [
      ...statusesQueryKey,
      source.droppableId,
      'issues',
    ]
    const destinationIssuesQueryKey = [
      ...statusesQueryKey,
      destination.droppableId,
      'issues',
    ]
    const getSourceIssuesQueryData =
      queryClient.getQueryData<InfiniteData<GetIssuesResponseBody, number>>(
        sourceIssuesQueryKey
      )
    const getDestinationIssuesQueryData = queryClient.getQueryData<
      InfiniteData<GetIssuesResponseBody, number>
    >(destinationIssuesQueryKey)
    const sourceIssue =
      getSourceIssuesQueryData!.pages[sourcePageIndex].content[
        sourceContentIndex
      ]
    const prevIssue: Issue | undefined =
      getDestinationIssuesQueryData!.pages[destinationPageIndex].content[
        destinationContentIndex - 1
      ]
    const nextIssue: Issue | undefined =
      getDestinationIssuesQueryData!.pages[destinationPageIndex].content[
        destinationContentIndex
      ]
    queryClient.setQueryData<InfiniteData<GetIssuesResponseBody, number>>(
      sourceIssuesQueryKey,
      (getIssuesQueryData) =>
        produce(getIssuesQueryData, (draft) => {
          if (!draft) return draft
          draft.pages[sourcePageIndex].content.splice(sourceContentIndex, 1)
        })
    )
    queryClient.setQueryData<InfiniteData<GetIssuesResponseBody, number>>(
      destinationIssuesQueryKey,
      (getIssuesQueryData) =>
        produce(getIssuesQueryData, (draft) => {
          if (!draft) return draft
          draft.pages[destinationPageIndex].content.splice(
            destinationContentIndex,
            0,
            sourceIssue
          )
        })
    )
    updateIssueMutation.mutate(
      {
        projectId: params.projectId,
        boardId: params.boardId,
        statusId: source.droppableId,
        issueId: sourceIssue.id,
        title: sourceIssue.title,
        description: sourceIssue.description,
        priority: sourceIssue.priority,
        ...(prevIssue && { prevIssueId: prevIssue.id }),
        ...(nextIssue && { nextIssueId: nextIssue.id }),
        newStatusId: destination.droppableId,
      },
      {
        onError: () => {
          queryClient.setQueryData<InfiniteData<GetIssuesResponseBody, number>>(
            sourceIssuesQueryKey,
            (getIssuesQueryData) =>
              produce(getIssuesQueryData, (draft) => {
                if (!draft) return draft
                draft.pages[sourcePageIndex].content.splice(
                  sourceContentIndex,
                  0,
                  sourceIssue
                )
              })
          )
          queryClient.setQueryData<InfiniteData<GetIssuesResponseBody, number>>(
            destinationIssuesQueryKey,
            (getIssuesQueryData) =>
              produce(getIssuesQueryData, (draft) => {
                if (!draft) return draft
                draft.pages[destinationPageIndex].content.splice(
                  destinationContentIndex,
                  1
                )
              })
          )
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey: sourceIssuesQueryKey })
          queryClient.invalidateQueries({ queryKey: destinationIssuesQueryKey })
        },
      }
    )
  }

  return handleDragEnd
}

export default useDragEndHandler
