<template>
  <aside class="panel profile-sidebar-card">
    <div class="profile-sidebar-card__avatar">
      <div
          v-if="loading"
          class="profile-sidebar-card__skeleton profile-sidebar-card__skeleton--avatar"
      />

      <img
          v-else-if="profile?.avatarUrl"
          :src="profile.avatarUrl"
          alt="Аватар пользователя"
          class="profile-sidebar-card__avatar-image"
      />

      <span v-else>{{ initials }}</span>
    </div>

    <h1 class="profile-sidebar-card__name">
      <span
          v-if="loading"
          class="profile-sidebar-card__skeleton profile-sidebar-card__skeleton--title"
      />
      <template v-else>
        {{ fullName || 'Пользователь' }}
      </template>
    </h1>

    <p class="profile-sidebar-card__email">
      <span
          v-if="loading"
          class="profile-sidebar-card__skeleton profile-sidebar-card__skeleton--text"
      />
      <template v-else>
        {{ profile?.email || 'Email не указан' }}
      </template>
    </p>

    <div class="profile-sidebar-card__meta-list">
      <template v-if="loading">
        <div class="profile-sidebar-card__field-skeleton">
          <span class="profile-sidebar-card__skeleton profile-sidebar-card__skeleton--label" />
          <span class="profile-sidebar-card__skeleton profile-sidebar-card__skeleton--input" />
        </div>

        <div class="profile-sidebar-card__field-skeleton">
          <span class="profile-sidebar-card__skeleton profile-sidebar-card__skeleton--label" />
          <span class="profile-sidebar-card__skeleton profile-sidebar-card__skeleton--input" />
        </div>
      </template>

      <template v-else>
        <UiInput
            :model-value="profile?.city || 'Не указан'"
            label="Город"
            readonly
        />

        <UiInput
            :model-value="profile?.phone || 'Не указан'"
            label="Телефон"
            readonly
        />
      </template>
    </div>

    <button
        type="button"
        class="profile-sidebar-card__logout-button"
        :disabled="loading"
        @click="$emit('logout')"
    >
      <span
          v-if="loading"
          class="profile-sidebar-card__skeleton profile-sidebar-card__skeleton--button"
      />
      <template v-else>
        Выйти из аккаунта
      </template>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UiInput from '../../../components/ui/UiInput.vue'
import type { Profile } from '../types'

const props = withDefaults(defineProps<{
  profile: Profile | null
  loading?: boolean
}>(), {
  loading: false,
})

defineEmits<{
  logout: []
}>()

const initials = computed(() => {
  const email = props.profile?.email?.trim()

  if (!email) {
    return 'U'
  }

  const localPart = email.split('@')[0]?.replace(/[^a-zA-Zа-яА-Я0-9]/g, '') ?? ''

  if (!localPart) {
    return 'U'
  }

  return localPart.slice(0, 2).toUpperCase()
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
    color: #6366f1;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4) 40%, transparent 45%), linear-gradient(135deg, #eef2ff 0%, #f0f9ff 50%, #ecfdf5 100%);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }

  &__avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__name {
    margin: 0;
    font-size: 26px;
    min-height: 31px;
    display: grid;
    place-items: center;
  }

  &__email {
    margin: -8px 0 0;
    color: rgba(246, 248, 255, 0.7);
    word-break: break-word;
    min-height: 22px;
    display: grid;
    place-items: center;
  }

  &__meta-list {
    display: grid;
    gap: 12px;
    text-align: left;
  }

  &__field-skeleton {
    display: grid;
    gap: 8px;
  }

  &__logout-button {
    border: 0;
    padding: 14px 16px;
    border-radius: 18px;
    color: #f6f8ff;
    background: linear-gradient(135deg, rgba(255, 99, 132, 0.82), rgba(255, 139, 92, 0.78));
    cursor: pointer;
    transition: 0.2s ease;
    min-height: 52px;
    display: grid;
    place-items: center;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      filter: brightness(1.05);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  &__skeleton {
    display: inline-block;
    border-radius: 12px;
    background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.08) 25%,
            rgba(255, 255, 255, 0.16) 37%,
            rgba(255, 255, 255, 0.08) 63%
    );
    background-size: 400% 100%;
    animation: profile-sidebar-card-shimmer 1.4s ease infinite;

    &--avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
    }

    &--title {
      width: 70%;
      height: 24px;
    }

    &--text {
      width: 80%;
      height: 16px;
    }

    &--label {
      width: 72px;
      height: 14px;
      border-radius: 8px;
    }

    &--input {
      width: 100%;
      height: 52px;
      border-radius: 16px;
    }

    &--button {
      width: 140px;
      height: 16px;
      border-radius: 8px;
    }
  }
}

@keyframes profile-sidebar-card-shimmer {
  0% {
    background-position: -400px 0;
  }

  100% {
    background-position: 400px 0;
  }
}
</style>