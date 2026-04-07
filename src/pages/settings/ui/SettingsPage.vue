<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePreferencesStore, type AppModule } from '../../../stores/preferences.ts'

import SettingsModulesHeader from '../../../components/settings/SettingsModulesHeader.vue'
import SettingsModuleCard from '../../../components/settings/SettingsModuleCard.vue'
import SettingsModulesSkeleton from '../../../components/settings/SettingsModulesSkeleton.vue'

import { SETTINGS_MODULE_ITEMS } from '../model/moduleItems'

const preferencesStore = usePreferencesStore()

const activeCount = computed(() =>
    Object.values(preferencesStore.modules).filter(Boolean).length,
)

async function onToggleModule(module: AppModule, value: boolean) {
  try {
    await preferencesStore.updateModule(module, value)
  } catch (error) {
    console.error('Не удалось сохранить настройки модуля:', error)
  }
}

onMounted(async () => {
  if (!preferencesStore.initialized) {
    await preferencesStore.loadSettings()
  }
})
</script>

<template>
  <section class="settings-modules-section">
    <SettingsModulesSkeleton v-if="preferencesStore.loading" />

    <template v-else>
      <SettingsModulesHeader :active-count="activeCount" />

      <div class="settings-modules-section__list">
        <SettingsModuleCard
            v-for="item in SETTINGS_MODULE_ITEMS"
            :key="item.key"
            :module-key="item.key"
            :title="item.title"
            :description="item.description"
            :badge="item.badge"
            :enabled="preferencesStore.modules[item.key]"
            :loading="preferencesStore.isModuleSaving(item.key)"
            @toggle="onToggleModule"
        />
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.settings-modules-section {
  display: grid;
  gap: 20px;
}

.settings-modules-section__list {
  display: grid;
  gap: 16px;
}
</style>