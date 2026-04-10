<script setup lang="ts">
export interface UiTableColumn {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

defineProps<{
  columns: UiTableColumn[]
  isScrollable?: boolean
}>()
</script>

<template>
  <div
      class="ui-table"
      :class="{
      'ui-table--scrollable': isScrollable,
    }"
  >
    <div
        class="ui-table__head"
        :style="{
        gridTemplateColumns: columns.map((column) => column.width || '1fr').join(' '),
      }"
    >
      <div
          v-for="column in columns"
          :key="column.key"
          class="ui-table__head-cell"
          :class="[
          column.align ? `ui-table__cell--${column.align}` : 'ui-table__cell--left',
        ]"
      >
        {{ column.label }}
      </div>
    </div>

    <div class="ui-table__body">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.ui-table {
  display: grid;
  gap: 12px;
}

.ui-table--scrollable {
  overflow-x: auto;
}

.ui-table__head {
  display: grid;
  gap: 12px;
  align-items: center;
  min-width: max-content;
  padding: 0 16px;
}

.ui-table__head-cell {
  color: rgba(255, 255, 255, 0.52);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ui-table__body {
  display: grid;
  gap: 12px;
}

.ui-table__cell--left {
  text-align: left;
}

.ui-table__cell--center {
  text-align: center;
}

.ui-table__cell--right {
  text-align: right;
}

@media (max-width: 1100px) {
  .ui-table__head {
    min-width: 940px;
  }
}
</style>