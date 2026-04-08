<script setup lang="ts">
import { computed, ref } from 'vue'
import UiButton from './ui/UiButton.vue'
import UiInput from './ui/UiInput.vue'
import UiModal from './ui/UiModal.vue'
import UiSelect from './ui/UiSelect.vue'
import { useZodForm } from '../composables/useZodForm'
import { createInviteSchema } from '../types/spaces.schemas'
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

const form = useZodForm({
  schema: createInviteSchema,
  initialValues: {
    role: 'member',
    expiresAt: null,
  },
})

const roleOptions = [
  { label: 'Участник', value: 'member' },
  { label: 'Админ', value: 'admin' },
]

const inviteLink = computed(() => {
  const code = createdLink.value || props.currentCode

  if (!code) {
    return ''
  }

  return `${window.location.origin}/#/join/${code}`
})

async function handleCreate() {
  try {
    const invite = await spacesStore.generateInvite({
      spaceId: props.spaceId,
      role: form.values.role,
      expiresAt: form.values.expiresAt,
    })

    console.log('invite', invite)
    createdLink.value = invite.code
  } catch (error) {
    console.error('Ошибка при создании ссылки:', error)
  }
}

async function copyLink() {
  if (!inviteLink.value) {
    return
  }

  await navigator.clipboard.writeText(inviteLink.value)
}
</script>

<template>
  <UiModal :open="open" title="Пригласить в пространство" @close="emit('close')">
    <div class="invite-modal">
      <UiSelect
        v-model="form.values.role"
        label="Роль по ссылке"
        :options="roleOptions"
        :error="form.errors.role"
      />

      <UiInput
        :model-value="form.values.expiresAt ? form.values.expiresAt.slice(0, 16) : ''"
        type="datetime-local"
        label="Ссылка действует до"
        :error="form.errors.expiresAt"
        @update:model-value="form.values.expiresAt = $event ? new Date($event).toISOString() : null"
      />

      <div class="invite-modal__actions">
        <UiButton @click="handleCreate">Сгенерировать ссылку</UiButton>
        <UiButton variant="secondary" :disabled="!inviteLink" @click="copyLink">Скопировать</UiButton>
      </div>

      <div class="invite-modal__result">
        <label>Ссылка приглашения</label>
        <div>{{ inviteLink || 'Сначала создай ссылку' }}</div>
      </div>
    </div>
  </UiModal>
</template>

<style scoped lang="scss">
.invite-modal {
  display: grid;
  gap: 16px;
}
.invite-modal__actions {
  display: flex;
  gap: 12px;
}
.invite-modal__result {
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 16px;
  background: #f9fafb;

  label {
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
  }

  div {
    word-break: break-all;
    color: #111827;
    font-size: 14px;
    line-height: 1.5;
  }
}
</style>
