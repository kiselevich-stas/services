import axios, { type AxiosInstance } from 'axios'
import { showErrorToast } from './showErrorToast'

export function attachErrorToastInterceptor(
    instance: AxiosInstance,
    title = 'Ошибка запроса'
): void {
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (axios.isCancel(error)) {
                return Promise.reject(error)
            }

            showErrorToast(title, error)

            return Promise.reject(error)
        }
    )
}
