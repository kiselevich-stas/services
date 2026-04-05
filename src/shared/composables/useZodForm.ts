import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { ZodSchema } from 'zod'

type FormErrors<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>
type Touched<T extends Record<string, unknown>> = Record<keyof T, boolean>

export function useZodForm<T extends Record<string, unknown>>(
    schema: ZodSchema<T>,
    form: Ref<T>,
) {
    const errors = ref<FormErrors<T>>({} as FormErrors<T>)
    const touched = ref<Touched<T>>(
        Object.keys(form.value).reduce((accumulator, key) => {
            accumulator[key as keyof T] = false
            return accumulator
        }, {} as Touched<T>),
    )

    const hasErrors = computed(() => {
        return Object.values(errors.value).some(Boolean)
    })

    function validateField(fieldName: keyof T): void {
        const result = schema.safeParse(form.value)

        if (result.success) {
            errors.value[fieldName] = ''
            return
        }

        const fieldIssue = result.error.issues.find((issue) => issue.path[0] === fieldName)
        errors.value[fieldName] = fieldIssue?.message ?? ''
    }

    function validateForm(): boolean {
        const result = schema.safeParse(form.value)

        if (result.success) {
            errors.value = {} as FormErrors<T>
            return true
        }

        const nextErrors = {} as FormErrors<T>

        for (const issue of result.error.issues) {
            const fieldName = issue.path[0] as keyof T | undefined

            if (!fieldName || nextErrors[fieldName]) {
                continue
            }

            nextErrors[fieldName] = issue.message
            touched.value[fieldName] = true
        }

        errors.value = nextErrors
        return false
    }

    function handleBlur(fieldName: keyof T): void {
        touched.value[fieldName] = true
        validateField(fieldName)
    }

    function handleInput(fieldName: keyof T): void {
        if (!touched.value[fieldName]) {
            return
        }

        validateField(fieldName)
    }

    function resetErrors(): void {
        errors.value = {} as FormErrors<T>

        Object.keys(touched.value).forEach((key) => {
            touched.value[key as keyof T] = false
        })
    }

    return {
        errors,
        touched,
        hasErrors,
        validateField,
        validateForm,
        handleBlur,
        handleInput,
        resetErrors,
    }
}