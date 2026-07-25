<script setup lang="ts">
defineProps<{
  name: string
  title?: string
  avatar?: { src: string, alt: string }
  contact?: {
    phone?: string
    email?: string
    website?: string
    github?: string
    linkedin?: string
    location?: string
  }
}>()
</script>

<template>
  <header class="cv-header">
    <div class="cv-header__media">
      <NuxtImg
        v-if="avatar"
        :src="avatar.src"
        :alt="avatar.alt"
        class="cv-header__avatar"
        width="72"
        height="72"
      />
      <div class="cv-header__identity">
        <h1 class="cv-header__name">
          {{ name }}
        </h1>
        <p
          v-if="title"
          class="cv-header__title"
        >
          {{ title }}
        </p>
      </div>
    </div>

    <ul
      v-if="contact"
      class="cv-header__contacts"
    >
      <li v-if="contact.email">
        <UIcon name="i-lucide-mail" />
        <span>{{ contact.email }}</span>
      </li>
      <li v-if="contact.phone">
        <UIcon name="i-lucide-phone" />
        <span>{{ contact.phone }}</span>
      </li>
      <li v-if="contact.github">
        <UIcon name="i-simple-icons-github" />
        <span>{{ contact.github }}</span>
      </li>
      <li v-if="contact.linkedin">
        <UIcon name="i-simple-icons-linkedin" />
        <span>{{ contact.linkedin }}</span>
      </li>
      <li v-if="contact.location">
        <UIcon name="i-lucide-map-pin" />
        <span>{{ contact.location }}</span>
      </li>
    </ul>
  </header>
</template>

<style scoped>
.cv-header {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--ui-border-muted, #eceef1);
}
.cv-header__media {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}
.cv-header__avatar {
  width: 72px;
  height: 72px;
  border-radius: 9999px;
  object-fit: cover;
}
.cv-header__identity {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}
.cv-header__name {
  font-size: 1.625rem;
  line-height: 1.1;
  font-weight: 700;
  color: var(--ui-text-highlighted, #111827);
  letter-spacing: -0.01em;
  margin: 0;
}
.cv-header__title {
  font-size: 0.9375rem;
  color: var(--ui-text-muted, #6b7280);
  font-weight: 500;
  margin: 0;
}
.cv-header__contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.8125rem;
  color: var(--ui-text-toned, #4b5563);
}
.cv-header__contacts li {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}
.cv-header__contacts :deep(span) {
  white-space: nowrap;
}
</style>
