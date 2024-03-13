<script setup lang="ts">
import LayoutLogo from './layouts/LayoutLogo.vue';
import SearchInput from './search/SearchInput.vue';
import SearchHistory from './search/SearchHistory.vue';
</script>

<template lang="pug">
header.flex.justify-between.items-center(class="h-[180px] mb-[60px]")
  LayoutLogo
  SearchInput
SearchHistory
</template>
