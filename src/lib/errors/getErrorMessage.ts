import axios from 'axios'

export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const responseMessage = extractResponseMessage(error.response?.data)

        if (responseMessage) {
            return responseMessage
        }

        if (error.code === 'ECONNABORTED') {
            return 'Сервер отвечает слишком долго. Попробуйте ещё раз.'
        }

        if (!error.response) {
            return 'Не удалось подключиться к серверу. Проверьте интернет или повторите попытку позже.'
        }

        switch (error.response.status) {
            case 400:
                return 'Запрос содержит ошибку. Проверьте данные и попробуйте снова.'
            case 401:
                return 'Нужно авторизоваться, чтобы продолжить.'
            case 403:
                return 'У вас нет доступа к этому действию.'
            case 404:
                return 'Ничего не найдено.'
            case 409:
                return 'Такое действие уже выполнено или данные конфликтуют с текущим состоянием.'
            case 422:
                return 'Некоторые поля заполнены некорректно.'
            case 429:
                return 'Слишком много запросов. Попробуйте чуть позже.'
            case 500:
            case 502:
            case 503:
            case 504:
                return 'На сервере произошла ошибка. Попробуйте позже.'
            default:
                return 'Что-то пошло не так. Попробуйте ещё раз.'
        }
    }

    if (error instanceof Error && error.message.trim()) {
        return error.message
    }

    return 'Произошла неизвестная ошибка.'
}

function extractResponseMessage(data: unknown): string | null {
    if (!data) {
        return null
    }

    if (typeof data === 'string' && data.trim()) {
        return data
    }

    if (typeof data === 'object') {
        const maybeRecord = data as Record<string, unknown>

        if (typeof maybeRecord.message === 'string' && maybeRecord.message.trim()) {
            return maybeRecord.message
        }

        if (typeof maybeRecord.error === 'string' && maybeRecord.error.trim()) {
            return maybeRecord.error
        }
    }

    return null
}
