import {
    MutationCache,
    QueryCache,
    QueryClient,
    type Query,
    type Mutation,
    type VueQueryPluginOptions,
} from '@tanstack/vue-query'
import { showErrorToast } from '../../lib/errors/showErrorToast'

interface ToastMeta {
    showErrorToast?: boolean
    errorToastTitle?: string
}

function shouldShowErrorToast(meta: unknown): boolean {
    return (meta as ToastMeta | undefined)?.showErrorToast !== false
}

function getErrorToastTitle(meta: unknown, fallbackTitle: string): string {
    return (meta as ToastMeta | undefined)?.errorToastTitle ?? fallbackTitle
}

function handleQueryError(error: unknown, query: Query): void {
    if (!shouldShowErrorToast(query.meta)) {
        return
    }

    showErrorToast(
        getErrorToastTitle(query.meta, 'Ошибка загрузки данных'),
        error,
    )
}

function handleMutationError(error: unknown, mutation: Mutation<unknown, unknown, unknown, unknown>): void {
    if (!shouldShowErrorToast(mutation.meta)) {
        return
    }

    showErrorToast(
        getErrorToastTitle(mutation.meta, 'Не удалось выполнить действие'),
        error,
    )
}

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: handleQueryError,
    }),
    mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
            handleMutationError(error, mutation)
        },
    }),
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
        },
    },
})

export const vueQueryOptions: VueQueryPluginOptions = {
    queryClient,
}
