<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name: string; size?: number; stroke?: number }>(), {
  size: 24,
  stroke: 1.8,
})

// 线性图标集（24x24，stroke=currentColor）
const ICONS: Record<string, string> = {
  compass:
    'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm3.4-12.5-1.9 4.6-4.6 1.9 1.9-4.6 4.6-1.9Z',
  footprints:
    'M4 16v-2s2.5-1.5 4-1.5S11 13 11 15v1M20 16v-2s-2.5-1.5-4-1.5S13 13 13 15v1M7 9c1.5 1 2.5 1 4 0M17 9c1.5 1 2.5 1 4 0',
  medal: 'M8 21l2.5-3.5M16 21l-2.5-3.5M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  'chevron-right': 'M9 6l6 6-6 6',
  'arrow-left': 'M19 12H5m7 7-7-7 7-7',
  lock: 'M6 11h12v9H6v-9Zm4 0V8a2 2 0 0 1 4 0v3',
  check: 'M20 6 9 17l-5-5',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z',
  camera: 'M4 8h3l2-2h6l2 2h3v11H4V8Zm8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  share: 'M12 3v12m0-12L8 7m4-4 4 4M6 13v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6',
  fire: 'M12 21c-3.3 0-6-2.4-6-5.8 0-3.2 2-5.2 3.2-6.9C10 7 10.4 5 11 3c.3.9 1 2 2.3 3.3C14.8 8 18 10 18 15c0 3.4-2.7 6-6 6Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-12v4l2.5 2.5',
  pin: 'M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Zm0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  mountain: 'M3 20h18L14 8l-3 5-2-2-6 9Z',
  flag: 'M5 21V4m0 0h11l-2 3 2 3H5',
  walking:
    'M13 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-3 4 3-1 2 3 3 1m-8 2 2 3m4 3 2 5m-9-4 1 4m5-4-2 4M11 15l2-2',
  friends:
    'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 21v-2a4 4 0 0 0-3-3.87M16.5 4.13A3.5 3.5 0 0 1 16.5 11',
  team: 'M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM22 21v-2a4 4 0 0 0-3-3.87M15.5 4.13A3.5 3.5 0 0 1 15.5 11',
  calendar: 'M4 6h16v14H4V6Zm0 0V4h16v2M8 2v4m8-4v4M4 10h16',
  chart: 'M4 20V4m0 16h16M8 16v-5m4 5V8m4 8v-3',
  ticket: 'M3 9V5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v4a2 2 0 0 0 0 4v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a2 2 0 0 0 0-4Zm10-1v8',
  gift: 'M4 10h16v10H4V10Zm0 0V6a2 2 0 0 1 2-2c2 0 3 1.5 6 2s4-2 6-2a2 2 0 0 1 2 2v4M12 4v16',
  settings: 'M12 3a2 2 0 0 1 2 2v0a2 2 0 0 0 2 2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 0-2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 0-2-2H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 0 2-2V5a2 2 0 0 1 2-2h2Z',
  plus: 'M12 5v14M5 12h14',
  close: 'M18 6 6 18M6 6l12 12',
  trophy: 'M8 21h8m-4-3v-3m-6-9V5h12v1a6 6 0 0 1-12 0Zm12 0h3a3 3 0 0 1-3 3M6 6H3a3 3 0 0 0 3 3',
  star: 'M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.2L12 17.9 6.5 20l1-6.2L3 9.5l6.3-.9L12 3Z',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  'wifi-off': 'M2 2l20 20M8 8a10 10 0 0 1 11.7 1.4M4.7 11.4a15 15 0 0 1 4.6-2.6M19 16a7 7 0 0 0-2.5-2M9.5 17.5A3 3 0 0 1 12 17',
  route: 'M6 20a3 3 0 0 1-3-3 3 3 0 0 1 3-3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3M6 20a3 3 0 0 0 3-3V5M6 20H4',
  refresh: 'M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6',
  dot: 'M12 12h.01',
}

const d = computed(() => ICONS[props.name] ?? ICONS.dot)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="d" />
  </svg>
</template>
