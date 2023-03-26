import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import zhTW from 'date-fns/locale/zh-TW'
import 'react-datepicker/dist/react-datepicker.css'
import { AddToFavoritesLg } from '../../template'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

registerLocale('zh-TW', zhTW)

function Reserve() {
  const navigate = useNavigate()
  const [roomDetail, setRoomDetail] = useState({
    product_image_big: '',
    product_name: '',
    product_price: 0,
    product_descripttion: '',
  }) //hotel.js的資料
  const [reserveData, setReserveData] = useState({
    roomCount: 1,
    petCount: 0,
    childCount: 0,
    adultCount: 1,
    selectPet: '',
    startDate: new Date(),
    endDate: new Date().setDate(new Date().getDate() + 1),
    differenceInDay: 1,
    money: 0,
    total: 0,
  })
  const { product_id } = useParams()

  const [lightboxIsOpen, setLightboxIsOpen] = useState(false)

  const [imageArray, setImageArray] = useState([])

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isLogin, setIsLogin] = useState(false)

  const [message, setMessage] = useState('')

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  useEffect(() => {
    fetch(`http://localhost:3002/product/list-detail/${product_id}`)
      .then((res) => res.json())
      .then((room) => {
        // setRoomDetail(room[0])
        console.log('room', room)
        const imageList = room[0].product_image.split(',')
        const bigImage = imageList[0]
        const smallImage = imageList.slice(1)
        console.log('imageList', imageList)
        const imageObj = {
          product_image_big: bigImage,
          product_image_small: smallImage,
        }
        setRoomDetail({ ...room[0], ...imageObj })
        setImageArray(imageList)
        console.log('====imageArray====', imageArray)
        // imageList = imageArray
        // console.log('imageList', imageList)

        const changeReserveDataObj = {
          money: room[0].product_price,
          total:
            room[0].product_price *
            reserveData.differenceInDay *
            reserveData.roomCount,
        }
        const reserveDataSession = sessionStorage.getItem('reserveData')
        console.log('======reserveData======', reserveData)
        console.log(
          '======JSON.parse(reserveDataSession)======',
          JSON.parse(reserveDataSession)
        )
        if (reserveDataSession) {
          setReserveData(JSON.parse(reserveDataSession))
        } else {
          setReserveData({
            ...reserveData,
            ...changeReserveDataObj,
          })
        }
        console.log('======reserveData222======', reserveData)
        // getRoomDetailImg(room[0])
      })

      .catch((err) => console.error(err))
  }, [product_id])
  // let selectedImageIndex = 0
  const handleImageClick = (index) => {
    setSelectedImageIndex(index)
    setLightboxIsOpen(true)
    console.log('====selectedImageIndex====', selectedImageIndex)
    console.log('===index===', index)
    console.log('===imageArray===', imageArray)
    console.log(
      '===imageArray[selectedImageIndex]===',
      imageArray[selectedImageIndex]
    )
  }

  const handlePrevRequest = () => {
    setSelectedImageIndex(
      (selectedImageIndex - 1 + imageArray.length) % imageArray.length
    )
  }

  const handleNextRequest = () => {
    setSelectedImageIndex((selectedImageIndex + 1) % imageArray.length)
  }

  console.log('roomDetail', roomDetail)

  function calculateNumberOfNights(checkinDate, checkoutDate, keyName) {
    const oneDay = 24 * 60 * 60 * 1000 // 一天的毫秒數
    const checkinTime = new Date(checkinDate).getTime() // 入住日期的時間戳
    const checkoutTime = new Date(checkoutDate).getTime() // 退房日期的時間戳
    const differenceInTime = checkoutTime - checkinTime // 入住日到退房日的時間差，單位為毫秒
    const differenceInDays = Math.round(differenceInTime / oneDay) // 入住日到退房日的天數
    const changeObj = {
      differenceInDay: differenceInDays,
      [keyName]: keyName === 'startDate' ? checkinDate : checkoutDate,
      money: Number(roomDetail.product_price) * Number(differenceInDays),
      // dateKeyName 是指入住日 或 退房日的key name，所以是當選入住日時keyName為startDate；選退房日時keyName為endDate
      total:
        Number(roomDetail.product_price) *
        differenceInDays *
        reserveData.roomCount,
    }
    setReserveData({
      ...reserveData,
      ...changeObj,
    })
  }

  function petOptionChange(event) {
    console.log('event-', event)
    console.log('event.target.value-', event.target.value)
    setReserveData({
      ...reserveData,
      selectPet: event.target.value,
    })
  }

  return (
    <>
      <div className="rd-wrap">
        {lightboxIsOpen && (
          <Lightbox
            mainSrc={`http://localhost:3002/uploads/${imageArray[selectedImageIndex]}`}
            prevSrc={`http://localhost:3002/uploads/${
              imageArray[
                (selectedImageIndex - 1 + imageArray.length) % imageArray.length
              ]
            }`}
            nextSrc={`http://localhost:3002/uploads/${
              imageArray[(selectedImageIndex + 1) % imageArray.length]
            }`}
            onCloseRequest={() => setLightboxIsOpen(false)}
            onMovePrevRequest={handlePrevRequest}
            onMoveNextRequest={handleNextRequest}
          />
        )}
        <div className="banner rwd-container">
          <div
            onClick={() =>
              // console.log(`You clicked on item ${i + 1}`)
              handleImageClick(0)
            }
            style={{
              backgroundImage: `url(http://localhost:3002/uploads/${roomDetail.product_image_big})`,
            }}
            className="rd-img-left rwd-col-12"
          ></div>
          {/* 加三元運算是因為第一次渲染為空物件，map不出東西 */}
          <div className="rd-img-right rwd-col-12">
            {roomDetail.product_image_small
              ? roomDetail.product_image_small.map((item, i) => {
                  return (
                    <div
                      onClick={() =>
                        // console.log(`You clicked on item ${i + 1}`)
                        handleImageClick(i + 1)
                      }
                      className={`img img${i + 1}`}
                      style={{
                        backgroundImage: `url(http://localhost:3002/uploads/${item})`,
                      }}
                      key={i}
                    ></div>
                  )
                })
              : ''}
            {/* <div className="img img2"></div>

            <div className="img img3"></div>
            <div className="img img4"></div> */}
          </div>
        </div>
        <div className="rd-container rwd-container">
          <div className="rd-content-left rwd-col-12">
            <div className="title">
              <h1>{roomDetail.product_name}</h1>
              <h2>NT.{roomDetail.product_price}</h2>
            </div>
            <p>
              <span>床型尺寸：</span>
              {roomDetail.product_descripttion}
            </p>
            <p>
              <span>客房設施：</span>空調, 地毯, 隔音, 清潔用品, 吊衣架, 淋浴,
              吹風機, 免費盥洗用品, 獨立洗手間及浴室, 書桌, 拖鞋, 衛生紙, 電話,
              有線頻道, 平面電視, 冰箱, 電熱水壺, 毛巾, 床單。
            </p>
            <p>
              <span>所有客房以下服務免費提供：</span>
              WiFi、晨間喚醒、夜間加枕/加被、備品補充。
            </p>
            <div className="notice">
              <span>注意事項</span>
              <ul>
                <li>客人可以通過通知毬來取消住宿合同。</li>
                <li>
                  毬將於入住當日晚上10:00通知客人（若提前指定預計抵達時
                  間，時間為預定抵達時間後兩小時，至凌晨12:00）。客人未到達，住宿合同可視為客人已解除並處理。
                </li>
                <li>
                  客人可以在下午 3:00 至次日上午 10:00
                  期間使用毬的客房。但是，連續入住的話，除了到達日和離開日以外，全天都可以使用。
                </li>
              </ul>
            </div>
          </div>
          <div className="rd-content-right rwd-col-12">
            <div className="r-wrap">
              <div className="r-form">
                <div className="r-form-day">
                  <div className="check-in">
                    {/* <img src={Calendar} alt="Calendar" width={30} height={30} /> */}
                    <p>入住日期</p>
                    <ReactDatePicker
                      dateFormat="yyyy/MM/dd"
                      locale="zh-TW"
                      selected={reserveData.startDate}
                      onChange={(date) => {
                        // setReserveData({ ...reserveData, startDate: date })
                        calculateNumberOfNights(
                          date,
                          reserveData.endDate,
                          'startDate'
                        )
                      }}
                      minDate={new Date()}
                      startDate={reserveData.startDate}
                      endDate={reserveData.endDate}
                    />
                  </div>
                  <div className="check-out">
                    <p>退房日期</p>
                    <ReactDatePicker
                      className={
                        reserveData.differenceInDay <= 0 ? 'err-border' : ''
                      }
                      dateFormat="yyyy/MM/dd"
                      selected={reserveData.endDate}
                      locale="zh-TW"
                      onChange={(date) => {
                        // setReserveData({ ...reserveData, endDate: date })
                        calculateNumberOfNights(
                          reserveData.startDate,
                          date,
                          'endDate'
                        )
                      }}
                      minDate={reserveData.startDate}
                      startDate={reserveData.startDate}
                      endDate={reserveData.endDate}
                    />
                  </div>
                </div>
                {reserveData.differenceInDay <= 0 ? (
                  <small className="err-msg">
                    退房日期不得與入住日期相同，至少須住一晚
                  </small>
                ) : (
                  ''
                )}
                <div className="r-form-adult">
                  <p>房間數量</p>
                  <div className="calculate-btn-box">
                    <button
                      className="dash calculate-btn"
                      disabled={reserveData.roomCount <= 1 ? true : false}
                      onClick={() => {
                        if (reserveData.roomCount > 1) {
                          setReserveData({
                            ...reserveData,
                            ...{
                              roomCount: reserveData.roomCount - 1,
                              total:
                                roomDetail.product_price *
                                reserveData.differenceInDay *
                                (reserveData.roomCount - 1),
                            },
                          })
                        }
                      }}
                    ></button>
                    <span>{reserveData.roomCount}</span>
                    <button
                      className="add calculate-btn"
                      onClick={() => {
                        setReserveData({
                          ...reserveData,
                          ...{
                            roomCount: reserveData.roomCount + 1,
                            total:
                              roomDetail.product_price *
                              reserveData.differenceInDay *
                              (reserveData.roomCount + 1),
                          },
                        })
                      }}
                    ></button>
                  </div>
                </div>
                <div className="r-form-adult">
                  <p>成人</p>
                  <div className="calculate-btn-box">
                    <button
                      className="dash calculate-btn"
                      disabled={reserveData.adultCount <= 1 ? true : false}
                      onClick={() => {
                        if (reserveData.adultCount > 1) {
                          setReserveData({
                            ...reserveData,
                            adultCount: reserveData.adultCount - 1,
                          })
                        }
                      }}
                    ></button>
                    <span>{reserveData.adultCount}</span>
                    <button
                      className="add calculate-btn"
                      onClick={() => {
                        setReserveData({
                          ...reserveData,
                          adultCount: reserveData.adultCount + 1,
                        })
                      }}
                    ></button>
                  </div>
                </div>
                <div className="r-form-child">
                  <p>兒童</p>
                  <div className="calculate-btn-box">
                    <button
                      className="dash calculate-btn"
                      disabled={reserveData.childCount <= 0 ? true : false}
                      onClick={() => {
                        if (reserveData.childCount > 0) {
                          setReserveData({
                            ...reserveData,
                            childCount: reserveData.childCount - 1,
                          })
                        }
                      }}
                    ></button>
                    <span>{reserveData.childCount}</span>
                    <button
                      className="add calculate-btn"
                      onClick={() => {
                        setReserveData({
                          ...reserveData,
                          childCount: reserveData.childCount + 1,
                        })
                      }}
                    ></button>
                  </div>
                </div>
                <div className="r-form-pet">
                  <p>寵物 (請點選寵物數量查看寵物窩)</p>
                  <div className="calculate-btn-box">
                    <button
                      className="dash calculate-btn"
                      disabled={reserveData.petCount <= 0 ? true : false}
                      onClick={() => {
                        if (reserveData.petCount > 0) {
                          if (reserveData.petCount === 1) {
                            setReserveData({
                              ...reserveData,
                              ...{
                                petCount: reserveData.petCount - 1,
                                selectPet: '',
                              },
                            })
                          } else {
                            setReserveData({
                              ...reserveData,
                              petCount: reserveData.petCount - 1,
                            })
                          }
                        }
                      }}
                    ></button>
                    <span>{reserveData.petCount}</span>
                    <button
                      className="add calculate-btn"
                      onClick={() => {
                        setReserveData({
                          ...reserveData,
                          petCount: reserveData.petCount + 1,
                        })
                      }}
                    ></button>
                  </div>
                </div>
                {reserveData.petCount > 0 && reserveData.selectPet === '' ? (
                  <small className="err-msg">請選擇寵物窩!!</small>
                ) : (
                  ''
                )}
                {reserveData.petCount > 0 ? (
                  <div className="choose-pet-section">
                    <div className="form-check">
                      <label className="form-check-label" htmlFor="forest">
                        <img
                          src={require('../../img/hotels/cat-room1.png')}
                          alt=""
                        />
                      </label>
                      <input
                        className="form-check-input"
                        type="radio"
                        id="forest"
                        name="petBed"
                        value="forest"
                        checked={reserveData.selectPet === 'forest'}
                        onChange={petOptionChange}
                      />
                    </div>
                    <div className="form-check">
                      <label className="form-check-label" htmlFor="house">
                        <img
                          src={require('../../img/hotels/cat-room2.jpg')}
                          alt=""
                        />
                      </label>
                      <input
                        className="form-check-input"
                        type="radio"
                        id="house"
                        name="petBed"
                        value="house"
                        checked={reserveData.selectPet === 'house'}
                        onChange={petOptionChange}
                      />
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className="r-price">
                <div className="price-day">
                  <p>
                    ${roomDetail.product_price} TWD *
                    {reserveData.differenceInDay}晚
                  </p>

                  <p>${reserveData.money} TWD </p>
                </div>
                <div className="room-count">
                  <p>*{reserveData.roomCount}間</p>
                </div>
                <hr />
                <div className="total-price">
                  <p>總價</p>
                  <p>${reserveData.total} TWD</p>
                </div>
              </div>
              <div className="r-btn-box">
                <AddToFavoritesLg
                  product={roomDetail}
                  typeID={roomDetail.product_type}
                />
                {/* <Link to="/ReserveConfirm"> */}
                <button
                  onClick={() => {
                    const memberId = localStorage.getItem('id')
                    setIsLogin(memberId ? true : false)
                    if (memberId) {
                      navigate('/ReserveConfirm')
                    } else {
                      setMessage('您尚未登入，無法預訂，請先登入會員')
                      openModal()
                    }
                    const data = {
                      ...reserveData,
                      ...{
                        startDate: new Date(reserveData.startDate).getTime(),
                        endDate: new Date(reserveData.endDate).getTime(),
                      },
                    }
                    sessionStorage.setItem('reserveData', JSON.stringify(data))
                    const sessionRoomDetail = {
                      product_image_big: roomDetail.product_image_big,
                      product_type: roomDetail.product_type,
                      product_id: roomDetail.product_id,
                      product_quantity: reserveData.roomCount,
                      product_price: roomDetail.product_price,
                    }
                    sessionStorage.setItem(
                      'roomDetail',
                      JSON.stringify(sessionRoomDetail)
                    )
                  }}
                  type="button"
                  className="btn btn-primary btn-lg min-width-auto ml-10px"
                  disabled={
                    reserveData.differenceInDay <= 0 ||
                    (reserveData.petCount > 0 && reserveData.selectPet === '')
                  } //如果退房日跟入住日同一天，預訂為disabled   或者  有點選寵物數量卻沒選擇寵物窩，預訂為disabled
                >
                  預訂
                </button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div
          className={`modal ${isModalOpen ? 'show' : ''}`}
          tabIndex="-1"
          role="dialog"
          style={{ display: isModalOpen ? 'block' : 'none' }}
        >
          {/* modal-dialog-centered 垂直置中 */}
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">訊息</h5>

                <button
                  type="button"
                  className="btn-close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p>{message}</p>
              </div>
              <div className="modal-footer justify-content-center">
                {isLogin ? (
                  ''
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={() => {
                      closeModal()
                      navigate('/login')
                    }}
                  >
                    前往登入
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    closeModal()
                  }}
                >
                  關閉
                </button>
                {/* {isOrderSuccess ? (
                  ''
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={closeModal}
                  >
                    關閉
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`modal-backdrop ${isModalOpen ? 'show' : ''}`}
          style={{ display: isModalOpen ? 'block' : 'none' }}
        ></div>
      </div>
    </>
  )
}

export default Reserve
