<script setup lang="ts">
import { computed } from 'vue'

// 图标组件：stroke 图标已预渲染为多色 PNG（/static/icons/{color}/{name}.png）
// color 取色 key；opacity 用于原 text-white/70 之类半透明场景
const props = withDefaults(
  defineProps<{
    name: string
    size?: number
    color?: string
    opacity?: number
    stroke?: number
  }>(),
  { size: 24, color: 'ink', opacity: 1, stroke: 1.8 },
)

const src = computed(() => `/static/icons/${props.color}/${props.name}.png`)
const style = computed(() => ({
  width: props.size + 'px',
  height: props.size + 'px',
  opacity: props.opacity,
}))
</script>

<template>
  <image class="icon" :src="src" :style="style" mode="aspectFit" />
</template>

<style scoped>
.icon {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
