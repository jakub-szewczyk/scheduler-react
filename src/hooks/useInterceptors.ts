import api from '@/services/api'
import { useEffectOnce } from 'usehooks-ts'

type Interceptors = Partial<{
  request: Partial<{
    onFulfilled: Parameters<typeof api.interceptors.request.use>[0]
    onRejected: Parameters<typeof api.interceptors.request.use>[1]
  }>
  response: Partial<{
    onFulfilled: Parameters<typeof api.interceptors.response.use>[0]
    onRejected: Parameters<typeof api.interceptors.response.use>[1]
  }>
}>

const useInterceptors = ({ request, response }: Interceptors) => {
  useEffectOnce(() => {
    api.interceptors.request.use(request?.onFulfilled, request?.onRejected)
    api.interceptors.response.use(response?.onFulfilled, response?.onRejected)
  })
}

export default useInterceptors
