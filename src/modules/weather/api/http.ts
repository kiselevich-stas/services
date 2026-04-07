import axios from 'axios'
import { attachErrorToastInterceptor} from "../../../lib/errors/attachErrorToastInterceptor.ts";

export const weatherHttp = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
})

export const geocodingHttp = axios.create({
  baseURL: 'https://geocoding-api.open-meteo.com/v1',
  timeout: 10000,
})

export const airHttp = axios.create({
  baseURL: 'https://air-quality-api.open-meteo.com/v1',
  timeout: 10000,
})

attachErrorToastInterceptor(weatherHttp, 'Ошибка получения погоды')
attachErrorToastInterceptor(geocodingHttp, 'Ошибка поиска города')
attachErrorToastInterceptor(airHttp, 'Ошибка получения качества воздуха')