<template>
  <div class="font-sans min-h-screen flex flex-col">
    <CenterContainer class="flex-1" >
      <NuxtPage/>
    </CenterContainer>
    <TheFooter class="shrink-0" />
  </div>
</template>

<script setup lang="ts">

import CenterContainer from '~/components/layout/CenterContainer.vue'
import TheFooter from '~/components/layout/TheFooter.vue'

</script>
