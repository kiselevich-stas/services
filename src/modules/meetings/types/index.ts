export type MeetingVoteStatus = 'pending' | 'going' | 'maybe' | 'not_going'

export type MeetingPlaceKind = 'place' | 'point'

export interface MeetingPlace {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  kind: string
}

export interface Meeting {
  id: string
  title: string
  description: string
  creator_id: string
  place_id: string | null
  place_title: string
  place_subtitle: string | null
  place_address: string
  place_latitude: number
  place_longitude: number
  place_uri: string | null
  place_image_url: string | null
  place_kind: string
  starts_at: string
  created_at: string
  updated_at: string
}

export interface MeetingParticipant {
  id: string
  meeting_id: string
  user_id: string
  status: MeetingVoteStatus
  note: string | null
  created_at: string
  updated_at: string
}

export interface MeetingCreatePayload {
  title: string
  description: string
  startsAt: string
  place: MeetingPlace
  invitedUserIds: string[]
  creatorId: string
  placeImageUrl?: string | null
}

export interface MeetingDetails extends Meeting {
  participants: MeetingParticipant[]
}