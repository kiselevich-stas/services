import { useToastStore } from '../../stores/toast'
import { getErrorMessage } from './getErrorMessage'

export function showErrorToast(title: string, error?: unknown, fallbackMessage?: string): void {
    const toastStore = useToastStore()
    const message = error === undefined ? fallbackMessage : getErrorMessage(error)

    toastStore.error(title, message)
}
