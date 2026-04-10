export const KHL_TEAM_COLORS: Record<string, string> = {
    'Авангард': '#E53935',
    'Автомобилист': '#C62828',
    'Адмирал': '#1E3A8A',
    'Ак Барс': '#009A44',
    'Амур': '#F97316',
    'Барыс': '#38BDF8',
    'Витязь': '#D32F2F',
    'Динамо М': '#1565C0',
    'Динамо Мн': '#2563EB',
    'Динамо-Минск': '#2563EB',
    'Динамо Москва': '#1565C0',
    'Динамо Минск': '#2563EB',
    'Куньлунь Ред Стар': '#EF4444',
    'Лада': '#2563EB',
    'Локомотив': '#DC2626',
    'Металлург Мг': '#E53935',
    'Металлург': '#E53935',
    'Нефтехимик': '#2563EB',
    'Салават Юлаев': '#16A34A',
    'Северсталь': '#FACC15',
    'Сибирь': '#0EA5E9',
    'СКА': '#1D4ED8',
    'Спартак': '#DC2626',
    'Торпедо': '#1E40AF',
    'Трактор': '#111827',
    'ХК Сочи': '#06B6D4',
    'ЦСКА': '#DC2626',
    'Чайка': '#1D4ED8',
    'Югра': '#16A34A',
}

export const DEFAULT_KHL_TEAM_COLOR = '#A78BFA'

const normalizeTeamName = (teamName?: string | null): string => {
    if (!teamName) {
        return ''
    }

    return teamName
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/ё/gi, 'е')
}

export const getTeamColor = (teamName?: string | null): string => {
    const normalizedName = normalizeTeamName(teamName)

    if (!normalizedName) {
        return DEFAULT_KHL_TEAM_COLOR
    }

    return KHL_TEAM_COLORS[normalizedName] || DEFAULT_KHL_TEAM_COLOR
}

export const hexToRgba = (hex: string, alpha = 1): string => {
    const normalizedHex = hex.replace('#', '')

    const safeHex =
        normalizedHex.length === 3
            ? normalizedHex
                .split('')
                .map((char) => char + char)
                .join('')
            : normalizedHex

    const red = Number.parseInt(safeHex.slice(0, 2), 16)
    const green = Number.parseInt(safeHex.slice(2, 4), 16)
    const blue = Number.parseInt(safeHex.slice(4, 6), 16)

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}