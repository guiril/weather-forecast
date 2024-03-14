<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  formatHoursMinutes,
  getDateFromFullTime,
  getHoursFromFullTime,
  get24Hours
} from '../utils';

import SearchInput from './search/SearchInput.vue';
import LoadingIcon from './LoadingIcon.vue';
import ErrorMessage from './ErrorMessage.vue';
import CurrentWeather from './weather/CurrentWeather.vue';
import HourlyWeather from './weather/HourlyWeather.vue';
import DailyWeather from './weather/DailyWeather.vue';

const HISTORY_LIST_KEY = 'searchHistoryList';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();

const isLoading = ref<boolean>(false);
const errorMessage = ref<string | undefined>(undefined);
const dailyWeather = ref<any[]>([]);
const hourlyWeatherList: any[] = [];
const searchHistoryList: { location: string }[] = JSON.parse(
  localStorage.getItem(HISTORY_LIST_KEY) || '[]'
);
const paramsLocation = ref<string | string[]>(route.params.location || '');

let currentLocation: string;
let currentDate: number;
let currentHours: number;

let todayTemp: number;
let todayConditionText: string;
let todayMaxTemp: number;
let todayMinTemp: number;

const addToHistoryList = () => {
  const isLocationNotFound =
    searchHistoryList.findIndex(
      (item: { location: string }) => item.location === currentLocation
    ) === -1;

  if (isLocationNotFound) {
    searchHistoryList.push({
      location: currentLocation
    });

    localStorage.setItem(HISTORY_LIST_KEY, JSON.stringify(searchHistoryList));
  }
};

const getTodayWeather = (weather: any) => {
  const sunriseTime = weather.astro.sunrise;
  const sunriseHours = get24Hours(sunriseTime);
  const sunsetTime = weather.astro.sunset;
  const sunsetHours = get24Hours(sunsetTime);

  weather.hour.forEach((weather: any, index: number) => {
    const weatherHours = getHoursFromFullTime(weather.time);

    if (index >= currentHours) {
      hourlyWeatherList.push(weather);
    }

    if (sunriseHours >= currentHours && sunriseHours === weatherHours) {
      hourlyWeatherList.push({
        title: 'Sunrise',
        time: formatHoursMinutes(sunriseTime)
      });
    }

    if (sunsetHours >= currentHours && sunsetHours === weatherHours) {
      hourlyWeatherList.push({
        title: 'Sunset',
        time: formatHoursMinutes(sunsetTime)
      });
    }
  });
};

const getTomorrowWeather = (weather: any) => {
  const sunriseTime = weather.astro.sunrise;
  const sunriseHours = get24Hours(sunriseTime);
  const sunsetTime = weather.astro.sunset;
  const sunsetHours = get24Hours(sunsetTime);

  weather.hour.forEach((weather: any, index: number) => {
    const weatherHours = getHoursFromFullTime(weather.time);

    if (index <= currentHours) {
      hourlyWeatherList.push(weather);

      if (sunriseHours === weatherHours) {
        hourlyWeatherList.push({
          title: 'Sunrise',
          time: formatHoursMinutes(sunriseTime)
        });
      }

      if (sunsetHours === weatherHours) {
        hourlyWeatherList.push({
          title: 'Sunset',
          time: formatHoursMinutes(sunsetTime)
        });
      }
    }
  });
};

const getHourlyWeather = (forecastday: any[]) => {
  getTodayWeather(forecastday[0]);
  getTomorrowWeather(forecastday[1]);
};

const getCurrentWeather = (
  location: string,
  temp: number,
  condition: string,
  minTemp: number,
  maxTemp: number
) => {
  currentLocation = location;
  todayTemp = temp;
  todayConditionText = condition;
  todayMinTemp = minTemp;
  todayMaxTemp = maxTemp;
};

const getLocalTime = async () => {
  try {
    const response = await (
      await fetch(`${API_BASE_URL}/current/${paramsLocation.value}`)
    ).json();

    if (response.message) {
      throw new Error(response.message);
    }

    const localtime = response.location.localtime;
    currentDate = getDateFromFullTime(localtime);
    currentHours = getHoursFromFullTime(localtime);
  } catch (err) {
    console.error(err);
  }
};

const getForecastData = async () => {
  try {
    isLoading.value = true;

    const response = await (
      await fetch(`${API_BASE_URL}/forecast/${paramsLocation.value}`)
    ).json();

    if (response.message) {
      errorMessage.value = response.message;
      isLoading.value = false;
      throw new Error(errorMessage.value);
    }

    errorMessage.value = undefined;

    getCurrentWeather(
      response.location.name,
      response.current.temp_c,
      response.current.condition.text,
      response.forecast.forecastday[0].day.mintemp_c,
      response.forecast.forecastday[0].day.maxtemp_c
    );

    getHourlyWeather(response.forecast.forecastday);
    addToHistoryList();
    dailyWeather.value = [...response.forecast.forecastday];
    isLoading.value = false;
  } catch (err) {
    console.error(err);
  }
};

const getLocation = () => {
  paramsLocation.value = route.params.location;
};

onMounted(() => {
  getLocalTime();
  getForecastData();
});

watch(route, () => {
  getLocation();
  getLocalTime();
  getForecastData();
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
      CurrentWeather(:location="currentLocation" :temp="todayTemp" :condition="todayConditionText" :maxTemp="todayMaxTemp" :minTemp="todayMinTemp")
      .flex.flex-col.overflow-hidden
        HourlyWeather(:hourlyWeather="hourlyWeatherList" :currentDate="currentDate" :currentHours="currentHours")
        DailyWeather(:dailyWeather="dailyWeather")
</template>
