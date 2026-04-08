<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MeetingMapPicker from '../components/MeetingMapPicker.vue'
import UiFileUploader from "../../../components/ui/UiFileUploader.vue";
import UiUuidMultiSelect from "../../../components/ui/UiUuidMultiSelect.vue";
import { useMeetingsStore } from '../store/meetings'
import type { MeetingPlace } from '../types'
import { toDatetimeLocalValue } from '../utils/date'
import { useAuthStore } from '../../../stores/auth'
import { supabase } from '../../../lib/supabase'
import { showErrorToast } from '../../../lib/errors/showErrorToast'

const router = useRouter()
const meetingsStore = useMeetingsStore()
const authStore = useAuthStore()

const title = ref('')
const description = ref('')
const startsAt = ref(toDatetimeLocalValue())
const invitedUserIds = ref<string[]>([])
const place = ref<MeetingPlace | null>(null)
const errorMessage = ref('')

const imageFile = ref<File | null>(null)
const isUploadingImage = ref(false)

async function uploadMeetingImage(): Promise<string | null> {
  if (!imageFile.value || !authStore.user?.id) {
    return null
  }

  const file = imageFile.value
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `${authStore.user.id}/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`

  isUploadingImage.value = true

  try {
    const { error: uploadError } = await supabase.storage
        .from('meeting-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
        .from('meeting-images')
        .getPublicUrl(filePath)

    return data.publicUrl
  } finally {
    isUploadingImage.value = false
  }
}

async function submit() {
  if (!authStore.user?.id) {
    errorMessage.value = 'Пользователь не авторизован'
    return
  }

  if (!title.value.trim()) {
    errorMessage.value = 'Укажи название встречи'
    return
  }

  if (!place.value) {
    errorMessage.value = 'Выбери место на карте'
    return
  }

  errorMessage.value = ''

  try {
    const imageUrl = await uploadMeetingImage()

    const meeting = await meetingsStore.saveMeeting({
      title: title.value.trim(),
      description: description.value.trim(),
      startsAt: new Date(startsAt.value).toISOString(),
      place: place.value,
      invitedUserIds: invitedUserIds.value,
      creatorId: authStore.user.id,
      placeImageUrl: imageUrl,
    })

    router.push(`/meetings/${meeting.id}`)
  } catch (error: any) {
    errorMessage.value = error?.message || 'Не удалось создать встречу'
  }
}
</script>

<template>
  <section class="meeting-create-page">
    <header class="panel">
      <p class="meeting-create-page__eyebrow">Meetings</p>
      <h1 class="meeting-create-page__title">Новая встреча</h1>
      <p class="meeting-create-page__text">
        Спокойная форма без перегруза: название, место, время и список участников.
      </p>
    </header>

    <div class="meeting-create-page__layout">
      <section class="panel meeting-create-page__form">
        <label class="field">
          <span class="field__label">Название</span>
          <input
              v-model="title"
              type="text"
              class="field__input"
              placeholder="Например: Кофе после работы"
          />
        </label>

        <label class="field">
          <span class="field__label">Описание</span>
          <textarea
              v-model="description"
              class="field__textarea"
              rows="5"
              placeholder="О чем встреча"
          ></textarea>
        </label>

        <label class="field">
          <span class="field__label">Дата и время</span>
          <input
              v-model="startsAt"
              type="datetime-local"
              class="field__input"
          />
        </label>

        <UiUuidMultiSelect
            v-model="invitedUserIds"
            label="Участники"
            hint="Можно вставить один или несколько UUID через Enter, запятую или вставкой."
            placeholder="Вставь UUID пользователя"
        />

        <UiFileUploader
            v-model="imageFile"
            label="Картинка встречи"
            hint="PNG, JPG, WEBP. Максимум 5 МБ."
            @error="errorMessage = $event"
        />

        <p v-if="errorMessage" class="meeting-create-page__error">{{ errorMessage }}</p>

        <div
            class="meeting-create-page__submit"
            :class="{ 'is-disabled': meetingsStore.isSaving || isUploadingImage }"
            @click="!meetingsStore.isSaving && !isUploadingImage && submit()"
        >
          {{
            isUploadingImage
                ? 'Загрузка изображения…'
                : meetingsStore.isSaving
                    ? 'Сохранение…'
                    : 'Создать встречу'
          }}
        </div>
      </section>

      <section class="panel">
        <MeetingMapPicker v-model="place" />
      </section>
    </div>
  </section>
</template>

<style scoped lang="scss">
.meeting-create-page {
  display: grid;
  gap: 24px;
  padding: 24px;

  &__eyebrow {
    margin: 0 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255, 255, 255, 0.45);
    font-size: 12px;
  }

  &__title {
    margin: 0 0 8px;
    color: #fff;
    font-size: 32px;
  }

  &__text {
    margin: 0;
    color: rgba(255, 255, 255, 0.6);
  }

  &__layout {
    display: grid;
    grid-template-columns: minmax(320px, 460px) minmax(0, 1fr);
    gap: 24px;
  }

  &__form {
    display: grid;
    gap: 16px;
    align-content: start;
  }

  &__submit {
    min-height: 48px;
    padding: 0 18px;
    display: grid;
    place-items: center;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.04);
    cursor: pointer;
    user-select: none;

    &.is-disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }

  &__error {
    margin: 0;
    color: #f2aaaa;
    font-size: 14px;
  }
}

.field {
  display: grid;
  gap: 8px;

  &__label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
  }

  &__input,
  &__textarea {
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    color: #fff;
    border-radius: 16px;
    padding: 14px 16px;
    outline: none;
    resize: vertical;
  }
}

.panel {
  border-radius: 28px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
}

@media (max-width: 980px) {
  .meeting-create-page__layout {
    grid-template-columns: 1fr;
  }
}
</style>
