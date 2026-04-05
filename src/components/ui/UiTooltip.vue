<template>
  <span class="ui-tooltip">
    <span
        ref="triggerRef"
        class="ui-tooltip__trigger"
        @mouseenter="showTooltip"
        @mouseleave="scheduleHideTooltip"
        @focusin="showTooltip"
        @focusout="hideTooltip"
    >
      <slot name="trigger"/>
    </span>

    <Teleport to="body">
      <Transition name="ui-tooltip-fade">
        <div
            v-if="isVisible"
            ref="contentRef"
            class="ui-tooltip__content"
            :style="contentStyle"
            @mouseenter="clearHideTimer"
            @mouseleave="scheduleHideTooltip"
        >
          <slot/>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'

type TooltipPlacement = 'top' | 'bottom'

interface Props {
  width?: number
  offset?: number
  zIndex?: number
  hideDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 300,
  offset: 10,
  zIndex: 9999,
  hideDelay: 120,
})

const isVisible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const placement = ref<TooltipPlacement>('bottom')
const hideTimer = ref<number | null>(null)

const contentStyle = ref<Record<string, string>>({
  position: 'fixed',
  top: '0px',
  left: '0px',
  width: `${props.width}px`,
  zIndex: `${props.zIndex}`,
})


function clearHideTimer(): void {
  if (hideTimer.value !== null) {
    window.clearTimeout(hideTimer.value)
    hideTimer.value = null
  }
}

function showTooltip(): void {
  clearHideTimer()
  isVisible.value = true

  nextTick(() => {
    updatePosition()
  })
}

function hideTooltip(): void {
  clearHideTimer()
  isVisible.value = false
}

function scheduleHideTooltip(): void {
  clearHideTimer()

  hideTimer.value = window.setTimeout(() => {
    isVisible.value = false
  }, props.hideDelay)
}

function updatePosition(): void {
  const triggerElement = triggerRef.value
  const contentElement = contentRef.value

  if (!triggerElement || !contentElement) {
    return
  }

  const triggerRect = triggerElement.getBoundingClientRect()
  const contentRect = contentElement.getBoundingClientRect()
  const viewportPadding = 12

  const fitsBottom =
      triggerRect.bottom + props.offset + contentRect.height <= window.innerHeight - viewportPadding

  placement.value = fitsBottom ? 'bottom' : 'top'

  const rawTop =
      placement.value === 'bottom'
          ? triggerRect.bottom + props.offset
          : triggerRect.top - contentRect.height - props.offset

  const rawLeft = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2

  const boundedLeft = Math.min(
      Math.max(rawLeft, viewportPadding),
      window.innerWidth - contentRect.width - viewportPadding,
  )

  const boundedTop = Math.max(viewportPadding, rawTop)

  contentStyle.value = {
    position: 'fixed',
    top: `${boundedTop}px`,
    left: `${boundedLeft}px`,
    width: `${props.width}px`,
    zIndex: `${props.zIndex}`,
  }
}

function handleViewportChange(): void {
  if (!isVisible.value) {
    return
  }

  updatePosition()
}

watch(
    () => props.width,
    () => {
      if (!isVisible.value) {
        return
      }

      nextTick(() => {
        updatePosition()
      })
    },
)

onMounted(() => {
  window.addEventListener('resize', handleViewportChange)
  window.addEventListener('scroll', handleViewportChange, true)
})

onBeforeUnmount(() => {
  clearHideTimer()
  window.removeEventListener('resize', handleViewportChange)
  window.removeEventListener('scroll', handleViewportChange, true)
})
</script>

<style scoped lang="scss">
.ui-tooltip {
  display: inline-flex;
  align-items: center;
}

.ui-tooltip__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-tooltip__content {
  position: fixed;
  padding: 14px;
  border-radius: 14px;
  background: #111827;
  color: #ffffff;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.08);

  max-width: min(360px, calc(100vw - 24px));
  max-height: calc(100vh - 24px);

  overflow-y: auto;
  overflow-x: hidden;

  /* красивый скролл (опционально) */
  scrollbar-width: thin;
}

.ui-tooltip__arrow {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #111827;
  transform: translateX(-50%) rotate(45deg);

  &--bottom {
    top: -6px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    border-left: 1px solid rgba(255, 255, 255, 0.08);
  }

  &--top {
    bottom: -6px;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
}

.ui-tooltip-fade-enter-active,
.ui-tooltip-fade-leave-active {
  transition: opacity 0.18s ease,
  transform 0.18s ease;
}

.ui-tooltip-fade-enter-from,
.ui-tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>