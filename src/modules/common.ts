import { deleteProjects } from '@/services/project'
import { Subject } from '@/types/common'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { match } from 'ts-pattern'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

/**
 * TODO:
 * Use `.exhaustive()` instead of `.run()`.
 */
export const getDeleteMutationFn = (subject: Subject) =>
  match(subject)
    .with('project', () => deleteProjects)
    .run()
