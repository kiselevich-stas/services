<script setup lang="ts">
import { ref, watch } from 'vue'
import UiInput from '../../../components/ui/UiInput.vue'
import UiInputMasked from '../../../components/ui/UiInputMasked.vue'
import UiTextarea from '../../../components/ui/UiTextarea.vue'
import { useZodForm } from '../../../shared/composables/useZodForm'
import { profileSchema } from '../schema/profile.schema'
import type { Profile, ProfileUpdatePayload } from '../types'

type ProfileFormValues = {
  email: string
  firstName: string
  lastName: string
  phone: string
  city: string
  about: string
  avatarUrl: string | null
}

const props = withDefaults(defineProps<{
  profile: Profile | null
  loading?: boolean
  successMessage?: string
  submitError?: string
}>(), {
  loading: false,
  successMessage: '',
  submitError: '',
})

const emit = defineEmits<{
  save: [payload: ProfileUpdatePayload]
}>()

const form = ref<ProfileFormValues>({
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  city: '',
  about: '',
  avatarUrl: null,
})

const phoneMask = {
  mask: '+{7} (000) 000-00-00',
}

const {
  errors,
  validateForm,
  handleBlur,
  handleInput,
  resetErrors,
} = useZodForm(profileSchema, form)

function syncForm(profile: Profile | null): void {
  if (!profile) {
    return
  }

  form.value = {
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    city: profile.city,
    about: profile.about,
    avatarUrl: profile.avatarUrl,
  }

  resetErrors()
}

function resetForm(): void {
  syncForm(props.profile)
}

function handleSubmit(): void {
  const isValid = validateForm()

  if (!isValid) {
    return
  }

  emit('save', {
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    phone: form.value.phone,
    city: form.value.city,
    about: form.value.about,
    avatarUrl: form.value.avatarUrl,
  })
}

watch(
    () => props.profile,
    (profile) => {
      syncForm(profile)
    },
    { immediate: true },
)
</script>

