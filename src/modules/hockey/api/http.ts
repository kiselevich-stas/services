import axios from 'axios'

export const hockeyApi = axios.create({
  baseURL: 'https://khl.api.webcaster.pro/api/khl_mobile',
  timeout: 15000,
  headers: {
    'Accept-Language': 'ru',
  },
})
