<script setup lang="ts">
import LayoutFooter from './components/layouts/LayoutFooter.vue';
</script>

<template lang="pug">
.min-h-screen.flex.flex-col.justify-start.items-center.p-8.bg-primary
  router-view
  LayoutFooter
</template>
