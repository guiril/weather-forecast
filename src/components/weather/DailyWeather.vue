<script setup lang="ts">
import { ref, computed } from 'vue';

const DEFAULT_DAYS = 3;

const props = defineProps<{
  tenDaysWeather?: any[];
}>();

const currentDays = ref<number>(DEFAULT_DAYS);

const formatDayAsAbbrev = (day: number) => {
  switch (day) {
    case 0:
      return 'Sun';
    case 1:
      return 'Mon';
    case 2:
      return 'Tue';
    case 3:
      return 'Wed';
    case 4:
      return 'Thu';
    case 5:
      return 'Fri';
    case 6:
      return 'Sat';
    default:
      return 'invalid day';
  }
};

const currentDaysWeather = computed(() => {
  if (!props.tenDaysWeather) return [];

  return props.tenDaysWeather.filter(
    (_weather, index) => index < currentDays.value
  );
});

const currentDaysMaxTemp = computed(() => {
  const maxTemps = currentDaysWeather.value.map(
    (weather) => weather.day.maxtemp_c
  );

  return Math.max(...maxTemps);
});

const currentDaysMinTemp = computed(() => {
  const minTemps = currentDaysWeather.value.map(
    (weather) => weather.day.mintemp_c
  );

  return Math.min(...minTemps);
});

const getPercentage = (value: number, range: number): string =>
  ((value / range) * 100).toFixed(2) + '%';

const getTempBarStyle = (minTemp: number, maxTemp: number) => {
  const range = currentDaysMaxTemp.value - currentDaysMinTemp.value;
  const width = maxTemp - minTemp;
  const offset = minTemp - currentDaysMinTemp.value;

  return {
    width: getPercentage(width, range),
    left: getPercentage(offset, range)
  };
};
</script>

<template lang="pug">
.relative.z-30.p-2.rounded-md(class="bg-white/60")
  .flex.justify-between.items-center.mb-5
    span.block.mr-2.text-lg.font-bold.text-white {{ currentDays }}-DAY(S) FORCAST
    select.p-1.rounded(v-model="currentDays")
      option(value="0" disabled) Select Day(s)
      option(v-for="days in DEFAULT_DAYS" :key="days" :value="days") {{ days }}
  ul.flex.flex-col
    template(v-for="(day, index) in currentDaysWeather" :key="day.date_epoch")
      li.flex.justify-between.items-center.mb-4(class="last:mb-0")
        span.w-14.text-lg.font-medium {{ index === 0 ? 'Today' : formatDayAsAbbrev(new Date(day.date).getDay()) }}
        img.w-8.h-8(:src="day.day.condition.icon")
        span.w-12.text-lg.font-medium {{ day.day.mintemp_c }}°
        .relative.h-2.mx-2.bg-white.rounded-lg(class="w-[100px]")
          span.absolute.z-10.block.h-full.bg-cyan-500.rounded-lg(:style="getTempBarStyle(day.day.mintemp_c, day.day.maxtemp_c)"
          )
        span.w-12.text-lg.font-medium {{ day.day.maxtemp_c }}°
</template>
