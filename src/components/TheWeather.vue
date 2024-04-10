<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import { storeToRefs } from 'pinia';
import { useForecastsStore } from '@/stores/weather';

import SearchInput from '@/components/search/SearchInput.vue';
import LoadingIcon from '@/components/LoadingIcon.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import CurrentWeather from '@/components/weather/CurrentWeather.vue';
import HourlyWeather from '@/components/weather/HourlyWeather.vue';
import DailyWeather from '@/components/weather/DailyWeather.vue';

const route = useRoute();

const forecastStore = useForecastsStore();
const { isLoading, errorMessage } = storeToRefs(forecastStore);

const paramsLocation = ref<string | string[]>(route.params.location || '');

const getLocation = () => {
  paramsLocation.value = route.params.location;
};

onMounted(() => {
  forecastStore.getForecasts(paramsLocation.value);
});

watch(route, () => {
  getLocation();
  forecastStore.getForecasts(paramsLocation.value);
});
</script>

<template lang="pug">
header.flex.justify-between.items-center(class="h-[180px] mb-[60px] lg:flex-col")
  router-link.flex(to="/" class="lg:pt-[30px]")
    img.mr-5(src="../assets/images/left-arrow.svg", alt="go back home")
    img(class="", src="../assets/images/logo.svg", alt="logo")
  SearchInput
LoadingIcon(v-if="isLoading")
main(v-else class="")
  ErrorMessage(v-if="errorMessage" :message="errorMessage")
  template(v-else)
    .flex.justify-between(class="mb-[66px] md:flex-col")
      CurrentWeather
      .flex.flex-col.overflow-hidden
        HourlyWeather
        DailyWeather
</template>
