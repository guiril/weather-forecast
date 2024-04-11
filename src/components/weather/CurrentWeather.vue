<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

import { useForecastsStore } from '@/stores/weather';
import { useLocationStore } from '@/stores/location';
import { getCurrentWeatherAPI, getForecasetAPI } from '@/utils/axios';

const forecastStore = useForecastsStore();
const locationStore = useLocationStore();

const router = useRouter();
const props = defineProps<{
  isDefault: boolean;
}>();

let isLoading: boolean;

interface Weahter {
  icon: string;
  condition: string;
  time: string;
  temp: number | null;
  maxTemp: number | null;
  minTemp: number | null;
  location: string;
}

const weather = ref<Weahter>({
  icon: '',
  condition: '',
  time: '',
  temp: null,
  maxTemp: null,
  minTemp: null,
  location: ''
});

const resetWeather = () => {
  weather.value = {
    icon: '',
    condition: '',
    time: '',
    temp: null,
    maxTemp: null,
    minTemp: null,
    location: ''
  };
};

const getWeather = async () => {
  isLoading = true;

  if (props.isDefault) {
    try {
      await locationStore.getLocalLocation();

      const currentData = await getCurrentWeatherAPI(
        locationStore.localLocation
      );
      const forecastData = await getForecasetAPI(locationStore.localLocation);

      weather.value = {
        icon: currentData.current.condition.icon,
        condition: currentData.current.condition.text,
        time: currentData.location.localtime.split(' ')[1],
        temp: currentData.current.temp_c,
        maxTemp: forecastData.forecast.forecastday[0].day.maxtemp_c,
        minTemp: forecastData.forecast.forecastday[0].day.mintemp_c,
        location: currentData.location.name
      };

      isLoading = false;
    } catch (err) {
      console.error(err);
    }
  } else {
    weather.value = {
      icon: forecastStore.currentWeather.icon,
      condition: forecastStore.currentWeather.condition,
      time: forecastStore.currentWeather.time.split(' ')[1],
      temp: forecastStore.currentWeather.temp,
      maxTemp: forecastStore.currentWeather.maxTemp,
      minTemp: forecastStore.currentWeather.minTemp,
      location: forecastStore.searchingLocation
    };
  }

  isLoading = false;
};

const goWeahterPage = (location: string | null) =>
  router.push(`weather/${location}`);

onMounted(async () => {
  getWeather();
});

onUnmounted(() => {
  locationStore.resetLocalLocation();
  resetWeather();
});
</script>

<template lang="pug">
//- default info
.flex.flex-col.items-center(v-if="props.isDefault")
  .flex.items-center.mb-4(class="sm:mb-8")
    h2.mr-8.font-bold(class="text-[30px] sm:mr-0") Local Weather
  .w-full.bg-white.relative.text-center.cursor-pointer(class="py-[59px] px-[53px] rounded-[26px] md:mb-10 md:mx-auto md:text-center" @click="goWeahterPage(weather.location)")
    template(v-if="isLoading || !weather.location")
      .w-full.h-full.flex.flex-col.justify-center.items-center
        .loader
    template(v-else)
      .flex.justify-center.items-center
        .flex.items-center.mr-10
          img.w-8.h-8.mr-2(:src="weather.icon", :alt="weather.condition")
          span.block.font-extrabold.text-xl(class="text-black/50") {{ weather.condition }}
        span.text-xl.font-extrabold.text-primary {{ weather.time }}
      span.block.font-bold(class="mb-[22px] text-[75px]") {{ weather.temp }}°C
      .flex.justify-center.items-center.mb-8.text-xl.font-bold.text-primary(class="md:justify-center")
        span.mr-5 H:{{ weather.maxTemp }}°
        span L:{{ weather.minTemp }}°
      h2.font-bold(class="text-[25px]") {{ weather.location }}
//- search result
.bg-white.relative.mr-10.shrink-0(class="w-[400px] py-[59px] px-[53px] rounded-[26px] lg:w-[296px] md:mb-10 md:mx-auto md:text-center md:w-full" v-else)
  template(v-if="isLoading || !weather.location")
    .w-full.h-full.flex.flex-col.justify-center.items-center
      .loader
  template(v-else)
    .flex.justify-between.items-center
      .flex.items-center
        img.w-8.h-8.mr-2(:src="weather.icon", :alt="weather.condition")
        span.block.font-extrabold.text-xl(class="text-black/50") {{ weather.condition }}
      span.text-xl.font-extrabold.text-primary {{ weather.time }}
    span.block.font-bold(class="mb-[22px] text-[75px]") {{ weather.temp }}°C
    .flex.items-center.mb-8.text-xl.font-bold.text-primary(class="md:justify-center")
      span.mr-5 H:{{ weather.maxTemp }}°
      span L:{{ weather.minTemp }}°
    h2.font-bold(class="text-[25px]") {{ weather.location }}
</template>

<style lang="scss" scoped>
/*
  Loading animation from CSS Loaders website.
  https://cssloaders.github.io/
  MIT License
  Copyright (c) 2020 Vineeth.TR
*/
.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;

  &::before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    inset: 0px;
    border-radius: 50%;
    border: 5px solid #000;
    animation: prixClipFix 2s linear infinite;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}
</style>
