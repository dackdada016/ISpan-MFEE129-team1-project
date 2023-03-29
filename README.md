# 第一組專題
> 此專案為ISpan 前端工程師就業養成班 129 期 第一組 毬 project  <br />
> 打造讓使用者在本網站上輕鬆查找資訊並購買寵物有關商品的網頁。

## 協作者
*  [Chu-Ya Hsu](https://github.com/410302007) 
*  [Jin22221](https://github.com/Jin22221) 
*  [4A555076](https://github.com/410302007) 
*  [Eric Tsai](https://github.com/hiphop200199) 
*  [zackliuzicheng](https://github.com/zackliuzicheng) 

## 使用技術/工具 :
*  框架 - React
*  網頁功能 - HTML CSS JavaScript
*  版本控制 - Github 
*  版控GUI - Tortoisegit
*  後端串接 - Node.js express 
*  資料庫 - MySQL
*  UI設計 - Figma Illustrator Photoshop

## 執行方式
### 前端 React(版本號^18.2.0)
>  #### `npm install -g yarn ` clinet資料夾安裝yarn管理工具
>  #### `yarn install ` clinet資料夾使用install即可安裝使用套件
>  #### `yarn start ` 開始使用本專案

### 後端 Sever
>  #### 下載 Node.js(版本號v18.12.1) https://nodejs.org/en
>  #### `npm install ` Server資料夾安裝使用套件
>  #### ` nodemon ` 終端機執行啟用後台管理網頁

## 套件版本 
* "ejs": "^3.1.8",
* "express": "^4.18.2",
* "express-mysql-session": "^2.1.8",
* "mysql2": "^3.0.1",
* "dotenv": "^16.0.3",

> 資料庫為MySQL

## 資料夾說明
### clinet
> src : App.js為元件導入及Route設定頁,以下資料夾皆在src內
  1. layouts > 導覽列及主要畫面顯示區塊
  2. pages > 所有功能頁面
  3. template > 共用元件放置的資料夾
  4. style > 樣式所在資料夾
>  __.gitignore__ 必須將node_modules加入，避免巨大的套件模組資料被上傳
### server
> index.js 為 middleware 及 routes 相關設定
1. modules > SQL連線相關設定及圖片上傳設定
2. public > 圖片儲存的資料夾
3. routes > 各功能頁面及api


