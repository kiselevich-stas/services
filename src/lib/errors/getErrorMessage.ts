import {
    MutationCache,
    QueryCache,
    QueryClient,
    type Query,
    type Mutation,
    type VueQueryPluginOptions,
} from '@tanstack/vue-query'
import { getErrorMessage} from "../../lib/errors/getErrorMessage.ts";
import { useToastStore} from "../../stores/toast.ts";

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

    const toastStore = useToastStore()

    toastStore.error(
        getErrorToastTitle(query.meta, 'Ошибка загрузки данных'),
        getErrorMessage(error),
    )
}

function handleMutationError(error: unknown, mutation: Mutation<unknown, unknown, unknown, unknown>): void {
    if (!shouldShowErrorToast(mutation.meta)) {
        return
    }

    const toastStore = useToastStore()

    toastStore.error(
        getErrorToastTitle(mutation.meta, 'Не удалось выполнить действие'),
        getErrorMessage(error),
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
