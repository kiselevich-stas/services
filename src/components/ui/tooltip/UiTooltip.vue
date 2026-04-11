<template>
  <div
      ref="wrapperRef"
      class="ui-tooltip"
      @mouseenter="open"
      @mouseleave="close"
  >
    <button
        ref="triggerRef"
        class="ui-tooltip__trigger"
        type="button"
        :aria-label="ariaLabel"
        @click="toggle"
    >
      <slot name="trigger">
        <span class="ui-tooltip__icon">?</span>
      </slot>
    </button>

    <Teleport to="body">
      <Transition name="ui-tooltip-fade">
        <div
            v-if="isOpen"
            ref="contentRef"
            class="ui-tooltip__content"
            :style="contentStyles"
            role="tooltip"
            @mouseenter="open"
            @mouseleave="close"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

interface Props {
  ariaLabel?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  offset?: number
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Показать подсказку',
  position: 'bottom',
  offset: 10,
})

const isOpen = ref(false)

const wrapperRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const coordinates = ref({
  top: 0,
  left: 0,
})

const contentStyles = computed(() => ({
  position: 'fixed',
  top: `${coordinates.value.top}px`,
  left: `${coordinates.value.left}px`,
}))

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function toggle() {
  isOpen.value = !isOpen.value
}

function updatePosition() {
  const triggerElement = triggerRef.value
  const contentElement = contentRef.value

  if (!triggerElement || !contentElement) return

  const triggerRect = triggerElement.getBoundingClientRect()
  const contentRect = contentElement.getBoundingClientRect()
  const offset = props.offset
  const viewportPadding = 8

  let top = 0
  let left = 0

  switch (props.position) {
    case 'top':
      top = triggerRect.top - contentRect.height - offset
      left = triggerRect.right - contentRect.width
      break

    case 'bottom':
      top = triggerRect.bottom + offset
      left = triggerRect.right - contentRect.width
      break

    case 'left':
      top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
      left = triggerRect.left - contentRect.width - offset
      break

    case 'right':
      top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
      left = triggerRect.right + offset
      break
  }

  const maxLeft = window.innerWidth - contentRect.width - viewportPadding
  const maxTop = window.innerHeight - contentRect.height - viewportPadding

  coordinates.value = {
    top: Math.min(Math.max(top, viewportPadding), Math.max(maxTop, viewportPadding)),
    left: Math.min(Math.max(left, viewportPadding), Math.max(maxLeft, viewportPadding)),
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node

  const clickedInsideTrigger =
      !!wrapperRef.value && wrapperRef.value.contains(target)

  const clickedInsideContent =
      !!contentRef.value && contentRef.value.contains(target)

  if (!clickedInsideTrigger && !clickedInsideContent) {
    close()
  }
}

function addListeners() {
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
  document.addEventListener('click', handleClickOutside)
}

function removeListeners() {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
  document.removeEventListener('click', handleClickOutside)
}

watch(isOpen, async (value) => {
  if (value) {
    await nextTick()
    updatePosition()
    addListeners()
  } else {
    removeListeners()
  }
})

onBeforeUnmount(() => {
  removeListeners()
})
</script>

<style scoped lang="scss">
.ui-tooltip {
  display: inline-flex;
}

.ui-tooltip__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.ui-tooltip__icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  transition: background 0.2s ease, transform 0.2s ease;
}

.ui-tooltip__trigger:hover .ui-tooltip__icon {
  background: rgba(255, 255, 255, 0.14);
  transform: scale(1.04);
}

.ui-tooltip__content {
  z-index: 9999;
  width: min(420px, 85vw);
  padding: 16px;
  border-radius: 16px;
  background: rgba(14, 19, 37, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  color: #ffffff;
}

.ui-tooltip-fade-enter-active,
.ui-tooltip-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.ui-tooltip-fade-enter-from,
.ui-tooltip-fade-leave-to {
  opacity: 0;
}
</style>