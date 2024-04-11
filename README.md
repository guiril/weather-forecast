# Weather Forecast

Uses Vue 3 and Tailwind CSS to implement a weather forecast site.

## Technologies Practiced

- Uses Vite to build a Vue 3 project and utilizes the Composition API for development
- Uses Pinia for state management
- Uses Vitest and Vue Utils Test for testing
- Uses TypeScript for type checking
- Uses Pug template language
- Uses Tailwind CSS for UI development and responsive design
- Uses Node.js/Express to develop a basic API

## Screenshots

![Homepage](https://i.imgur.com/iYIQUqk.png)

![Weather Page](https://i.imgur.com/mc1VfQ9.png)

![Search History](https://i.imgur.com/mCxl8QR.png)

## Instructions

1. On the homepage, you can see the local weather for the user's location along with a search box.
2. Enter the city name in the search box, and press Enter.
3. Upon reaching the weather forecast page, you can see:
   - current weather conditions
   - 24-hour weather forecast
      - including sunset and sunrise times
   - 3-day weather forecast
      - You can select the number of days to display using the menu on the right.
      - The temperature bar shows the lowest temperature on the left side and the highest temperature on the right side for the selected number of days.
4. Click the arrow in the top left corner to return to the homepage.
   - You can see the current weather conditions of searched cities below the local weather.
     - Only the last 10 searches will be displayed.
     - You can clear the search history using the clear button.
