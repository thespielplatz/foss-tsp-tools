<template>
    <CenterContainer class="border-t-4 px-6  border-unobtrusive py-4 text-end">
      <GithubLink />
      | <Tooltip text="No cookies are used in this projects">
          <LinkDefault>Cookies</LinkDefault>
        </Tooltip>
    </CenterContainer>
</template>

<script setup lang="ts">

import CenterContainer from '~/components/layout/CenterContainer.vue'
import GithubLink from '~/components/content/GithubLink.vue'
import Tooltip from '~/components/layout/Tooltip.vue'
import LinkDefault from '~/components/typography/LinkDefault.vue'

</script>
