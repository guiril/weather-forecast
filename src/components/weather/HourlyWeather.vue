<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { CSSProperties } from 'vue';
import { getDateFromFullTime, getHoursFromFullTime } from '../../utils';

const props = defineProps<{
  hourlyWeather?: any[];
  currentDate?: number;
  currentHours?: number;
}>();

const scrollY = ref<number>(0);
const dailyWeatherList = ref<HTMLUListElement | null>(null);

const formatHours = (time: string) => {
  const weatherDate = getDateFromFullTime(time);
  const weatherHours = getHoursFromFullTime(time);

  return weatherDate === props.currentDate &&
    weatherHours === props.currentHours
    ? 'Now'
    : weatherHours;
};

const titleStyle = computed((): CSSProperties => {
  let position: CSSProperties['position'];
  let top: string;
  let right: string;
  let left: string;
  let transform: string;

  if (scrollY.value >= 166 && scrollY.value <= 315) {
    position = 'fixed';
    top = '108px';
    right = 'auto';
    left = '50%';
    transform = 'translateX(-50%)';
  } else {
    position = 'absolute';
    top = '0px';
    right = '0px';
    left = '0px';
    transform = 'translateX(0)';
  }

  return {
    position,
    top,
    right,
    left,
    transform
  };
});

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
.relative.pt-14.mb-8.bg-primary.rounded-md
  .w-full.rounded-t-md(class="max-w-[calc(100vw-64px)] sm:max-w-[640px] bg-primary" :style="titleStyle")
    span.block.pt-2.pb-5.pl-2.text-lg.font-bold.text-white.rounded-t-md(class="bg-white/60") HOURLY FORECAST
  ul.flex.pb-2.px-2.cursor-pointer.overflow-x-auto.scrollbar-hide(class="bg-white/60" ref="dailyWeatherList" @mousedown="handleMousedown" @mousemove="handleMousemove" @mouseup="handleMouseup" @mouseleave="handleMouseleave")
    li.flex.flex-col.items-center.mr-4.text-zinc-800(class="last:mr-0" v-for="hour in hourlyWeather" :key="hour.time_epoch")
      template(v-if="hour.condition")
        span.text-lg.font-medium {{ formatHours(hour.time) }}
        img.w-8.h-8.my-2(:src="hour.condition.icon")
        span.text-xl.font-medium {{ hour.temp_c }}°
      template(v-else)
        span.text-lg.font-medium {{ hour.time }}
        img.w-8.h-8.my-2(v-if="hour.title === 'Sunrise'" src="../../assets/sunrise.png")
        img.w-8.h-8.my-2(v-else src="../../assets/sunset.png")
        span.text-xl.font-medium {{ hour.title }}
</template>
