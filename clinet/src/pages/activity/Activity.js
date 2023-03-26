import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SignUp from '../../template/SignUp'
import { EventRegistration } from '../../template'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, FreeMode, EffectFade } from 'swiper'
import cat from '../../img/activity/activityhome1.png'
import dog from '../../img/activity/activityhome2.png'
// import twodog from '../../img/activity/activityhome3.png'
import Paginationn from '../../template/Paginationn'
import Footer from '../../layouts/Footer'
import { FiSearch } from 'react-icons/fi'

function Activity() {
  const [activity, setActivity] = useState([])
  const [activityName, setActivityName] = useState('')
  // const [isFilterActive, setIsFilterActive] = useState('')
  // const [button, setButton] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(9)
  const [pageNumberLimit, setPageNumberLimit] = useState(5)
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(5)
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0)

  useEffect(() => {
    fetch(`http://localhost:3002/activity/activity-list/api`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((activity) => {
        console.log(typeof activity)

        const activities = [...activity]
        activities.forEach((el) => {
          console.log(el)
          const activities = [...activity]
          const img = el.activity_image.split(',')
          const bigImage = img[0]
          el.activity_img = bigImage
          console.log('activities', activities)
        })

        // Sort activities by date
        activities.sort((a, b) => {
          const aDate = new Date(a.activity_dateend).getTime()
          const bDate = new Date(b.activity_dateend).getTime()
          return bDate - aDate
        })

        setActivity(activities)
      })
      .catch((error) => console.error(error))
  }, [activityName])

  const now = new Date().getTime()
  const lastPostIndex = currentPage * postsPerPage
  const firstPostIndex = lastPostIndex - postsPerPage
  const currentPost = activity.slice(firstPostIndex, lastPostIndex)

  const TypeCat = () => {
    fetch(`http://localhost:3002/activity/activity-list/api`)
      .then((res) => res.json())
      .then((activity) => {
        const activities = [...activity]
        activities.forEach((el) => {
          console.log(el)
          const activities = [...activity]
          const img = el.activity_image.split(',')
          const bigImage = img[0]
          el.activity_img = bigImage
          console.log('activities', activities)
        })

        setActivity(activity)
        const cat = activity.filter((el) => el.activity_pettype === 3)
        setActivity(cat)
      })
      .catch((error) => console.log(error))
  }
  const TypeDog = () => {
    fetch(`http://localhost:3002/activity/activity-list/api`)
      .then((res) => res.json())
      .then((activity) => {
        const activities = [...activity]
        activities.forEach((el) => {
          console.log(el)
          const activities = [...activity]
          const img = el.activity_image.split(',')
          const bigImage = img[0]
          el.activity_img = bigImage
          console.log('activities', activities)
        })
        setActivity(activity)
        const dog = activity.filter((el) => el.activity_pettype === 2)
        setActivity(dog)
      })
      .catch((error) => console.log(error))
  }
  const TypeAll = () => {
    fetch(`http://localhost:3002/activity/activity-list/api`)
      .then((res) => res.json())
      .then((activity) => {
        const activities = [...activity]
        activities.forEach((el) => {
          console.log(el)
          const activities = [...activity]
          const img = el.activity_image.split(',')
          const bigImage = img[0]
          el.activity_img = bigImage
          console.log('activities', activities)
        })
        setActivity(activity)
        const all = activity.filter((el) => el.activity_pettype === 1)
        setActivity(all)
      })
      .catch((error) => console.log(error))
  }
  const findOneActivity = () => {
    if (activityName !== '') {
      let text = activityName
      let regex = new RegExp(`.*${text}.*`, 'i')
      const data = activity.filter((el) => el.activity_name.match(regex))
      setActivity(data)
    } else {
      return
    }
  }

  // const ascendTimeActivity = () => {
  //   const asc = activity.sort((a, b) => {
  //     const aDate = new Date(a.activity_datestart).getTime()
  //     const bDate = new Date(b.activity_datestart).getTime()
  //     return aDate - bDate
  //   })
  //   setActivity(asc)
  // }
  // const descendTimeActivity = () => {
  //   const desc = activity.sort((a, b) => {
  //     const aDate = new Date(a.activity_datestart).getTime()
  //     const bDate = new Date(b.activity_datestart).getTime()
  //     return bDate - aDate
  //   })
  //   setActivity(desc)
  // }

  return (
    <>
      <div className="banner-swiper">
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
          className="activity-home-swiper"
        >
          <SwiperSlide>
            <img src={cat} alt="banner-img" className="swiper-img" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={dog} alt="" className="swiper-img" />
          </SwiperSlide>
          {/* <SwiperSlide>
            <img src={twodog} alt="" className="swiper-img" />
          </SwiperSlide> */}
        </Swiper>
      </div>

      <div className="activity-title">
        <h1 className="activity-banner-word">館內活動</h1>
        <div className="activity-title-box">
          <span className="activity-search-tags">
            <button className="activity-tag" onClick={TypeCat}>
              #貓
            </button>

            <button className="activity-tag" onClick={TypeDog}>
              #狗
            </button>

            <button className="activity-tag" onClick={TypeAll}>
              #所有
            </button>
          </span>
          <div className="activity-searchbar">
            <input
              type="text"
              className="activity-search-input"
              onChange={(e) => {
                setActivityName(e.target.value)
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  findOneActivity()
                }
              }}
              placeholder="搜尋"
            />
            <FiSearch className="activity-search-icon" />
          </div>

          {/* <div className="price-button-wrapper">
          <button className="time-ascend-order" onClick={ascendTimeActivity}>
            由遠至進
          </button>
          <button className="price-descend-order" onClick={descendTimeActivity}>
            由進至遠
          </button>
        </div> */}
        </div>
      </div>

      <div className="activity-card-page">
        <div className="activity-cards">
          {currentPost.map((el, idx) => {
            const endDate = new Date(el.activity_dateend).getTime()
            const expired = endDate > now
            return (
              <Link to={`/activitydetail/${el.activity_id}`}>
                <div className="acard" key={idx}>
                  <img
                    src={`http://localhost:3002/uploads/${el.activity_img}`}
                    alt=""
                    className="activity-card-img"
                  />
                  <div className="activity-card-content">
                    <div className="activity-card-p">
                      {new Date(el.activity_datestart).toString('yyyy.MM.dd')}-
                      {new Date(el.activity_dateend).toString('yyyy.MM.dd')}
                    </div>
                    <div className="activity-card-title">
                      {el.activity_name}
                    </div>
                    <div className="d-flex justify-content-between">
                      <Link to={`/activitydetail/${el.activity_id}`}>
                        <EventRegistration />
                      </Link>
                      {expired ? (
                        <Link to={`/ActivitySignUp/${el.activity_id}`}>
                          <SignUp />
                        </Link>
                      ) : (
                        <p className="timeout">已結束</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <Paginationn
        totalPosts={activity.length}
        postsPerPage={postsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        maxPageNumberLimit={maxPageNumberLimit}
        minPageNumberLimit={minPageNumberLimit}
        setMaxPageNumberLimit={setMaxPageNumberLimit}
        setMinPageNumberLimit={setMinPageNumberLimit}
        pageNumberLimit={pageNumberLimit}
        className="pagination-bar"
      />
      <Footer />
    </>
  )
}

export default Activity
