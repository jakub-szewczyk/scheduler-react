import { Priority } from '@/types/issue'
import { match } from 'ts-pattern'

export const priorityColor = (priority: Priority) =>
  match(priority)
    .with('TRIVIAL', () => 'bg-yellow-100')
    .with('MINOR', () => 'bg-yellow-300')
    .with('LOW', () => 'bg-yellow-500')
    .with('MEDIUM', () => 'bg-orange-500')
    .with('HIGH', () => 'bg-orange-700')
    .with('MAJOR', () => 'bg-red-500')
    .with('CRITICAL', () => 'bg-red-700')
    .exhaustive()
