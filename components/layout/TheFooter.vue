<template>
  <CenterContainer class="border-t-4 px-6 border-unobtrusive py-4">
    <div class="flex gap-1 justify-end items-center">
      <GithubLink />
      <div>|</div>
      <ToolTip text="No cookies are used in this projects">
        <LinkDefault>Cookies</LinkDefault>
      </ToolTip>
      <div>|</div>
      <Badge>
        <LinkDefault
          target="_blank"
          :href="`https://github.com/thespielplatz/foos-tsp-tools/releases/tag/${releasedVersion}`"
        >
          {{ version }}
        </LinkDefault>
      </Badge>
    </div>
  </CenterContainer>
</template>

<script setup lang="ts">
import CenterContainer from '~/components/layout/CenterContainer.vue'
import GithubLink from '~/components/content/GithubLink.vue'
import ToolTip from '~/components/layout/ToolTip.vue'
import LinkDefault from '~/components/typography/LinkDefault.vue'
import Badge from '~/components/typography/Badge.vue'

const runtimeConfig = useRuntimeConfig()

const version = ref(runtimeConfig.public.version ? `v${runtimeConfig.public.version}` : 'undefined')
const releasedVersion = ref(runtimeConfig.public.releasedVersion ? `v${runtimeConfig.public.releasedVersion}` : 'undefined')
</script>
