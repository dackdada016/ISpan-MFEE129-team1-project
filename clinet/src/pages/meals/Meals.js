import React, { useState, useEffect, useRef } from 'react'
// import React from 'react'
import Header from '../../layouts/header'
import MealsHeaderSearch from '../meals/MealsHeaderSearch'
// import { useState, useEffect } from 'react'
import { Card } from '../../template'
import { useLocation, useParams } from 'react-router-dom'
import { faCny } from '@fortawesome/free-solid-svg-icons'
import MoreSquare from '../../template/MoreSquare'
// import { Link, } from 'react-router-dom'
// import TagSwitchingExample from '../../template/tag';npm install socket.io-client
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper'
import meals1 from '../../img/meals/meals.jpg'
import meals2 from '../../img/meals/meals2.jpg'
import meals3 from '../../img/meals/meals3.jpg'
import 'swiper/swiper-bundle.css'

function Meals() {
  const progressCircle = useRef(null)
  const progressContent = useRef(null)
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress)
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`
  }
  return (
    <>
      <div className="MealsPage">
        {/* <Header /> */}
        <br></br> 
        <MealsHeaderSearch />
        <br></br>
       
        {/* <Link to="/food">
                      <MoreSquare />
                    </Link> */}
        {/* <h2>餐點</h2> */}
        {/* <TagSwitchingExample/> */}
        {/* <div className="productContent">
          {data.map((product) => (
            <Card className="col-6" key={product.id} data={product} />
            ))}
          </div> */}
      </div>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={meals1} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={meals2} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={meals3} alt="" />
        </SwiperSlide>
      </Swiper>
    </>
  )
}
export default Meals
