<template>
    <CenterContainer class="border-t-4 px-6 border-unobtrusive py-4">
      <div class="flex gap-1 justify-end">
        <GithubLink />
        <div>|</div>
        <Tooltip text="No cookies are used in this projects">
          <LinkDefault>Cookies</LinkDefault>
        </Tooltip>
        <div>|</div>
        <div>
          <LinkDefault target="_blank" :href="`https://github.com/thespielplatz/foos-tsp-tools/releases/tag/${version}`">{{ version }}</LinkDefault>
        </div>
      </div>
    </CenterContainer>
</template>

<script setup lang="ts">

import CenterContainer from '~/components/layout/CenterContainer.vue'
import GithubLink from '~/components/content/GithubLink.vue'
import Tooltip from '~/components/layout/Tooltip.vue'
import LinkDefault from '~/components/typography/LinkDefault.vue'

const runtimeConfig = useRuntimeConfig()

const version = ref('undefined')

onBeforeMount(() => {
  if (runtimeConfig.public.version) {
    version.value = `v${runtimeConfig.public.version}`
  }
})

</script>
