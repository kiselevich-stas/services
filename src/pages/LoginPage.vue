<script setup lang="ts">
import { computed, ref } from 'vue'
import { z } from 'zod'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth.ts'
import UiButton from '../components/ui/UiButton.vue'
import UiInput from '../components/ui/UiInput.vue'
import { useZodForm } from '../shared/composables/useZodForm'

const router = useRouter()
const authStore = useAuthStore()

const loginSchema = z.object({
  email: z
      .string()
      .min(1, 'Введите email')
      .email('Введите корректный email'),
  password: z
      .string()
      .min(1, 'Введите пароль')
      .min(6, 'Пароль должен содержать минимум 6 символов'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const form = ref<LoginFormValues>({
  email: '',
  password: '',
})

const submitError = ref('')

const {
  errors: formErrors,
  hasErrors,
  validateForm,
  handleBlur,
  handleInput,
} = useZodForm(loginSchema, form)

const hasAnyErrors = computed(() => {
  return Boolean(hasErrors.value || submitError.value)
})

function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Не удалось выполнить вход. Попробуйте ещё раз.'
  }

  const message = error.message.toLowerCase().trim()

  if (message.includes('invalid login credentials')) {
    return 'Неверный email или пароль'
  }

  if (message.includes('email not confirmed')) {
    return 'Подтвердите email перед входом'
  }

  if (message.includes('too many requests')) {
    return 'Слишком много попыток входа. Попробуйте позже'
  }

  if (message.includes('failed to fetch')) {
    return 'Не удалось подключиться к серверу. Проверьте интернет-соединение'
  }

  return 'Не удалось выполнить вход. Проверьте введённые данные'
}

async function handleLogin(): Promise<void> {
  submitError.value = ''

  const isValid = validateForm()

  if (!isValid) {
    return
  }

  try {
    await authStore.login(form.value.email, form.value.password)
    await router.push('/countdowns')
  } catch (error) {
    submitError.value = getAuthErrorMessage(error)
  }
}
</script>

<template>
  <div class="auth-page">
    <section class="panel auth-panel">
      <div class="panel__header">
        <h1 class="panel__title">Вход</h1>
        <p class="panel__text">
          Войдите, чтобы управлять своими ожиданиями
        </p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <UiInput
            id="email"
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Введите email"
            :error="formErrors.email"
            @blur="handleBlur('email')"
            @update:model-value="handleInput('email')"
        />

        <UiInput
            id="password"
            v-model="form.password"
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            :error="formErrors.password"
            @blur="handleBlur('password')"
            @update:model-value="handleInput('password')"
        />

        <UiButton
            label="Войти"
            variant="primary"
            size="md"
            type="submit"
            full-width
            :loading="authStore.loading"
        />

        <div v-if="submitError" class="auth-alert">
          {{ submitError }}
        </div>

        <p v-else-if="hasAnyErrors" class="auth-hint">
          Проверьте заполнение формы
        </p>

        <p class="auth-link-text">
          Нет аккаунта?
          <RouterLink to="/register" class="auth-link">
            Зарегистрироваться
          </RouterLink>
        </p>
      </form>
    </section>
  </div>
</template>

<style scoped lang="scss">
.auth-page {
  display: flex;
  justify-content: center;
}

.auth-panel {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.auth-alert {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(248, 113, 113, 0.28);
  background: rgba(248, 113, 113, 0.1);
  color: #fca5a5;
  font-size: 14px;
  line-height: 1.4;
}

.auth-hint {
  margin: 0;
  color: rgba(255, 255, 255, 0.56);
  font-size: 13px;
  text-align: center;
}

.auth-link-text {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
  text-align: center;
}

.auth-link {
  color: #a78bfa;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #c4b5fd;
  }
}
</style>