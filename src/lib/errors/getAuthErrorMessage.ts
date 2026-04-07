export function getAuthErrorMessage(error: unknown): string {
    if (!(error instanceof Error)) {
        return 'Что-то пошло не так. Попробуйте ещё раз.'
    }

    const message = error.message.toLowerCase().trim()

    if (message.includes('invalid login credentials')) {
        return 'Неверный email или пароль'
    }

    if (message.includes('email not confirmed')) {
        return 'Подтвердите email перед входом'
    }

    if (message.includes('too many requests')) {
        return 'Слишком много попыток. Попробуйте позже'
    }

    if (message.includes('user already registered')) {
        return 'Пользователь с таким email уже зарегистрирован'
    }

    if (message.includes('password should be at least')) {
        return 'Пароль слишком короткий'
    }

    if (message.includes('failed to fetch')) {
        return 'Не удалось подключиться к серверу. Проверьте интернет-соединение'
    }

    return 'Не удалось выполнить действие. Проверьте данные и попробуйте снова.'
}