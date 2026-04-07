import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type ToastType = 'error' | 'success' | 'info'

export interface ToastItem {
    id: number
    type: ToastType
    title: string
    message?: string
    duration: number
    createdAt: number
}

interface AddToastPayload {
    type: ToastType
    title: string
    message?: string
    duration?: number
}

const DEFAULT_DURATION_BY_TYPE: Record<ToastType, number> = {
    error: 5000,
    success: 3200,
    info: 3600,
}

const DEDUPE_WINDOW_MS = 1500
let nextToastId = 0

export const useToastStore = defineStore('toast', () => {
    const toasts = ref<ToastItem[]>([])

    const hasToasts = computed(() => toasts.value.length > 0)

    function removeToast(id: number): void {
        toasts.value = toasts.value.filter((toast) => toast.id !== id)
    }

    function clearToasts(): void {
        toasts.value = []
    }

    function findDuplicateToast(type: ToastType, title: string, message?: string): ToastItem | undefined {
        const now = Date.now()

        return toasts.value.find((toast) => {
            const isFreshDuplicate = now - toast.createdAt <= DEDUPE_WINDOW_MS

            return (
                isFreshDuplicate
                && toast.type === type
                && toast.title === title
                && toast.message === message
            )
        })
    }

    function addToast(payload: AddToastPayload): number {
        const duplicateToast = findDuplicateToast(payload.type, payload.title, payload.message)

        if (duplicateToast) {
            return duplicateToast.id
        }

        const id = ++nextToastId
        const duration = payload.duration ?? DEFAULT_DURATION_BY_TYPE[payload.type]

        const toast: ToastItem = {
            id,
            type: payload.type,
            title: payload.title,
            message: payload.message,
            duration,
            createdAt: Date.now(),
        }

        toasts.value.push(toast)

        if (duration > 0 && typeof window !== 'undefined') {
            window.setTimeout(() => {
                removeToast(id)
            }, duration)
        }

        return id
    }

    function error(title: string, message?: string, duration?: number): number {
        return addToast({
            type: 'error',
            title,
            message,
            duration,
        })
    }

    function success(title: string, message?: string, duration?: number): number {
        return addToast({
            type: 'success',
            title,
            message,
            duration,
        })
    }

    function info(title: string, message?: string, duration?: number): number {
        return addToast({
            type: 'info',
            title,
            message,
            duration,
        })
    }

    return {
        toasts,
        hasToasts,
        addToast,
        removeToast,
        clearToasts,
        error,
        success,
        info,
    }
})
