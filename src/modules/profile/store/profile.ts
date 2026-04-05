import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../../../lib/supabase'
import type { Profile, ProfileRow, ProfileUpdatePayload } from '../types'

function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email ?? '',
    firstName: row.first_name ?? '',
    lastName: row.last_name ?? '',
    phone: row.phone ?? '',
    city: row.city ?? '',
    about: row.about ?? '',
    avatarUrl: row.avatar_url ?? null,
  }
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const initialized = ref(false)

  const fullName = computed(() => {
    if (!profile.value) {
      return ''
    }

    return `${profile.value.firstName} ${profile.value.lastName}`.trim()
  })

  async function ensureProfile(user: User): Promise<void> {
    if (loading.value) {
      return
    }

    if (initialized.value && profile.value?.id === user.id) {
      return
    }

    loading.value = true

    try {
      const { data, error } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name, phone, city, about, avatar_url')
          .eq('id', user.id)
          .maybeSingle<ProfileRow>()

      if (error) {
        throw error
      }

      if (data) {
        profile.value = mapProfileRow(data)
        initialized.value = true
        return
      }

      const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email ?? '',
            avatar_url: user.user_metadata?.avatar_url ?? null,
            first_name: user.user_metadata?.first_name ?? '',
            last_name: user.user_metadata?.last_name ?? '',
            phone: '',
            city: '',
            about: '',
          })
          .select('id, email, first_name, last_name, phone, city, about, avatar_url')
          .single<ProfileRow>()

      if (insertError) {
        throw insertError
      }

      profile.value = mapProfileRow(insertedProfile)
      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(payload: ProfileUpdatePayload): Promise<void> {
    if (!profile.value) {
      throw new Error('Профиль не загружен')
    }

    saving.value = true

    try {
      const { data, error } = await supabase
          .from('profiles')
          .update({
            first_name: payload.firstName,
            last_name: payload.lastName,
            phone: payload.phone,
            city: payload.city,
            about: payload.about,
            avatar_url: payload.avatarUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profile.value.id)
          .select('id, email, first_name, last_name, phone, city, about, avatar_url')
          .single<ProfileRow>()

      if (error) {
        throw error
      }

      profile.value = mapProfileRow(data)
    } finally {
      saving.value = false
    }
  }

  function clearProfile(): void {
    profile.value = null
    initialized.value = false
  }

  return {
    profile,
    loading,
    saving,
    initialized,
    fullName,
    ensureProfile,
    updateProfile,
    clearProfile,
  }
})