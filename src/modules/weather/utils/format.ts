export function formatHour(value: string): string {
  const date = new Date(value)

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
