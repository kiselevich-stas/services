import { computed, reactive, ref } from 'vue'
import type { ZodError, ZodSchema } from 'zod'

export function useZodForm<TForm extends Record<string, unknown>>(options: {
  schema: ZodSchema<TForm>
  initialValues: TForm
}) {
  const values = reactive({ ...options.initialValues }) as TForm
  const errors = reactive<Record<string, string>>({})
  const isSubmitting = ref(false)

  function setErrorsFromZod(error: ZodError<TForm>) {
    Object.keys(errors).forEach((key) => delete errors[key])

    for (const issue of error.issues) {
      const path = issue.path.join('.')
      if (path && !errors[path]) {
        errors[path] = issue.message
      }
    }
  }

  function clearErrors() {
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  function validate(): boolean {
    const result = options.schema.safeParse(values)

    if (!result.success) {
      setErrorsFromZod(result.error)
      return false
    }

    clearErrors()
    return true
  }

  async function submit(handler: (payload: TForm) => Promise<void> | void) {
    const result = options.schema.safeParse(values)

    if (!result.success) {
      setErrorsFromZod(result.error)
      return
    }

    clearErrors()
    isSubmitting.value = true

    try {
      await handler(result.data)
    } finally {
      isSubmitting.value = false
    }
  }

  const hasErrors = computed(() => Object.keys(errors).length > 0)

  return {
    values,
    errors,
    hasErrors,
    isSubmitting,
    validate,
    clearErrors,
    submit,
  }
}
