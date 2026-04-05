<template>
  <aside class="panel profile-sidebar-card">
    <div class="profile-sidebar-card__avatar">
      <img
        v-if="profile?.avatarUrl"
        :src="profile.avatarUrl"
        alt="Аватар пользователя"
        class="profile-sidebar-card__avatar-image"
      />
      <span v-else>{{ initials }}</span>
    </div>

    <h1 class="profile-sidebar-card__name">
      {{ fullName || 'Пользователь' }}
    </h1>

    <p class="profile-sidebar-card__email">
      {{ profile?.email || 'Email не указан' }}
    </p>

    <div class="profile-sidebar-card__meta-list">
      <div class="profile-sidebar-card__meta-item">
        <span>Город</span>
        <strong>{{ profile?.city || 'Не указан' }}</strong>
      </div>

      <div class="profile-sidebar-card__meta-item">
        <span>Телефон</span>
        <strong>{{ profile?.phone || 'Не указан' }}</strong>
      </div>
    </div>

    <button
      type="button"
      class="profile-sidebar-card__logout-button"
      :disabled="loading"
      @click="$emit('logout')"
    >
      {{ loading ? 'Выходим...' : 'Выйти из аккаунта' }}
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Profile } from '../types'

const props = defineProps<{
  profile: Profile | null
  loading?: boolean
}>()

defineEmits<{
  logout: []
}>()

const initials = computed(() => {
  const firstLetter = props.profile?.firstName?.[0] ?? ''
  const lastLetter = props.profile?.lastName?.[0] ?? ''

  return `${firstLetter}${lastLetter}`.toUpperCase() || 'U'
})

const fullName = computed(() => {
  return `${props.profile?.firstName ?? ''} ${props.profile?.lastName ?? ''}`.trim()
})
</script>

<style scoped lang="scss">
.profile-sidebar-card {
  display: grid;
  align-content: start;
  gap: 20px;
  text-align: center;

  &__avatar {
    width: 96px;
    height: 96px;
    margin: 0 auto;
    display: grid;
    place-items: center;
    border-radius: 50%;
    overflow: hidden;
    font-size: 28px;
    font-weight: 800;
    background: linear-gradient(135deg, rgba(112, 161, 255, 0.5), rgba(0, 209, 255, 0.28));
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.24);
  }

  &__avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__name {
    margin: 0;
    font-size: 26px;
  }

  &__email {
    margin: -8px 0 0;
    color: rgba(246, 248, 255, 0.7);
    word-break: break-word;
  }

  &__meta-list {
    display: grid;
    gap: 12px;
  }

  &__meta-item {
    padding: 16px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.05);
    text-align: left;
    display: grid;
    gap: 6px;

    span {
      font-size: 13px;
      color: rgba(246, 248, 255, 0.62);
    }

    strong {
      font-size: 16px;
    }
  }

  &__logout-button {
    border: 0;
    padding: 14px 16px;
    border-radius: 18px;
    color: #f6f8ff;
    background: linear-gradient(135deg, rgba(255, 99, 132, 0.82), rgba(255, 139, 92, 0.78));
    cursor: pointer;
    transition: 0.2s ease;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      filter: brightness(1.05);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
}
</style>
