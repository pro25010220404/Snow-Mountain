<script setup lang="ts">
import Icon from './Icon.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

const iconFor = (type: string) => (type === 'success' ? 'check' : type === 'warn' ? 'wifi-off' : 'sparkle')
const colorFor = (type: string) =>
  type === 'success' ? 'text-forest' : type === 'warn' ? 'text-amber' : 'text-brand-600'
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-6">
      <TransitionGroup name="toast">
        <div
          v-for="t in ui.toasts"
          :key="t.id"
          class="pointer-events-auto flex items-center gap-2 rounded-full bg-ink/90 px-4 py-2.5 text-sm text-white shadow-lift backdrop-blur"
        >
          <Icon :name="iconFor(t.type)" :size="16" :class="colorFor(t.type)" />
          <span>{{ t.text }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
