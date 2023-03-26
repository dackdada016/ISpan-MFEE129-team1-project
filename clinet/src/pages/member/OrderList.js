import { json, Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import { BackToPrevious } from '../../template'

function OrderList({ id }) {
  const [tagCheck, setTagCheck] = useState(0)
  const [order, setOrders] = useState([])

  //descending
  const numDescending = [...order].sort((a, b) => b.order_id - a.order_id)
  console.log(numDescending)

  const navigate = useNavigate()

  useEffect(() => {
    const id = localStorage.getItem('id')
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3002/orderList/order/${id}`, {
        method: 'GET',
      })
      const order = await res.json()
      console.log(`http://localhost:3002/orderList/order/${id}`, order)

      // const [...orders] = order
      setOrders(order)
    }
    fetchData()
  }, [id])
  // console.log(order)

  const handleChange = (typeId) => {
    // console.log(typeId)
    setTagCheck(typeId)
  }

  return (
    <>
      <BackToPrevious></BackToPrevious>
      <h1 className="orderTitle">查看訂單紀錄</h1>
      {/* <div className="info">{JSON.stringify(order)}</div> */}
      <main className="checkoutFlow">
        <div className="tabs">
          <input
            type="radio"
            className="tabs__radio"
            name="tabs-example"
            id="tab1"
            onChange={() => {
              handleChange(0)
            }}
            checked={tagCheck === 0}
            // checked={tagCheck === '所有'}
          />
          <label htmlFor="tab1" className="tabs__label">
            所有
          </label>
          <input
            type="radio"
            className="tabs__radio"
            name="tabs-example"
            type_id="1"
            id="tab2"
            onChange={() => {
              handleChange(1)
            }}
            checked={tagCheck === 1}
            // checked={tagCheck}
          />
          <label htmlFor="tab2" className="tabs__label">
            商城
          </label>
          <input
            type="radio"
            className="tabs__radio"
            name="tabs-example"
            id="tab3"
            type_id="4"
            onChange={() => {
              handleChange(4)
            }}
            checked={tagCheck === 4}
          />
          <label htmlFor="tab3" className="tabs__label">
            餐點
          </label>
          <input
            type="radio"
            className="tabs__radio"
            name="tabs-example"
            id="tab5"
            type_id="2"
            onChange={() => {
              handleChange(2)
            }}
            checked={tagCheck === 2}
          />
          <label htmlFor="tab5" className="tabs__label">
            課程
          </label>
          <input
            type="radio"
            className="tabs__radio"
            name="tabs-example"
            id="tab6"
            type_id="3"
            onChange={() => {
              handleChange(3)
            }}
            checked={tagCheck === 3}
          />
          <label htmlFor="tab6" className="tabs__label">
            住宿
          </label>
          <div className="test">
            <table>
              <thead>
                <tr>
                  <th>訂單編號</th>
                  <th>訂單日期</th>
                  <th>分類</th>
                  <th>訂單狀態</th>
                  {/* <th>訂單金額</th> */}
                  <th>查看明細</th>
                </tr>
              </thead>
              <tbody>
                {tagCheck === 0
                  ? numDescending.map((order, k) => (
                      <tr key={`${order.order_id}${k}`}>
                        <td>{order.order_id}</td>
                        <td>
                          {new Date(order.order_date).toString('yyyy-MM-dd')}
                        </td>
                        <td>
                          {order.type_id === 1
                            ? '商品'
                            : order.type_id === 2
                            ? '課程'
                            : order.type_id === 3
                            ? '住宿'
                            : '餐點'}
                        </td>
                        <td>{order.status === 0 ? '未付款' : '已付款'}</td>
                        {/* <td>
                          {[order.product_price * order.product_quantity]}
                        </td> */}
                        <td>
                          <Link
                            to={`/orderDetail/${order.order_id}`}
                            className="more-button"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  : numDescending
                      .filter((el) => {
                        return el.type_id === tagCheck
                      })
                      .map((order, k) => (
                        <tr key={`${order.order_id}${k}`}>
                          <td>{order.order_id}</td>
                          <td>
                            {new Date(order.order_date).toString('yyyy-MM-dd')}
                          </td>
                          <td>
                            {order.type_id === 1
                              ? '商品'
                              : order.type_id === 2
                              ? '課程'
                              : order.type_id === 3
                              ? '住宿'
                              : '餐點'}
                          </td>
                          <td>{order.status === 0 ? '未付款' : '已付款'}</td>
                          {/* <td>{order.product_price}</td> */}
                          <td>
                            <Link
                              to={`/orderDetail/${order.order_id}`}
                              className="more-button"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </Link>
                          </td>
                        </tr>
                      ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}

export default OrderList
