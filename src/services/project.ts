import { Project } from '@/types/project'
import api from './api'

export const getAllProjects = (token: string | null) =>
  api<Project[]>('/projects', {
    headers: { Authorization: `Bearer ${token}` },
  }).then(({ data }) => data)

export const createProject = (
  token: string | null,
  data: Pick<Project, 'name' | 'description'>
) =>
  api
    .post('/projects', data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(({ data }) => data)

export const updateProject = (
  token: string | null,
  { id, ...data }: Pick<Project, 'id' | 'name' | 'description'>
) =>
  api
    .put(`/projects/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(({ data }) => data)

export const deleteProject = (
  token: string | null,
  { id }: Pick<Project, 'id'>
) =>
  api
    .delete(`/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(({ data }) => data)
