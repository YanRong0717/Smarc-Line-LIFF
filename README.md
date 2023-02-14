# Smarc LINE Front-end Framework (LIFF)

## 功能介紹

* 新會員須透過 `Line` 加入`亞健康官方帳號`後加入會員
* 所有會員即可立即使用 `Line LIFF` 即時查看運動數據 (手機 Line APP、網頁瀏覽器皆可查看)
* 可根據不同場域切換不同會員資料庫
* 當日運動滿 30 分鐘簽到乙次
* 紀錄會員當月的總運動次數
* 長條圖呈現當日運動時間分段
* 折線圖呈現當週運動**分數趨勢**、**品質好壞**、**運動時間**
* 可使用不同 `Smarc ID` 切換不同會員數值
* 圖形化呈現運動評估數值，分為**上肢**、**核心**、**下肢**中
  `精準度`、`協調性`、`功能性肌力`、`功能肌耐力`、`活動度`之分數評比
* 紀錄生理數值，包含：`身高`、`體重`、`血壓`、`血糖`、`體溫`
* `Line Beacon` 於會員攜帶手機於場域附近時，將收到`亞健康官方帳號`的訊息

---

## Line LIFF UI

### 新增會員

![add member](/figures/add_member.jpg)

![add member](/figures/add_member2.jpg)


### 圖表

|運動簽到|評估結果查詢|生理數值紀錄|
|:-:|:-:|:-:|
![Check in](/figures/check_in.png)|![Enote](/figures/enote.png)|![Record](/figures/record.jpg)|

---

|全部|上肢|核心|下肢|
|:-:|:-:|:-:|:-:|
![Chart All](/figures/chart%20all.png)|![Chart 1](/figures/chart1.png)|![Chart 2](/figures/chart2.png)|![Chart 3](/figures/chart3.png)|


## 使用工具

[LINE Front-end Framework (LIFF)](https://developers.line.biz/en/docs/liff/overview/)

[Line Login](https://developers.line.biz/zh-hant/services/line-login/)

[Line Messaging API](https://developers.line.biz/zh-hant/services/messaging-api/)

[Line Beacon](https://developers.line.biz/en/docs/messaging-api/using-beacons/)

[Line FLEX MESSAGE SIMULATOR](https://developers.line.biz/flex-simulator/?status=success)

[Chart.js](https://www.chartjs.org/)
