import axios, { type AxiosInstance } from 'axios'
import { useToastStore} from "../../stores/toast.ts";
import { getErrorMessage} from "./getErrorMessage.ts";

export function attachErrorToastInterceptor(
    instance: AxiosInstance,
    title = 'Ошибка запроса'
): void {
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            const toastStore = useToastStore()

            if (axios.isCancel(error)) {
                return Promise.reject(error)
            }

            toastStore.error(title, getErrorMessage(error))

            return Promise.reject(error)
        }
    )
}