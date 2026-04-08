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

const registerSchema = z
    .object({
      email: z
          .string()
          .min(1, 'Введите email')
          .email('Введите корректный email'),
      password: z
          .string()
          .min(1, 'Введите пароль')
          .min(6, 'Пароль должен содержать минимум 6 символов'),
      confirmPassword: z
          .string()
          .min(1, 'Подтвердите пароль'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Пароли не совпадают',
      path: ['confirmPassword'],
    })

type RegisterFormValues = z.infer<typeof registerSchema>

const form = ref<RegisterFormValues>({
  email: '',
  password: '',
  confirmPassword: '',
})

const submitError = ref('')
const submitSuccess = ref('')

const {
  errors: formErrors,
  hasErrors,
  validateForm,
  handleBlur,
  handleInput,
  resetErrors,
} = useZodForm(registerSchema, form)

const hasAnyErrors = computed(() => {
  return Boolean(hasErrors.value || submitError.value)
})

function getRegisterErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Не удалось выполнить регистрацию. Попробуйте ещё раз.'
  }

  const message = error.message.toLowerCase().trim()

  if (message.includes('user already registered')) {
    return 'Пользователь с таким email уже зарегистрирован'
  }

  if (message.includes('password should be at least')) {
    return 'Пароль слишком короткий'
  }

  if (message.includes('failed to fetch')) {
    return 'Не удалось подключиться к серверу. Проверьте интернет-соединение'
  }

  return 'Не удалось выполнить регистрацию. Проверьте введённые данные'
}

function handleFieldInput(fieldName: keyof RegisterFormValues): void {
  submitError.value = ''
  submitSuccess.value = ''
  handleInput(fieldName)
}

async function handleRegister(): Promise<void> {
  submitError.value = ''
  submitSuccess.value = ''

  const isValid = validateForm()

  if (!isValid) {
    return
  }

  try {
    await authStore.register(form.value.email, form.value.password)

    submitSuccess.value =
        'Регистрация прошла успешно. Проверьте почту для подтверждения email.'

    form.value = {
      email: '',
      password: '',
      confirmPassword: '',
    }

    resetErrors()

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error) {
    submitError.value = getRegisterErrorMessage(error)
  }
}
</script>

<template>
  <div class="auth-page">
    <section class="panel auth-panel">
      <div class="panel__header">
        <h1 class="panel__title">Регистрация</h1>
        <p class="panel__text">
          Создайте аккаунт, чтобы управлять своими ожиданиями
        </p>
      </div>

      <form class="auth-form" @submit.prevent="handleRegister">
        <UiInput
            id="email"
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="Введите email"
            :error="formErrors.email"
            @blur="handleBlur('email')"
            @update:model-value="handleFieldInput('email')"
        />

        <UiInput
            id="password"
            v-model="form.password"
            label="Пароль"
            type="password"
            placeholder="Введите пароль"
            :error="formErrors.password"
            @blur="handleBlur('password')"
            @update:model-value="handleFieldInput('password')"
        />

        <UiInput
            id="confirmPassword"
            v-model="form.confirmPassword"
            label="Подтвердите пароль"
            type="password"
            placeholder="Повторите пароль"
            :error="formErrors.confirmPassword"
            @blur="handleBlur('confirmPassword')"
            @update:model-value="handleFieldInput('confirmPassword')"
        />

        <UiButton
            label="Зарегистрироваться"
            variant="primary"
            size="md"
            type="submit"
            full-width
            :loading="authStore.loading"
        />

        <div v-if="submitError" class="auth-alert">
          {{ submitError }}
        </div>

        <div v-if="submitSuccess" class="auth-success">
          {{ submitSuccess }}
        </div>

        <p v-else-if="hasAnyErrors" class="auth-hint">
          Проверьте заполнение формы
        </p>

        <p class="auth-link-text">
          Уже есть аккаунт?
          <RouterLink to="/login" class="auth-link">
            Войти
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

.auth-success {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(74, 222, 128, 0.28);
  background: rgba(74, 222, 128, 0.1);
  color: #86efac;
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