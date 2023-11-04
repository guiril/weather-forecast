<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  formatHoursMinutes,
  getDateFromFullTime,
  getHoursFromFullTime,
  get24Hours
} from '../utils';

import LoadingIcon from './LoadingIcon.vue';
import ErrorMessage from './ErrorMessage.vue';
import CurrentWeather from './weather/CurrentWeather.vue';
import HoursWeather from './weather/HoursWeather.vue';
import DaysWeather from './weather/DaysWeather.vue';

const HISTORY_LIST_KEY = 'searchHistoryList';

const route = useRoute();

const isLoading = ref<boolean>(false);
const errorMessage = ref<string | undefined>(undefined);
const tenDaysWeather = ref<any[]>([]);
const hoursWeatherList: any[] = [];
const searchHistoryList: { location: string }[] = JSON.parse(
  localStorage.getItem(HISTORY_LIST_KEY) || '[]'
);

let paramsLocation: string | string[];
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
  const weatherDate = weather.date;
  const sunriseTime = weather.astro.sunrise;
  const sunriseHours = get24Hours(sunriseTime);
  const sunsetTime = weather.astro.sunset;
  const sunsetHours = get24Hours(sunsetTime);

  weather.hour.forEach((weather: any, index: number) => {
    const weatherHours = getHoursFromFullTime(weather.time);

    if (index >= currentHours) {
      hoursWeatherList.push(weather);
    }

    if (sunriseHours >= currentHours && sunriseHours === weatherHours) {
      hoursWeatherList.push({
        title: 'Sunrise',
        time: formatHoursMinutes(weatherDate, sunriseTime)
      });
    }

    if (sunsetHours >= currentHours && sunsetHours === weatherHours) {
      hoursWeatherList.push({
        title: 'Sunset',
        time: formatHoursMinutes(weatherDate, sunsetTime)
      });
    }
  });
};

const getTomorrowWeather = (weather: any) => {
  const weatherDate = weather.date;
  const sunriseTime = weather.astro.sunrise;
  const sunriseHours = get24Hours(sunriseTime);
  const sunsetTime = weather.astro.sunset;
  const sunsetHours = get24Hours(sunsetTime);

  weather.hour.forEach((weather: any, index: number) => {
    const weatherHours = getHoursFromFullTime(weather.time);

    if (index <= currentHours) {
      hoursWeatherList.push(weather);

      if (sunriseHours === weatherHours) {
        hoursWeatherList.push({
          title: 'Sunrise',
          time: formatHoursMinutes(weatherDate, sunriseTime)
        });
      }

      if (sunsetHours === weatherHours) {
        hoursWeatherList.push({
          title: 'Sunset',
          time: formatHoursMinutes(weatherDate, sunsetTime)
        });
      }
    }
  });
};

const getHoursWeather = (forecastday: any[]) => {
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
      await fetch(`https://weather-auth.vercel.app/current/${paramsLocation}`)
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
      await fetch(`https://weather-auth.vercel.app/forecast/${paramsLocation}`)
    ).json();

    if (response.message) {
      errorMessage.value = response.message;
      isLoading.value = false;
      throw new Error(errorMessage.value);
    }

    errorMessage.value = undefined;
    console.log('Success:', response);

    getCurrentWeather(
      response.location.name,
      response.current.temp_c,
      response.current.condition.text,
      response.forecast.forecastday[0].day.mintemp_c,
      response.forecast.forecastday[0].day.maxtemp_c
    );

    getHoursWeather(response.forecast.forecastday);
    addToHistoryList();
    tenDaysWeather.value = [...response.forecast.forecastday];
    isLoading.value = false;
  } catch (err) {
    console.error(err);
  }
};

const getLocation = () => {
  paramsLocation = route.params.location;
};

onMounted(() => {
  getLocation();
  getLocalTime();
  getForecastData();
});
</script>

<template lang="pug">
.container.flex.items-center.mb-8
  router-link.inline-block.p-2(to="/")
    img.w-6.h-6(src="../assets/left-arrow.png")
LoadingIcon(v-if="isLoading" class="mt-[180px]")
div.container.mb-10(v-else class="pb-[98px]")
  ErrorMessage(v-if="errorMessage" :message="errorMessage")
  template(v-else)
    CurrentWeather(:location="currentLocation" :temp="todayTemp" :condition="todayConditionText" :maxTemp="todayMaxTemp" :minTemp="todayMinTemp")
    HoursWeather(:hoursWeather="hoursWeatherList" :currentDate="currentDate" :currentHours="currentHours")
    DaysWeather(:tenDaysWeather="tenDaysWeather")
</template>
