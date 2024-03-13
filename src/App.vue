<script setup lang="ts">
import LayoutFooter from './components/layouts/LayoutFooter.vue';
</script>

<template lang="pug">
.min-h-screen.bg-neutral-0
  .container
    router-view
    LayoutFooter
</template>
