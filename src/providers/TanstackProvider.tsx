import { Router } from '@/main'
import { api } from '@/services/api'
import { useAuth } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { useEffect } from 'react'

const queryClient = new QueryClient()

interface TanstackProviderProps {
  router: Router
}

const TanstackProvider = ({ router }: TanstackProviderProps) => {
  const { getToken } = useAuth()

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
