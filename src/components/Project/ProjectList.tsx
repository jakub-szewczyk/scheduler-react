import ProjectItem from '@/components/Project/ProjectItem'
import { GetProjectsResponse } from '@/services/project'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { omit } from 'ramda'
import { MutableRefObject, forwardRef } from 'react'
import { useSearchParams } from 'react-router-dom'

interface ProjectListProps {
  projects: GetProjectsResponse
}

const ProjectList = forwardRef<HTMLInputElement, ProjectListProps>(
  ({ projects }, ref) => {
    const inputRef = ref as MutableRefObject<HTMLInputElement>

    const [searchParams, setSearchParams] = useSearchParams()

    return projects.content.map((project, _, array) => (
      <Grid key={project.name} xs={12} sm={6} md={4} lg={3} xl={12 / 5}>
        <ProjectItem
          project={project}
          onAfterCreate={() => (inputRef.current.value = '')}
          onAfterDelete={(project) => {
            const isProjectSelected =
              project.id === searchParams.get('projectId')
            const isProjectLastOnPage = projects.content.length === 1
            if (isProjectSelected && isProjectLastOnPage) {
              inputRef.current.value = ''
              return setSearchParams((searchParams) => ({
                page: Math.max(0, +searchParams.get('page')! - 1).toString(),
                transitional: 'true',
              }))
            }
            if (!isProjectSelected && isProjectLastOnPage) {
              inputRef.current.value = ''
              return setSearchParams((searchParams) => ({
                ...omit(['search'], Object.fromEntries(searchParams)),
                page: Math.max(0, +searchParams.get('page')! - 1).toString(),
              }))
            }
            if (isProjectSelected && !isProjectLastOnPage) {
              const index = array.findIndex(({ id }) => id === project.id)
              setSearchParams(
                (searchParams) => ({
                  ...Object.fromEntries(searchParams),
                  projectId: array[Math.abs(index - 1)].id,
                  projectName: array[Math.abs(index - 1)].name,
                }),
                { replace: true }
              )
            }
          }}
        />
      </Grid>
    ))
  }
)

export default ProjectList
