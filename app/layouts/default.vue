<script setup lang="ts">
</script>

<template>
  <div>
    <UContainer class="sm:border-x border-default pt-10 print:border-0 print:pt-0">
      <AppHeader
        class="print:hidden"
        :links="navLinks"
      />
      <slot />
      <AppFooter class="print:hidden" />
    </UContainer>
  </div>
</template>
