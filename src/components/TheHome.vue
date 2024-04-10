<script setup lang="ts">
import CurrentWeather from '@/components/weather/CurrentWeather.vue';
import LayoutLogo from '@/components/layouts/LayoutLogo.vue';
import SearchInput from '@/components/search/SearchInput.vue';
import SearchHistory from '@/components/search/SearchHistory.vue';
</script>

<template lang="pug">
header.flex.justify-between.items-center(class="h-[180px] mb-[60px] lg:h-auto lg:flex-col lg:pt-[30px]")
  LayoutLogo
  SearchInput
CurrentWeather
SearchHistory
</template>
