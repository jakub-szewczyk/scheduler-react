import { deleteBoards, getBoards } from '@/services/board'
import { deleteNotes, getNotes } from '@/services/note'
import { deleteProjects, getProjects } from '@/services/project'
import { deleteSchedules, getSchedules } from '@/services/schedule'
import { Subject } from '@/types/common'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { match } from 'ts-pattern'

export const PAGE_SIZE = 10

export const DATA_TABLE_PREVIEW_SIZE = 5

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const toDateFormat = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))

export const subjectToQueryFn = (subject: Subject) =>
  match(subject)
    .with('project', () => getProjects)
    .with('schedule', () => getSchedules)
    .with('board', () => getBoards)
    .with('note', () => getNotes)
    .exhaustive()

export const subjectToDeleteMutationFn = (subject: Subject) =>
  match(subject)
    .with('project', () => deleteProjects)
    .with('schedule', () => deleteSchedules)
    .with('board', () => deleteBoards)
    .with('note', () => deleteNotes)
    .exhaustive()
