export interface Profile {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  city: string
  about: string
  avatarUrl: string | null
}

export interface ProfileRow {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  city: string | null
  about: string | null
  avatar_url: string | null
}

export interface ProfileUpdatePayload {
  firstName: string
  lastName: string
  phone: string
  city: string
  about: string
  avatarUrl: string | null
}