<template>
  <section class="panel profile-form-card">
    <div class="panel__header">
      <h2 class="panel__title">
        <span
            v-if="loading"
            class="profile-form-card__skeleton profile-form-card__skeleton--title"
        />
        <template v-else>
          Мой профиль
        </template>
      </h2>

      <p class="panel__text">
        <span
            v-if="loading"
            class="profile-form-card__skeleton profile-form-card__skeleton--text profile-form-card__skeleton--text-wide"
        />
        <span
            v-if="loading"
            class="profile-form-card__skeleton profile-form-card__skeleton--text"
        />
        <template v-else>
          Здесь можно редактировать личную информацию. Email пока доступен только для просмотра.
        </template>
      </p>
    </div>

    <form
        v-if="!loading"
        class="profile-form-card__form"
        @submit.prevent="handleSubmit"
    >
      <div class="profile-form-card__grid">
        <UiInput
            v-model="form.firstName"
            label="Имя"
            placeholder="Введите имя"
            :error="errors.firstName"
            @blur="handleBlur('firstName')"
            @update:model-value="handleInput('firstName')"
        />

        <UiInput
            v-model="form.lastName"
            label="Фамилия"
            placeholder="Введите фамилию"
            :error="errors.lastName"
            @blur="handleBlur('lastName')"
            @update:model-value="handleInput('lastName')"
        />

        <div class="profile-form-card__full">
          <UiInput
              :model-value="form.email"
              label="Email"
              type="email"
              readonly
          />
        </div>

        <UiInputMasked
            v-model="form.phone"
            label="Телефон"
            placeholder="+7 (___) ___-__-__"
            :mask="phoneMask"
            :error="errors.phone"
            @blur="handleBlur('phone')"
        />

        <UiInput
            v-model="form.city"
            label="Город"
            placeholder="Введите город"
            :error="errors.city"
            @blur="handleBlur('city')"
            @update:model-value="handleInput('city')"
        />

        <div class="profile-form-card__full">
          <UiTextarea
              v-model="form.about"
              label="О себе"
              placeholder="Расскажите немного о себе"
              :error="errors.about"
              @blur="handleBlur('about')"
              @update:model-value="handleInput('about')"
          />
        </div>
      </div>

      <div class="profile-form-card__actions">
        <button
            type="button"
            class="profile-form-card__button profile-form-card__button--ghost"
            @click="resetForm"
        >
          Сбросить
        </button>

        <button
            type="submit"
            class="profile-form-card__button profile-form-card__button--primary"
            :disabled="loading"
        >
          {{ loading ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>

      <p
          v-if="successMessage"
          class="profile-form-card__message profile-form-card__message--success"
      >
        {{ successMessage }}
      </p>

      <p
          v-if="submitError"
          class="profile-form-card__message profile-form-card__message--error"
      >
        {{ submitError }}
      </p>
    </form>

    <div v-else class="profile-form-card__form">
      <div class="profile-form-card__grid">
        <div class="profile-form-card__field-skeleton">
          <span class="profile-form-card__skeleton profile-form-card__skeleton--label" />
          <span class="profile-form-card__skeleton profile-form-card__skeleton--input" />
        </div>

        <div class="profile-form-card__field-skeleton">
          <span class="profile-form-card__skeleton profile-form-card__skeleton--label" />
          <span class="profile-form-card__skeleton profile-form-card__skeleton--input" />
        </div>

        <div class="profile-form-card__field-skeleton profile-form-card__full">
          <span class="profile-form-card__skeleton profile-form-card__skeleton--label" />
          <span class="profile-form-card__skeleton profile-form-card__skeleton--input" />
        </div>

        <div class="profile-form-card__field-skeleton">
          <span class="profile-form-card__skeleton profile-form-card__skeleton--label" />
          <span class="profile-form-card__skeleton profile-form-card__skeleton--input" />
        </div>

        <div class="profile-form-card__field-skeleton">
          <span class="profile-form-card__skeleton profile-form-card__skeleton--label" />
          <span class="profile-form-card__skeleton profile-form-card__skeleton--input" />
        </div>

        <div class="profile-form-card__field-skeleton profile-form-card__full">
          <span class="profile-form-card__skeleton profile-form-card__skeleton--label" />
          <span class="profile-form-card__skeleton profile-form-card__skeleton--textarea" />
        </div>
      </div>

      <div class="profile-form-card__actions">
        <span class="profile-form-card__skeleton profile-form-card__skeleton--action-button profile-form-card__skeleton--action-button-ghost" />
        <span class="profile-form-card__skeleton profile-form-card__skeleton--action-button profile-form-card__skeleton--action-button-primary" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile-form-card {
  &__form {
    display: grid;
    gap: 18px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  &__full {
    grid-column: 1 / -1;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  &__button {
    border: 0;
    padding: 14px 18px;
    border-radius: 18px;
    cursor: pointer;
    color: #f6f8ff;
    transition: 0.2s ease;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      filter: brightness(1.05);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    &--ghost {
      background: rgba(255, 255, 255, 0.08);
    }

    &--primary {
      background: linear-gradient(135deg, rgba(112, 161, 255, 0.7), rgba(0, 209, 255, 0.4));
    }
  }

  &__message {
    margin: 0;
    padding: 12px 14px;
    border-radius: 12px;

    &--success {
      color: #baf8d1;
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.24);
    }

    &--error {
      color: #fca5a5;
      background: rgba(248, 113, 113, 0.1);
      border: 1px solid rgba(248, 113, 113, 0.28);
    }
  }

  &__field-skeleton {
    display: grid;
    gap: 8px;
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
    animation: profile-form-card-shimmer 1.4s ease infinite;

    &--title {
      width: 160px;
      height: 28px;
    }

    &--text {
      display: block;
      width: 72%;
      height: 14px;
      margin-top: 6px;
    }

    &--text-wide {
      width: 100%;
    }

    &--label {
      width: 90px;
      height: 14px;
      border-radius: 8px;
    }

    &--input {
      width: 100%;
      height: 52px;
      border-radius: 16px;
    }

    &--textarea {
      width: 100%;
      height: 120px;
      border-radius: 16px;
    }

    &--action-button {
      width: 136px;
      height: 48px;
      border-radius: 18px;
    }

    &--action-button-ghost {
      opacity: 0.75;
    }

    &--action-button-primary {
      width: 148px;
    }
  }
}

@keyframes profile-form-card-shimmer {
  0% {
    background-position: -400px 0;
  }

  100% {
    background-position: 400px 0;
  }
}

@media (max-width: 768px) {
  .profile-form-card {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__actions {
      flex-direction: column;
    }

    &__full {
      grid-column: auto;
    }

    &__skeleton {
      &--text {
        width: 100%;
      }

      &--action-button,
      &--action-button-primary {
        width: 100%;
      }
    }
  }
}
</style>