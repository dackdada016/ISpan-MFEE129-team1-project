import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import 'datejs'

function OrderDetail() {
  const { order_id } = useParams()
  const [order, setOrders] = useState([])
  const [additional, setAdditional] = useState({
    adultCount: '',
    childCount: '',
    petCount: '',
    selectPet: '',
    differenceInDay: '',
  })
  const [totalOrder, setTotalOrder] = useState(0)
  // const [orderId, setOrderId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // const id = localStorage.getItem('id')

    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:3002/orderList/orderDetail/${order_id}`,
        {
          method: 'GET',
        }
      )
      const orderData = await res.json()
      const imageArray = orderData[0].product_image.split(',')
      const bigImage = imageArray[0]
      const imageObj = {
        product_image_big: bigImage,
      }
      console.log('imageObj', imageObj)
      orderData[0].product_image_big = bigImage
      setAdditional(JSON.parse(orderData[0].additional))
      setOrders(orderData)
      setTotalOrder(totalOrderPrice(orderData))
    }
    fetchData()
    console.log(order)
  }, [order_id])

  // 計算訂單總金額
  const totalOrderPrice = (orderData) => {
    let orderTotal = 0
    orderData.forEach((item) => {
      const additionalObj = JSON.parse(item.additional)
      const itemTotal =
        item.product_quantity *
        item.product_price *
        (item.additional ? additionalObj.differenceInDay : 1)
      orderTotal += itemTotal
    })
    return orderTotal
  }

  return (
    <>
      <section className="col-10 m-auto pt-3">
        <h4 className="border-bottom pb-2">訂單資訊</h4>
        <div className="order d-flex flex-column border-bottom mb-3">
          <h5 className="mb-3 ">訂單詳細資訊</h5>
          <p className="mb-3">訂單編號：{order[0] && order[0].order_id}</p>
          <p className="mb-3">
            訂單日期:
            {order[0] && new Date(order[0].order_date).toString('yyyy-MM-dd')}
          </p>
          <p>
            付款方式:
            {order[0] && order[0].payment_method === 1
              ? 'Line Pay'
              : order[0] && order[0].payment_method === 2
              ? '貨到付款'
              : '現場付款'}
          </p>
          {order[0] && order[0].type_id === 3 && (
            <>
              <p>
                住宿日期:
                {new Date(order[0].start_time)
                  .toLocaleDateString()
                  .slice(0, 10)}{' '}
                ~{new Date(order[0].end_time).toLocaleDateString().slice(0, 10)}
              </p>
              <p>成人:{additional.adultCount}位</p>
              <p>兒童:{additional.childCount}位</p>
              <p>寵物數量:{additional.petCount}隻</p>
              {/* <p>
                寵物窩:
                {additional.selectPet === 'house'
                  ? '../img/hotels/cat-room1.png'
                  : '../img/hotels/cat-room2.png'}
              </p> */}
              <p>入住天數:{additional.differenceInDay}天</p>
            </>
          )}
        </div>
        {order[0] && (
          <div className="person d-flex flex-column border-bottom mb-3">
            {order[0].type_id === 3 ? (
              <h5 className="mb-3">聯絡人資訊</h5>
            ) : (
              <h5 className="mb-3">訂購人資訊</h5>
            )}
            <p>姓名:{order[0].recipient_name}</p>
            <p>連絡電話:{order[0].recipient_phone}</p>
            {order[0].type_id === 3 ? (
              <p>連絡信箱:{order[0].recipient_address}</p>
            ) : (
              <p>地址:{order[0].recipient_address}</p>
            )}
            {/* <p>{{orderDetail.type_id=1}:`地址:${orderDetail.recipient_address}`:''}</p> */}
          </div>
        )}

        <div className="test border-bottom mb-3">
          <table>
            <thead>
              <tr>
                <th>商品圖</th>
                <th>名稱</th>
                <th>規格</th>
                <th>價格</th>
                <th>數量</th>
                <th>小計</th>
              </tr>
            </thead>
            <tbody>
              {order &&

                order.map(
                  (
                    {
                      order_detail_id,
                      product_name,
                      product_image,
                      product_unit,
                      product_price,
                      product_quantity,
                      additional,
                    },
                    index
                  ) => {
                    const imgUrl = product_image.split(',')
                    const firstImgUrl = imgUrl[0]
                    return (
                      <tr key={index}>
                        <td>
                          <img
                            src={`http://localhost:3002/uploads/${firstImgUrl}`}
                            alt="product_img"
                          />
                        </td>
                        <td>{product_name}</td>
                        <td>{product_unit}</td>
                        <td>NT.{product_price}</td>
                        <td>{product_quantity}</td>
                        <td>
                          NT.
                          {product_quantity *
                            product_price *
                            (order.additional ? additional.differenceInDay : 1)}
                        </td>
                      </tr>
                    )
                  }
                )}
            </tbody>
          </table>
        </div>
        <div className="money d-flex justify-content-between">
          <p>{order[0] && order[0].type_id === 3 ? '' : '免運'}</p>

          <p>訂單總金額 : NT.{totalOrder}</p>

        </div>
      </section>
      <div className="return d-flex justify-content-center mb-3">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => navigate(-1)}
        >
          返回
        </button>
      </div>
    </>
  )
}
export default OrderDetail
