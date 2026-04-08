<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useSpacesStore } from '../store/useSpacesStore'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const spacesStore = useSpacesStore()

const form = reactive({
  title: '',
  description: '',
  color: '#EC4899',
  visibility: 'private' as 'private' | 'link_only' | 'public',
  join_policy: 'invite_only' as 'invite_only' | 'link' | 'request',
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.title = ''
      form.description = ''
      form.color = '#EC4899'
      form.visibility = 'private'
      form.join_policy = 'invite_only'
    }
  },
)

async function handleSubmit() {
  await spacesStore.createNewSpace({
    title: form.title,
    description: form.description || null,
    color: form.color,
    visibility: form.visibility,
    join_policy: form.join_policy,
  })

  emit('close')
}
</script>

<template>
  <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-card">
      <div class="modal-card__header">
        <h2>Новое пространство</h2>
        <button type="button" class="icon-button" @click="emit('close')">×</button>
      </div>

      <div class="form-grid">
        <label>
          <span>Название</span>
          <input v-model="form.title" type="text" placeholder="Например, Weekend Club" />
        </label>

        <label>
          <span>Описание</span>
          <textarea v-model="form.description" rows="3" placeholder="Коротко опиши пространство" />
        </label>

        <label>
          <span>Цвет</span>
          <input v-model="form.color" type="color" />
        </label>

        <label>
          <span>Видимость</span>
          <select v-model="form.visibility">
            <option value="private">Приватное</option>
            <option value="link_only">По ссылке</option>
            <option value="public">Публичное</option>
          </select>
        </label>

        <label>
          <span>Политика вступления</span>
          <select v-model="form.join_policy">
            <option value="invite_only">Только по приглашению</option>
            <option value="link">По ссылке</option>
            <option value="request">По заявке</option>
          </select>
        </label>
      </div>

      <div class="modal-card__actions">
        <button class="primary-button" :disabled="spacesStore.isCreating" @click="handleSubmit">
          {{ spacesStore.isCreating ? 'Создание...' : 'Создать' }}
        </button>
        <button class="secondary-button" @click="emit('close')">Отмена</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; display: grid; place-items: center; background: rgba(15, 23, 42, .48); padding: 16px; z-index: 30; }
.modal-card { width: min(100%, 560px); background: #fff; border-radius: 24px; padding: 24px; display: grid; gap: 20px; box-shadow: 0 30px 60px rgba(15,23,42,.18); }
.modal-card__header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.modal-card__actions { display: flex; gap: 12px; justify-content: flex-end; }
.form-grid { display: grid; gap: 14px; }
label { display: grid; gap: 8px; }
span { font-size: 14px; font-weight: 600; color: #334155; }
input, textarea, select { width: 100%; border: 1px solid #dbe3ef; border-radius: 14px; padding: 12px 14px; font: inherit; }
input[type="color"] { min-height: 48px; padding: 6px; }
.primary-button, .secondary-button, .icon-button { border: none; cursor: pointer; font: inherit; }
.primary-button { background: #111827; color: #fff; border-radius: 14px; padding: 12px 18px; }
.secondary-button { background: #e5e7eb; color: #111827; border-radius: 14px; padding: 12px 18px; }
.icon-button { background: transparent; font-size: 24px; line-height: 1; }
</style>
