# Weather Forecast

- 使用 Vue 3 開發的天氣預報網頁。
- Live Demo：https://weather-forecast-opal.vercel.app

## 使用技術

- 使用 Vite 建立 Vue 3 專案，並使用 Composition API 進行開發。
- 使用 Typescript 檢查型別。
- 使用 Pug 樣板語言。
- 使用 Tailwind CSS 開發 UI 介面。
- 使用 Node.js/Express 開發簡易 API。

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
