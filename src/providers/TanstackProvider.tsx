import { useToast } from '@/components/ui/use-toast'
import { Router } from '@/main'
import { api } from '@/services/api'
import { ApiError } from '@/types/api'
import { useAuth } from '@clerk/clerk-react'
import '@tanstack/react-query'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError
  }
}

interface TanstackProviderProps {
  router: Router
}

const TanstackProvider = ({ router }: TanstackProviderProps) => {
  const { getToken } = useAuth()

  const { toast } = useToast()

  const handleError = (error: ApiError) =>
    toast({
      variant: 'destructive',
      title: 'Something went wrong',
      description:
        error.response?.data?.[0]?.msg || 'An unknown error was encountered',
    })

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleError,
        }),
        mutationCache: new MutationCache({
          onError: handleError,
        }),
      })
  )

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      config.headers.Authorization = `Bearer ${await getToken()}`
      return config
    })
    return () => api.interceptors.request.eject(interceptor)
  }, [getToken])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default TanstackProvider
