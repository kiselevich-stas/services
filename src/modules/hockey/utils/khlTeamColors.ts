export const KHL_TEAM_COLORS: Record<string, string> = {
    'Ак Барс': '#1ea672',
    'Динамо Мн': '#1f6ed4',
    'ЦСКА': '#d92d2d',
    'Авангард': '#cf2e2e',
    'Салават Юлаев': '#25a55b',
    'Локомотив': '#d0262f',
    'Торпедо': '#244c9a',
    'Металлург Мг': '#7a7f87',
    'Динамо М': '#2a64c5',
    'Спартак': '#d72638',
    'СКА': '#123d8d',
    'Трактор': '#2b2b2b',
    'Автомобилист': '#c32222',
    'Северсталь': '#f0c419',
    'Нефтехимик': '#198fd6',
    'Адмирал': '#183b8c',
    'Амур': '#ee6b2f',
    'Сибирь': '#3ca0e7',
    'Витязь': '#c73737',
    'Куньлунь РС': '#c71f25',
    'Барыс': '#2ea7c9',
    'Сочи': '#173f9f',
}

export function getTeamColor(teamName?: string | null): string {
    if (!teamName) {
        return '#7c8aa0'
    }

    return KHL_TEAM_COLORS[teamName] ?? '#7c8aa0'
}

export function hexToRgba(hex: string, alpha = 1): string {
    const normalized = hex.replace('#', '')
    const safeHex = normalized.length === 3
        ? normalized.split('').map((char) => char + char).join('')
        : normalized

    const red = parseInt(safeHex.slice(0, 2), 16)
    const green = parseInt(safeHex.slice(2, 4), 16)
    const blue = parseInt(safeHex.slice(4, 6), 16)

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}