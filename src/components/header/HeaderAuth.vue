<template>
  <div class="header-auth">
    <RouterLink
        :to="linkTo"
        class="header-auth__link"
        :aria-label="ariaLabel"
    >
      <template v-if="authStore.isAuthenticated">
        <img
            v-if="showAvatarImage"
            :src="authStore.avatarUrl!"
            alt="Аватар пользователя"
            class="header-auth__avatar-image"
            @error="handleAvatarError"
        />

        <div
            v-else
            class="header-auth__avatar-fallback"
            aria-hidden="true"
        >
          <span
              v-if="userInitials"
              class="header-auth__initials"
          >
            {{ userInitials }}
          </span>

          <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="header-auth__fallback-icon"
          >
            <circle
                cx="12"
                cy="8"
                r="3.5"
                fill="currentColor"
                opacity="0.2"
            />
            <path
                d="M5 18C6.15 15.55 8.55 14.25 12 14.25C15.45 14.25 17.85 15.55 19 18"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                opacity="0.75"
            />
          </svg>
        </div>
      </template>

      <div
          v-else
          class="header-auth__login"
          aria-hidden="true"
      >
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="header-auth__login-icon"
        >
          <path
              d="M12 3.75C9.93 3.75 8.25 5.43 8.25 7.5C8.25 9.57 9.93 11.25 12 11.25C14.07 11.25 15.75 9.57 15.75 7.5C15.75 5.43 14.07 3.75 12 3.75Z"
              stroke="currentColor"
              stroke-width="1.8"
          />
          <path
              d="M4.75 19C5.78 16.08 8.48 14.5 12 14.5C13.14 14.5 14.2 14.66 15.15 14.98"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
          />
          <path
              d="M16.25 16.25H20.25"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
          />
          <path
              d="M18.25 14.25V18.25"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
          />
        </svg>
      </div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth.ts'

const authStore = useAuthStore()
const avatarLoadFailed = ref(false)

const linkTo = computed(() => {
  return authStore.isAuthenticated ? '/profile' : '/login'
})

const ariaLabel = computed(() => {
  return authStore.isAuthenticated
      ? 'Перейти в профиль'
      : 'Перейти на страницу входа'
})

const showAvatarImage = computed(() => {
  return Boolean(authStore.avatarUrl) && !avatarLoadFailed.value
})

const userInitials = computed(() => {
  const email = authStore.user?.email?.trim()

  if (!email) {
    return ''
  }

  const localPart = email.split('@')[0]?.replace(/[^a-zA-Zа-яА-Я0-9]/g, '') ?? ''

  if (!localPart) {
    return ''
  }

  return localPart.slice(0, 2).toUpperCase()
})

watch(
    () => authStore.avatarUrl,
    () => {
      avatarLoadFailed.value = false
    }
)

function handleAvatarError(): void {
  avatarLoadFailed.value = true
}
</script>

<style scoped lang="scss">
.header-auth {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.header-auth__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 999px;
  transition:
      transform 0.22s ease,
      opacity 0.22s ease;
}


.header-auth__link:focus-visible {
  outline: none;
}

.header-auth__link::after {
  content: '';
  position: absolute;
  inset: -5px;
  border-radius: 999px;
  background: radial-gradient(
          circle,
          rgba(79, 70, 229, 0.16) 0%,
          rgba(59, 130, 246, 0.1) 42%,
          rgba(255, 255, 255, 0) 74%
  );
  opacity: 0;
  transform: scale(0.9);
  transition:
      opacity 0.22s ease,
      transform 0.22s ease;
  pointer-events: none;
}

.header-auth__link:hover::after,
.header-auth__link:focus-visible::after {
  opacity: 1;
  transform: scale(1);
}

.header-auth__avatar-image,
.header-auth__avatar-fallback,
.header-auth__login {
  position: relative;
  z-index: 1;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
}

.header-auth__avatar-image {
  display: block;
  object-fit: cover;
  border: 1px solid rgba(191, 219, 254, 0.9);
  background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(239, 246, 255, 0.92));
  box-shadow:
      0 10px 24px rgba(59, 130, 246, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.75);
  transition:
      box-shadow 0.22s ease,
      transform 0.22s ease;
}

.header-auth__avatar-fallback,
.header-auth__login {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition:
      box-shadow 0.22s ease,
      transform 0.22s ease,
      border-color 0.22s ease;
}

.header-auth__avatar-fallback {
  color: #6366f1;

  border: 1px solid rgba(199, 210, 254, 0.6);

  background:
      radial-gradient(
              circle at 30% 30%,
              rgba(255, 255, 255, 0.9),
              rgba(255, 255, 255, 0.4) 40%,
              transparent 45%
      ),
      linear-gradient(
              135deg,
              #eef2ff 0%,
              #f0f9ff 50%,
              #ecfdf5 100%
      );

  box-shadow:
      0 6px 16px rgba(59, 130, 246, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.header-auth__login {
  color: #4f46e5;
  border: 1px solid rgba(191, 219, 254, 0.95);
  background:
      radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.4) 35%, transparent 36%),
      linear-gradient(135deg, rgba(238, 242, 255, 0.98) 0%, rgba(240, 249, 255, 0.98) 50%, rgba(236, 253, 245, 0.98) 100%);
  box-shadow:
      0 10px 24px rgba(59, 130, 246, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.82);
}

.header-auth__initials {
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.header-auth__fallback-icon {
  width: 18px;
  height: 18px;
}

.header-auth__login-icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .header-auth__avatar-image,
  .header-auth__avatar-fallback,
  .header-auth__login {
    width: 40px;
    height: 40px;
  }

  .header-auth__initials {
    font-size: 13px;
  }

  .header-auth__fallback-icon {
    width: 17px;
    height: 17px;
  }

  .header-auth__login-icon {
    width: 18px;
    height: 18px;
  }
}
</style>