<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSpacesStore } from '../store/useSpacesStore'

const props = defineProps<{
  open: boolean
  spaceId: string
  currentCode?: string | null
}>()

const emit = defineEmits<{
  close: []
}>()

const spacesStore = useSpacesStore()
const createdLink = ref('')
const role = ref<'member' | 'admin'>('member')
const expiresAt = ref('')

const inviteLink = computed(() => {
  const code = createdLink.value || props.currentCode
  if (!code) {
    return ''
  }

  return `${window.location.origin}/#/join/${code}`
})

async function handleCreate() {
  const invite = await spacesStore.generateInvite({
    spaceId: props.spaceId,
    role: role.value,
    expiresAt: expiresAt.value ? new Date(expiresAt.value).toISOString() : null,
  })

  createdLink.value = invite.code
}

async function copyLink() {
  if (!inviteLink.value) {
    return
  }

  await navigator.clipboard.writeText(inviteLink.value)
}
</script>

<template>
  <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-card">
      <div class="modal-card__header">
        <h2>Пригласить в пространство</h2>
        <button type="button" class="icon-button" @click="emit('close')">×</button>
      </div>

      <div class="form-grid">
        <label>
          <span>Роль по ссылке</span>
          <select v-model="role">
            <option value="member">Участник</option>
            <option value="admin">Админ</option>
          </select>
        </label>

        <label>
          <span>Ссылка действует до</span>
          <input v-model="expiresAt" type="datetime-local" />
        </label>
      </div>

      <div class="modal-card__actions">
        <button class="primary-button" @click="handleCreate">Сгенерировать ссылку</button>
        <button class="secondary-button" :disabled="!inviteLink" @click="copyLink">Скопировать</button>
      </div>

      <div class="invite-result">
        <strong>Ссылка приглашения</strong>
        <div>{{ inviteLink || 'Сначала создай ссылку' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; display: grid; place-items: center; background: rgba(15, 23, 42, .48); padding: 16px; z-index: 30; }
.modal-card { width: min(100%, 560px); background: #fff; border-radius: 24px; padding: 24px; display: grid; gap: 20px; box-shadow: 0 30px 60px rgba(15,23,42,.18); }
.modal-card__header { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.modal-card__actions { display: flex; gap: 12px; }
.form-grid { display: grid; gap: 14px; }
label { display: grid; gap: 8px; }
span, strong { font-size: 14px; font-weight: 600; color: #334155; }
input, select { width: 100%; border: 1px solid #dbe3ef; border-radius: 14px; padding: 12px 14px; font: inherit; }
.primary-button, .secondary-button, .icon-button { border: none; cursor: pointer; font: inherit; }
.primary-button { background: #111827; color: #fff; border-radius: 14px; padding: 12px 18px; }
.secondary-button { background: #e5e7eb; color: #111827; border-radius: 14px; padding: 12px 18px; }
.icon-button { background: transparent; font-size: 24px; line-height: 1; }
.invite-result { display: grid; gap: 8px; background: #f8fafc; border-radius: 16px; padding: 14px; word-break: break-all; }
</style>
