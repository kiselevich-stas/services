export type SpaceVisibility = 'private' | 'link_only' | 'public'
export type SpaceJoinPolicy = 'invite_only' | 'link' | 'request'
export type SpaceMemberRole = 'owner' | 'admin' | 'member'
export type SpaceMemberStatus = 'active' | 'invited' | 'requested' | 'left' | 'removed'
export type SpaceInviteType = 'link' | 'email' | 'manual'
export type MeetingStatus = 'planned' | 'ongoing' | 'done' | 'cancelled'
export type MeetingVisibility = 'space' | 'invite_only'

export interface Space {
  id: string
  owner_id: string
  title: string
  description: string
  slug: string | null
  avatar_url: string | null
  cover_url: string | null
  color: string
  visibility: SpaceVisibility
  join_policy: SpaceJoinPolicy
  is_archived: boolean
  created_at: string
  updated_at: string
}

export interface SpaceMemberProfile {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  email: string | null
}

export interface SpaceMember {
  id: string
  space_id: string
  user_id: string
  role: SpaceMemberRole
  status: SpaceMemberStatus
  nickname: string | null
  created_at: string
  updated_at: string
  profile?: SpaceMemberProfile | null
}

export interface SpaceInvite {
  id: string
  space_id: string
  created_by: string
  code: string
  invite_type: SpaceInviteType
  role: Extract<SpaceMemberRole, 'admin' | 'member'>
  max_uses: number | null
  used_count: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export interface SpaceMeeting {
  id: string
  space_id: string | null
  creator_id: string
  title: string
  description: string
  place_title: string
  place_address: string
  place_subtitle: string | null
  place_latitude: number
  place_longitude: number
  starts_at: string
  ends_at: string | null
  status: MeetingStatus
  visibility: MeetingVisibility
  capacity: number | null
}

export interface SpaceCardModel extends Space {
  members_count: number
  next_meeting: SpaceMeeting | null
  members_preview: SpaceMemberProfile[]
}

export interface SpaceDetailsModel {
  space: Space
  members: SpaceMember[]
  meetings: SpaceMeeting[]
  activeInvite: SpaceInvite | null
}

export interface CreateSpacePayload {
  title: string
  description: string
  color: string
  visibility: SpaceVisibility
  join_policy: SpaceJoinPolicy
}

export type CreateSpaceInvitePayload = {
  spaceId: string
  role: 'member' | 'admin'
  expiresAt: string | null
}