import axios from 'axios'

/**
 * TODO:
 * Save `baseURL` in .env file.
 */
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
})

export default api
