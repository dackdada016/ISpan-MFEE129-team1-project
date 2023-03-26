import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router'

function ReserveConfirm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    payment_method: '',
    remark: '',
    recipient_name: '',
    recipient_address: '',
    recipient_phone: '',
  })

  // 假如當下輸入email的值，執行 onChange 中的 handleChange 時，重新賦予formData.email的值
  function handleChange(event) {
    const { name, value } = event.target // input tag
    // ...formData 為 改變前的 obj值，[name]: value 為需要改變的key : value，以input eamil來說 input中name取名為email 所以[name] 是 email，value則為當下輸入的值
    // setFormData({ ...formData, [name]: value })為何要這樣寫?  (舉例 ...formData 如果不寫，最後obj只剩下 email: ''，其他欄位會消失)
    setFormData({ ...formData, [name]: value })
  }
  const [reserveConfirm, setReserveConfirm] = useState({
    roomCount: 1,
    petCount: 0,
    childCount: 0,
    adultCount: 1,
    selectPet: '',
    startDate: new Date(),
    endDate: new Date().setDate(new Date().getDate() + 1),
    differenceInDay: 1, // 入住日到退房日的天數
    money: 0,
    total: 0,
  })

  const [roomDetail, setRoomDetail] = useState({
    product_image_big: '',
    product_type: 0,
    product_id: 0,
    product_quantity: 0,
    product_price: 0,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const [isOrderSuccess, setIsOrderSuccess] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  useEffect(() => {
    const memberId = localStorage.getItem('id')
    console.log('memberId2-', memberId)
    if (memberId) {
      fetch(`http://localhost:3002/member/edit/${memberId}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('data', data)
          setFormData({
            //物件合併
            ...formData,
            ...{
              recipient_name: data.name,
              recipient_address: data.email,
              recipient_phone: data.mobile,
            },
          })
        })

        .catch((error) => console.error(error))
    }
    if (sessionStorage.getItem('reserveData')) {
      setReserveConfirm(JSON.parse(sessionStorage.getItem('reserveData')))
    }
    if (sessionStorage.getItem('roomDetail')) {
      setRoomDetail(JSON.parse(sessionStorage.getItem('roomDetail')))
    }
    // if (sessionStorage.getItem('reserveFormData')) {
    //   setFormData(JSON.parse(sessionStorage.getItem('reserveFormData')))
    //   console.log('====formData====', formData)
    // }
  }, [])
  function formatDate(date) {
    return date ? format(date, 'yyyy/MM/dd') : ''
  }
  const img = require(`../../img/hotels/${
    reserveConfirm.selectPet === 'forest' ? 'cat-room1.png' : 'cat-room2.jpg'
  }`)

  return (
    <>
      <div className="rc-container rwd-container">
        <div className="rc-content-left rwd-col-12">
          <div className="rc-text-header">確認訂單</div>
          <div className="rc-title">付款方式</div>
          <form>
            <div className="mb-3">
              <select
                className="form-select mb-3"
                value={formData.payment_method}
                name="payment_method"
                onChange={handleChange}
              >
                <option value="" disabled>
                  {/* 對應到payment_method: ''，如果為payment_method: 'onSite'則顯示現場付款*/}
                  請選擇付款方式
                </option>
                <option value="1">Line Pay</option>
                <option value="3">現場付款</option>
              </select>
            </div>

            <div className="mb-3 ">
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                placeholder="備註..."
                value={formData.remark}
                onChange={handleChange}
                name="remark"
              ></textarea>
            </div>
            <hr />
            <div className="rc-title">聯絡資訊</div>
            <div className="mb-3 ">
              <input
                id="name"
                type="text"
                className="form-control"
                name="recipient_name"
                placeholder="姓名"
                required
                value={formData.recipient_name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 ">
              <input
                id="email"
                type="email"
                className="form-control"
                name="recipient_address"
                placeholder="信箱"
                required
                value={formData.recipient_address}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 ">
              <input
                id="phone"
                type="tel"
                className="form-control"
                name="recipient_phone"
                placeholder="電話"
                required
                value={formData.recipient_phone}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
        <div className="rc-content-right rwd-col-12">
          <div className="r-wrap">
            <div className="r-form">
              <div className="r-form-day">
                <div className="check-in">
                  <p>入住日期</p>
                  <p>{formatDate(new Date(reserveConfirm.startDate))}</p>
                </div>
                <div className="check-out">
                  <p>退房日期</p>
                  <p>{formatDate(new Date(reserveConfirm.endDate))}</p>
                </div>
              </div>
              <div className="r-form-adult">
                <p>房間數量</p>
                <div className="calculate-btn-box">
                  <span>{reserveConfirm.roomCount}</span>
                </div>
              </div>
              <div className="r-form-adult">
                <p>成人</p>
                <div className="calculate-btn-box">
                  <span>{reserveConfirm.adultCount}</span>
                </div>
              </div>
              <div className="r-form-child">
                <p>兒童</p>
                <div className="calculate-btn-box">
                  <span>{reserveConfirm.childCount}</span>
                </div>
              </div>
              <div className="r-form-pet">
                <p>寵物</p>
                <div className="calculate-btn-box">
                  <span>{reserveConfirm.petCount}</span>
                </div>
              </div>
              {reserveConfirm.selectPet ? (
                <>
                  <p>您選擇的寵物窩造型:</p>
                  <div className="choose-pet-section">
                    <img src={img} alt="" />
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
            <div className="r-price">
              <div className="price-day">
                <p>
                  ${reserveConfirm.money} TWD *{reserveConfirm.differenceInDay}
                  晚
                </p>
                <p>${reserveConfirm.money} TWD </p>
              </div>
              <div className="room-count">
                <p>*{reserveConfirm.roomCount}間</p>
              </div>
              <hr />
              <div className="total-price">
                <p>總價</p>
                <p>${reserveConfirm.total} TWD</p>
              </div>
            </div>
            <div className="r-btn-box">
              <button
                type="button"
                className="btn btn-primary btn-lg min-width-auto ml-10px"
                onClick={() => {
                  const memberId = localStorage.getItem('id')
                  setIsLogin(memberId ? true : false)
                  const reqData = {
                    ...formData,
                    ...{ payment_method: parseInt(formData.payment_method) },
                    detailData: [{ ...roomDetail }],
                    ...{
                      start_time: format(
                        new Date(reserveConfirm.startDate),
                        'yyyy-MM-dd HH:mm:ss'
                      ),
                      end_time: format(
                        new Date(reserveConfirm.endDate),
                        'yyyy-MM-dd HH:mm:ss'
                      ),
                      additional: JSON.stringify({
                        adultCount: reserveConfirm.adultCount,
                        childCount: reserveConfirm.childCount,
                        petCount: reserveConfirm.petCount,
                        selectPet: reserveConfirm.selectPet,
                        differenceInDay: reserveConfirm.differenceInDay,
                      }),
                    },
                  }
                  if (memberId) {
                    if (formData.payment_method === '3') {
                      console.log('加入訂單api', reqData)
                      fetch(`http://localhost:3002/order/${memberId}`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(reqData),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          console.log('data', data)
                          setIsOrderSuccess(data.success)
                          if (data.success === true) {
                            window.sessionStorage.removeItem('reserveData')
                            window.sessionStorage.removeItem('roomDetail')
                            window.sessionStorage.removeItem('reserveFormData')
                            setMessage('預訂成功，可至訂單紀錄查看')
                            openModal()
                          } else {
                            setMessage('預訂失敗')
                            openModal()
                          }
                        })
                        .catch((error) => {
                          console.error(error)
                          setMessage('系統錯誤')
                          openModal()
                        })
                    } else if (formData.payment_method === '1') {
                      console.log('導向linePay付款', reqData)
                      fetch(`http://localhost:3002/order/${memberId}`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(reqData),
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          console.log('data', data)
                          setIsOrderSuccess(data.success)
                          if (data.success === true) {
                            setMessage('預訂成功，可至訂單紀錄查看')
                            openModal()
                          } else {
                            setMessage('預訂失敗')
                            openModal()
                          }
                        })
                        .catch((error) => {
                          console.error(error)
                          setMessage('系統錯誤')
                          openModal()
                        })
                    }
                  } else {
                    setMessage('您尚未登入，無法預訂，請先登入會員')
                    openModal()
                    // navigate('/login')
                  }
                  console.log('formData', formData)
                  console.log('reserveConfirm', reserveConfirm)
                }}
              >
                確認
              </button>
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
                {isOrderSuccess ? (
                  ''
                ) : (
                  <button
                    type="button"
                    className="btn-close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={closeModal}
                  ></button>
                )}
              </div>
              <div className="modal-body text-center">
                <p>{message}</p>
              </div>
              <div className="modal-footer justify-content-center">
                {isLogin && !isOrderSuccess ? (
                  ''
                ) : (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={() => {
                      closeModal()
                      if (isOrderSuccess) {
                        navigate('/orderList')
                      } else {
                        sessionStorage.setItem(
                          'reserveFormData',
                          JSON.stringify(formData)
                        )
                        navigate('/login')
                      }
                    }}
                  >
                    {isOrderSuccess ? '查看訂單紀錄' : '前往登入'}
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    closeModal()
                    if (!isOrderSuccess) {
                      navigate('/login')
                    } else {
                      navigate('/')
                    }
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

export default ReserveConfirm
