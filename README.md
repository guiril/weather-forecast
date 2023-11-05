# Weather Forecast

- 使用 Vue 3 開發的天氣預報網頁。
- Live Demo：https://weather-forecast-opal.vercel.app

## 使用技術

- 使用 Vite 建立 Vue 3 專案，並使用 Composition API 進行開發。
- 使用 Typescript 檢查型別。
- 使用 Pug 樣板語言。
- 使用 Tailwind CSS 開發 UI 介面。
- 使用 Node.js/Express 開發簡易 [API](https://gitlab.com/guiril/weather-auth)。

## 操作方法

1. 前往 [Live Demo](https://weather-forecast-opal.vercel.app) 連結，在搜尋框輸入城市名稱，並按下 Enter。
2. 抵達天氣預報頁面可看到：
   - 目前天氣狀況。
   - 24 小時天氣預報。
      - 包含日落和日出時間。
   - 10 天的天氣預報。
      - 可透過右側選單選擇顯示天數。
      - 溫度條左側為 N 天最低溫；右側為 N 天最高溫。
3. 點擊左上角箭頭即可返回首頁。
   - 可在搜尋框下方看到搜尋過的城市目前的天氣狀況。
      - 目前只會顯示 10 筆。
      - 可透過清除按鈕清除搜尋紀錄。

## 其他紀錄

- 環境安裝參考各自的官方文件。
- Pug、SASS 不需額外設定，直接安裝就可使用。
- Vue Router 參考過去的 side project（Vue 2）進行設定。
- 時間因為有時區的問題，使用 `new Date()` 可能會產生預期外的結果。
- 參考 [Deploy an Express API to Vercel](https://www.youtube.com/watch?v=B-T69_VP2Ls) 將 Express API 部署到 Vercel。
- 天氣預報頁面的滾動效果參考 [Change Opacity On Scroll 2 | Html CSS and jQuery](https://www.youtube.com/watch?v=__9bOTBiaTM)。
- 24 小時天氣預報 X 方向拖曳滑動參考 [CodePen Home
Horizontal Click and Drag Scrolling with JS](https://codepen.io/toddwebdev/pen/yExKoj)。
