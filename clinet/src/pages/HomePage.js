import blackDog from '../img/layout/camylla-battani-JgdgKvYgiwI-unsplash.jpg'
import brownDog from '../img/layout/ayla-verschueren-bpkBLrotO28-unsplash.jpg'
import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, FreeMode, EffectFade } from 'swiper'
import { Link } from 'react-router-dom'
import HomehotelGallery from '../template/HomehotelGallery'
import Footer from '../layouts/Footer'

import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'
import 'swiper/swiper-bundle.css'
function HomePage() {
  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': 'white',
          '--swiper-navigation-size': '30px',
        }}
        centeredSlides={true}
        effect={'fade'}
        speed={2000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        slidesPerView={1}
        modules={[EffectFade, Autoplay, Pagination]}
        loop={true}
      >
        <SwiperSlide>
          <img src={blackDog} alt="" className="swiper-img" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={brownDog} alt="" className="swiper-img" />
        </SwiperSlide>
      </Swiper>

      <div className="new-word-box">最新消息</div>
      <div className="new-container">
        <div className="new-box">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            loop={true}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              '@0.00': {
                slidesPerView: 1,
                spaceBetween: 0,
                slidesPerGroup: 1,
              },
              // '@0.75': {
              //   slidesPerView: 2,
              //   spaceBetween: 20,
              // },
              '@1.00': {
                slidesPerView: 2,
                spaceBetween: 40,
                slidesPerGroup: 2,
              },
              // '@1.50': {
              //   slidesPerView: 4,
              //   spaceBetween: 50,
              // },
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div className="new">
                <div className="new-image-box">
                  <img src={blackDog} alt="" className="new-img" />
                </div>
                <div className="new-detail">
                  <div className="newcard-title">毛手毛腳野餐盒DIY</div>
                  <div className="newcard-text">2022-01-14</div>
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="new">
                <div className="new-image-box">
                  <img src={blackDog} alt="" className="new-img" />
                </div>
                <div className="new-detail">
                  <div className="newcard-title">毛手毛腳野餐盒DIY</div>
                  <div className="newcard-text">2022-01-14</div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="new">
                <div className="new-image-box">
                  <img src={brownDog} alt="" className="new-img" />
                </div>
                <div className="new-detail">
                  <div className="newcard-title">毛手毛腳野餐盒DIY</div>
                  <div className="newcard-text">2022-01-14</div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="new">
                <div className="new-image-box">
                  <img src={brownDog} alt="" className="new-img" />
                </div>
                <div className="new-detail">
                  <div className="newcard-title">毛手毛腳野餐盒DIY</div>
                  <div className="newcard-text">2022-01-14</div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <div className="about-container">
        <div className="about-row">
          <div className="col-mb-6 d-flex justify-content-center">
            <div className="card cb1 text-center">
              <div className="card-body">
                <span className="card-start fw-bold">關於毬</span>
                <p className="card-title mb-4 fw-bold">歡迎光臨~</p>
                <p className="card-text fw-bold">
                  我們是一間融合商城、餐點、課程及活動的複合式寵物友善渡假村，提供優良寵物商品及美味健康的餐點，我們也為毛孩們舉辦活動，希望飼主和寵物都能夠在毬度過美好的一天。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <section>
        <div className="homehotel-moreroom">
          <Link to="/hotel/3">
            <div className="homehotel-word">查看更多房型</div>
          </Link>
        </div> */}
      <HomehotelGallery />
      {/* <div className="homehotel">
          <div className="homehotel-box">
            <div className="homehotel-zoomin">
              <img
                src={require('../img/hotels/hotel-single.jpg')}
                alt=""
                className="homehotel-img"
              />
            </div>
          </div>
          <div className="homehotel-box">
            <div className="homehotel-zoomin">
              <img
                src={require('../img/hotels/quadruple room.jpg')}
                alt=""
                className="homehotel-img"
              />
            </div>
            <div></div>
          </div>
          <div className="homehotel-box">
            <div className="homehotel-zoomin">
              <img
                src={require('../img/hotels/standard-double-room.jpg')}
                alt=""
                className="homehotel-img"
              />
            </div>
          </div>
          <div className="homehotel-box">
            <div className="homehotel-zoomin">
              <img
                src={require('../img/hotels/tripple-room.jpg')}
                alt=""
                className="homehotel-img"
              />
            </div>
          </div>
          <div className="homehotel-box">
            <div className="homehotel-zoomin">
              <img
                src={require('../img/hotels/twin-double-room.jpg')}
                alt=""
                className="homehotel-img"
              />
            </div>
          </div>
        </div>
      </section> */}
      <Footer />
    </>
  )
}
export default HomePage
