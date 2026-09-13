<script setup lang="ts">
import { RouterView } from 'vue-router'
import AchievementModal from '@/components/AchievementModal.vue'
import GlobalToast from '@/components/GlobalToast.vue'
</script>

<template>
  <div class="relative mx-auto min-h-screen w-full max-w-md overflow-x-hidden">
    <RouterView v-slot="{ Component }">
      <Transition name="route">
        <component :is="Component" />
      </Transition>
    </RouterView>

    <AchievementModal />
    <GlobalToast />
  </div>
</template>
