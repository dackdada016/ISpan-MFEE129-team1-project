import { useState, useContext, useEffect } from 'react'
import { QuantitySelector } from '.'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../layouts/CartContext'

const Cart = () => {
  // const { show, setShow } = useContext(CartContext)
  const navigate = useNavigate()
  const { clearCart } = useContext(CartContext)
  // 取得購物車的資料並轉成Json
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  )
  // const [quantity, setQuantity] = useState(JSON.parse(localStorage.getItem('cart')).product_quantity)
  // 在點擊“移除”按鈕時，從購物車中刪除該商品
  const removeItem = (index) => {
    const newItems = [...items.slice(0, index), ...items.slice(index + 1)]
    setItems(newItems)
    if (newItems.length === 0) {
      localStorage.removeItem('cart')
    } else {
      localStorage.setItem('cart', JSON.stringify(newItems))
    }
  }
  const updateQuantity = (index, newQuantity) => {
    const newItems = [...items]
    newItems[index].product_quantity = newQuantity
    setItems(newItems)
    localStorage.setItem('cart', JSON.stringify(newItems))
  }
  useEffect(() => {
    if (items.length === 0) {
      clearCart()
    }
  }, [items])
  console.log(items)
  const totalPrice = () => {
    let cartTotal = 0
    items.forEach((items) => {
      const itemTotal = items.product_quantity * items.product_price
      cartTotal += itemTotal
    })
    return cartTotal
  }
  const total = totalPrice()
  return (
    <div className="cart__sidebar">
      <main>
        {/* <FontAwesomeIcon icon={faAnglesLeft} onClick={() => navigate(-1)} /> */}
        <div className="cart__body">
          {/* <h2>購物車</h2> */}
          <table>
            <thead>
              {/* <tr>
              <th>名稱</th>
              <th>價格</th>
              <th>數量</th>
              <th>操作</th>
            </tr> */}
            </thead>
            <tbody>
              {items.map(
                (
                  {
                    product_id,
                    product_name,
                    product_price,
                    product_image,
                    product_quantity,
                  },
                  index
                ) => {
                  const imgUrl = product_image.split(',')
                  const firstImgUrl = imgUrl[0]
                  return (
                    <tr key={product_id}>
                      <td>
                        <img
                          src={`http://localhost:3002/uploads/${firstImgUrl}`}
                          alt={product_name}
                        />
                      </td>
                      <td>{product_name}</td>
                      <td>{product_price}</td>
                      <td>{product_quantity}</td>
                      <td>
                        <QuantitySelector
                          product_quantity={product_quantity}
                          onCountChange={(newCount) =>
                            updateQuantity(index, newCount)
                          }
                        />
                      </td>
                      <td>
                        <button className="btn" onClick={() => removeItem(index)}>
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </td>
                    </tr>
                  )
                }
              )}
            </tbody>
          </table>

        </div>
        {items.length == 0 ? (
          <p className="text-center">沒有選擇商品</p>
        ) : (
          <p className="text-center m-0">合計: NT.{total}</p>
        )}
      </main>
    </div>
  )
}

export default Cart
