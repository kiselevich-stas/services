<script setup lang="ts">
import { useRouter } from 'vue-router'
import UiButton from './ui/UiButton.vue'
import UiInput from './ui/UiInput.vue'
import UiSelect from './ui/UiSelect.vue'
import UiTextarea from './ui/UiTextarea.vue'
import { useZodForm } from '../composables/useZodForm'
import { createSpaceSchema } from '../types/spaces.schemas'
import { useSpacesStore } from '../store/useSpacesStore'

const router = useRouter()
const spacesStore = useSpacesStore()

const form = useZodForm({
  schema: createSpaceSchema,
  initialValues: {
    title: '',
    description: '',
    color: '#EC4899',
    visibility: 'private',
    join_policy: 'link',
  },
})

const visibilityOptions = [
  { label: 'Приватное', value: 'private' },
  { label: 'Только по ссылке', value: 'link_only' },
  { label: 'Публичное', value: 'public' },
]

const policyOptions = [
  { label: 'Только по приглашению', value: 'invite_only' },
  { label: 'Вход по ссылке', value: 'link' },
  { label: 'По запросу', value: 'request' },
]

async function handleSubmit() {
  await form.submit(async (payload) => {
    const space = await spacesStore.createNewSpace(payload)
    await router.push(`/spaces/${space.id}`)
  })
}
</script>

<template>
  <form class="space-form" @submit.prevent="handleSubmit">
    <UiInput
      v-model="form.values.title"
      label="Название пространства"
      placeholder="Например, Наши вылазки"
      :error="form.errors.title"
    />

    <UiTextarea
      v-model="form.values.description"
      label="Описание"
      placeholder="Что это за пространство и зачем оно нужно"
      :error="form.errors.description"
    />

    <div class="space-form__grid">
      <UiInput
        v-model="form.values.color"
        label="Основной цвет"
        placeholder="#EC4899"
        :error="form.errors.color"
      />

      <UiSelect
        v-model="form.values.visibility"
        label="Видимость"
        :options="visibilityOptions"
        :error="form.errors.visibility"
      />
    </div>

    <UiSelect
      v-model="form.values.join_policy"
      label="Способ вступления"
      :options="policyOptions"
      :error="form.errors.join_policy"
    />

    <div class="space-form__preview" :style="{ background: `linear-gradient(135deg, ${form.values.color}, #111827)` }">
      <span>Preview</span>
      <strong>{{ form.values.title || 'Новое пространство' }}</strong>
      <p>{{ form.values.description || 'Тут будет описание пространства' }}</p>
    </div>

    <div class="space-form__actions">
      <UiButton type="submit">Создать пространство</UiButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.space-form {
  display: grid;
  gap: 18px;
  padding: 24px;
  border-radius: 28px;
  background: #fff;
  border: 1px solid #eef2f7;
  box-shadow: 0 16px 40px rgba(17, 24, 39, .05);
}
.space-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.space-form__preview {
  padding: 18px;
  border-radius: 24px;
  color: #fff;

  span {
    display: inline-block;
    margin-bottom: 10px;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.16);
    font-size: 12px;
    font-weight: 700;
  }

  strong {
    display: block;
    font-size: 22px;
    margin-bottom: 8px;
  }

  p {
    margin: 0;
    color: rgba(255,255,255,.82);
    line-height: 1.5;
  }
}
.space-form__actions {
  display: flex;
  justify-content: flex-end;
}
</style>
