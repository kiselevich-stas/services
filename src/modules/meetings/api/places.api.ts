import type { MeetingPlace } from '../types'

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

interface NominatimPlace {
  place_id: number
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  display_name: string
  name?: string
  type?: string
  category?: string
}

export async function searchPlaces(query: string): Promise<MeetingPlace[]> {
  const cleanQuery = query.trim()

  if (!cleanQuery) {
    return []
  }

  const response = await fetch(
    `${NOMINATIM_BASE_URL}/search?format=jsonv2&addressdetails=1&limit=8&q=${encodeURIComponent(cleanQuery)}`,
    {
      headers: {
        'Accept-Language': 'ru,en;q=0.8',
      },
    },
  )

  if (!response.ok) {
    throw new Error('Не удалось загрузить места')
  }

  const data = (await response.json()) as NominatimPlace[]

  return data.map(mapPlace)
}

function mapPlace(place: NominatimPlace): MeetingPlace {
  return {
    id: `${place.osm_type}-${place.osm_id}`,
    name: place.name || place.display_name.split(',')[0] || 'Выбранное место',
    address: place.display_name,
    lat: Number(place.lat),
    lng: Number(place.lon),
    kind: place.type || place.category,
  }
}
