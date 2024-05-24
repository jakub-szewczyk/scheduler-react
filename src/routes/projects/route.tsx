import Heading3 from '@/components/layout/Heading3/Heading3'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects')({
  component: () => <Heading3>Projects</Heading3>,
})
