interface NotificationConfiguration {
  notification: 0 | 5 | 10 | 15 | 'custom'
  time: string | null
  title: string
}

export type { NotificationConfiguration }
