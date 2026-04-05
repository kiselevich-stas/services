<template>

    <section class="profile-page">
      <div class="profile-page__grid">
        <ProfileSidebarCard
            :profile="profileStore.profile"
            :loading="isPageLoading"
            @logout="handleLogout"
        />

        <ProfileFormCard
            :profile="profileStore.profile"
            :loading="isPageLoading"
            :success-message="successMessage"
            :submit-error="submitError"
            @save="handleSave"
        />
      </div>
    </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppShell from '../../../components/AppShell.vue'
import UiPageLoader from '../../../components/ui/UiPageLoader.vue'
import { useAuthStore } from '../../../stores/auth'
import { useProfileStore } from '../store/profile'
import ProfileSidebarCard from '../components/ProfileSidebarCard.vue'
import ProfileFormCard from '../components/ProfileFormCard.vue'
import type { ProfileUpdatePayload } from '../types'

const router = useRouter()
const authStore = useAuthStore()
const profileStore = useProfileStore()

const successMessage = ref('')
const submitError = ref('')
const pageError = ref('')

const isPageLoading = computed(() => {
  return !profileStore.profile && profileStore.loading
})

async function loadProfile(): Promise<void> {
  pageError.value = ''

  try {
    if (!authStore.isInitialized) {
      await authStore.initAuth()
    }

    if (!authStore.user) {
      await router.push('/login')
      return
    }

    await profileStore.ensureProfile(authStore.user)
  } catch (error) {
    pageError.value =
        error instanceof Error ? error.message : 'Не удалось загрузить профиль'
  }
}

async function handleSave(payload: ProfileUpdatePayload): Promise<void> {
  successMessage.value = ''
  submitError.value = ''

  try {
    await profileStore.updateProfile(payload)
    successMessage.value = 'Профиль успешно сохранён'
  } catch (error) {
    submitError.value =
        error instanceof Error ? error.message : 'Не удалось сохранить профиль'
  }
}

async function handleLogout(): Promise<void> {
  submitError.value = ''
  successMessage.value = ''

  try {
    await authStore.logout()
    profileStore.clearProfile()
    await router.push('/login')
  } catch (error) {
    submitError.value =
        error instanceof Error ? error.message : 'Не удалось выйти из аккаунта'
  }
}

onMounted(async () => {
  await loadProfile()
})
</script>

<style scoped lang="scss">
.profile-page {
  display: grid;
  gap: 16px;
}

.profile-page__grid {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.profile-page__error {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(248, 113, 113, 0.28);
  background: rgba(248, 113, 113, 0.1);
  color: #fca5a5;
  font-size: 14px;
  line-height: 1.4;
}

@media (max-width: 960px) {
  .profile-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>