import { Link } from 'react-router-dom'
import React from 'react'
import AbilityTrain from './AbilityTrain'
//圖片
// import Ball from '../img/layout/毬.svg'

function Menu() {
  return (
    <menu className="menu">
      {/* <img src={require('../img/layout/毬.svg')} alt="" /> */}

      <ul>
        {/* <li>
          <Link to="/latestNews">最新消息</Link>
        </li> */}
        <li>
          <Link to="/hotel/3">住宿</Link>
        </li>
        <li>
          {/* product帶入type_id的quretString */}
          <Link to="/product/1">商城</Link>
        </li>
        <li>
          <Link to="/meals/4">餐點</Link>
        </li>
        <li>
          <Link to="/course">課程</Link>
        </li>
        <li>
          <Link to="/activity">活動</Link>
        </li>
      </ul>
      <AbilityTrain />
    </menu>
  )
}

export default Menu
