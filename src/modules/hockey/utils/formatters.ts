export function formatMatchDate(value: number | null) {
    if (!value) {
        return 'Дата неизвестна'
    }

    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value))
}

export function formatMatchTime(value: number | null) {
    if (!value) {
        return '—'
    }

    return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value))
}