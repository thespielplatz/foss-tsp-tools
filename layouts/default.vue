<template>
  <div class="font-sans min-h-screen flex flex-col">
    <CenterContainer class="flex-1">
      <NuxtPage />
    </CenterContainer>
    <FooterMain class="shrink-0" />
  </div>
</template>

<script setup lang="ts">
import CenterContainer from '~/components/layout/CenterContainer.vue'
</script>
