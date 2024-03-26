<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useForecastsStore } from '@/stores/weather';

const forecastStore = useForecastsStore();
const { current } = storeToRefs(forecastStore);

const scrollY = ref<number>(0);

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template lang="pug">
.bg-white.mr-10.shrink-0(class="w-[400px] py-[59px] px-[53px] rounded-[26px] lg:w-[296px] md:w-full md:mb-10 md:mx-auto md:text-center")
  span.block.font-extrabold.text-xl(class="mb-[22px] text-black/50") {{ current.condition }}
  span.block.font-bold(class="mb-[22px] text-[75px]") {{ current.temp }}°C
  .flex.items-center.mb-8.text-xl.font-bold.text-primary(class="md:justify-center")
    span.mr-5 H:{{ current.maxTemp }}°
    span L:{{ current.minTemp }}°
  h2.font-bold(class="text-[25px]") {{ current.location }}
</template>
