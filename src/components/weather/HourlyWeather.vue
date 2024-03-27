<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getDateFromFullTime, getHoursFromFullTime } from '@/utils';

import { storeToRefs } from 'pinia';
import { useForecastsStore } from '@/stores/weather';

const forecastStore = useForecastsStore();
const { hourlyForecasts, currentDate, currentHours } =
  storeToRefs(forecastStore);

const scrollY = ref<number>(0);
const dailyWeatherList = ref<HTMLUListElement | null>(null);

const formatHours = (time: string) => {
  const weatherDate = getDateFromFullTime(time);
  const weatherHours = getHoursFromFullTime(time);

  return weatherDate === currentDate.value &&
    weatherHours === currentHours.value
    ? 'Now'
    : weatherHours;
};

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

// horizontal scrolling is inspired by https://codepen.io/toddwebdev/pen/yExKoj
let isMousedown = false;
let startX: number;
let scrollLeft: number;

const handleMousedown = (evt: MouseEvent) => {
  if (!dailyWeatherList.value) return;

  isMousedown = true;
  startX = evt.pageX - dailyWeatherList.value.offsetLeft;
  scrollLeft = dailyWeatherList.value.scrollLeft;
};

const handleMousemove = (evt: MouseEvent) => {
  if (!isMousedown || !dailyWeatherList.value) return;

  evt.preventDefault();

  const x = evt.pageX - dailyWeatherList.value.offsetLeft;
  const distance = (x - startX) * 1.5;

  dailyWeatherList.value.scrollLeft = scrollLeft - distance;
};

const handleMouseup = () => (isMousedown = false);
const handleMouseleave = () => (isMousedown = false);

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template lang="pug">
.mb-10.overflow-hidden
  h3.font-bold(class="mb-[38px] text-[20px] text-black") HOURLY FORECAST
  ul.flex.justify-start.cursor-pointer.overflow-x-auto(class="" ref="dailyWeatherList" @mousedown="handleMousedown" @mousemove="handleMousemove" @mouseup="handleMouseup" @mouseleave="handleMouseleave")
    li.flex.flex-col.items-center.shrink-0(class="p-[18px]" v-for="hour in hourlyForecasts" :key="hour.time_epoch")
      template(v-if="hour.condition")
        span.text-xs.font-bold(class="text-neutral-50") {{ formatHours(hour.time) }}
        img.w-16.my-2(:src="hour.condition.icon")
        span.text-xs.font-bold.text-black {{ hour.temp_c }}°
      template(v-else)
        span.text-xs.font-bold(class="text-neutral-50") {{ hour.time }}
        img.w-16.my-2(v-if="hour.title === 'Sunrise'" src="../../assets/images/sunrise.svg")
        img.w-16.my-2(v-else src="../../assets/images/sunset.svg")
        span.text-xs.font-bold.text-black {{ hour.title }}
</template>
