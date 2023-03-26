import React from 'react'
import Header from '../../layouts/header'
import HeaderSearch from '../../layouts/HeaderSearch'
import { useState, useEffect } from 'react'
import { Card } from '../../template'
import { useLocation, useParams } from 'react-router-dom'
import { faCny } from '@fortawesome/free-solid-svg-icons'
import MoreSquare from '../../template/MoreSquare'
import { Link } from 'react-router-dom'

function Food() {
    const [food, setFood] = useState([])
    // didMount
    useEffect(() => {
      setFood([
        {
          title: '南瓜雞肉',
          subtitle: '120',
          text: '狗狗鮮食',
          img: 'food.jpg',
        },
        {
            title: '提拉米蘇米蘭',
            subtitle: '120',
            text: '蛋糕般柔軟的皇家米蘭麵包',
            img: 'food.jpg',
          },
          {
            title: '提拉米蘇米蘭',
            subtitle: '120',
            text: '蛋糕般柔軟的皇家米蘭麵包',
            img: 'food.jpg',
          },
          {
            title: '提拉米蘇米蘭',
            subtitle: '130',
            text: '蛋糕般柔軟的皇家米蘭麵包',
            img: 'food.jpg',
          },
          {
            title: '提拉米蘇米蘭',
            subtitle: '120',
            text: '蛋糕般柔軟的皇家米蘭麵包',
            img: 'food.jpg',
          },
          {
            title: '提拉米蘇米蘭',
            subtitle: '120',
            text: '蛋糕般柔軟的皇家米蘭麵包',
            img: 'food.jpg',
          },
        
      ])
      console.log('food', food)
    }, [])
  
    return (
      <>
        <Header />
      <HeaderSearch />
        
        <div className="h-text-title">狗狗</div>
         
        <div className="card-wrap">
          {food.map((item, i) => {
            const img = require(`../../img/meals/food/${item.img}`)
            return (
              <div className="h-card col-6" key={i}>
                <div className="h-card-left col-6">
                  <div className="h-card-header">
                    <h3 className="h-card-title">{item.title}</h3>
                    <p className="h-card-subtitle">NT.{item.subtitle}</p>
                    <p className="h-card-text">{item.text}</p>
                  </div>
                  <div className="h-card-footer">
                    <span>&#9825;</span>
                    <Link to="/MealsDetail">
                      <MoreSquare />
                    </Link>
                    
                  </div>
                </div>
                <div className="h-card-right col-7">
                  <img src={img} alt="" />
                  
                </div>
              </div>
            )
          })}
          
        </div>
      </>
    )
  }
  export default Food
  