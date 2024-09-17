export const SERVICE_WORKER_URL = '/service-worker.js'

export const registerServiceWorker = () =>
  navigator.serviceWorker.register(SERVICE_WORKER_URL)

export const isServiceWorkerSupported = () =>
  'serviceWorker' in navigator && 'PushManager' in window
