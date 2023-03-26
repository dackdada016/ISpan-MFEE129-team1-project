import { createContext, useState } from 'react'

export const CartContext = createContext({})

const CartContextProvider = ({ children }) => {
  // 操作
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  )
  // const [show, setShow] = useState(false)

  // 點擊按鈕時觸發的事件

  const handleAddCart = (product, quantity) => {
    let found = false
    let newCart = []
    if (cart.length === 0) {
      newCart = [
        {
          product_id: product.product_id,
          product_type: product.product_type,
          product_name: product.product_name,
          product_price: product.product_price,
          product_image: product.product_image,
          product_quantity: quantity,
        }
      ]
    } else {
      newCart = cart.map((item) => {
        if (item.product_id === product.product_id) {
          found = true
          return {
            ...item,
            product_quantity: item.product_quantity + quantity,
          }
        }
        return item
      })

      if (!found) {
        const newItem = {
          product_id: product.product_id,
          product_type: product.product_type,
          product_name: product.product_name,
          product_price: product.product_price,
          product_image: product.product_image,
          product_quantity: 1,
        }
        newCart.push(newItem)
      }
    }

    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }
  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }
  return (
    <CartContext.Provider value={{ cart, setCart, handleAddCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}
export default CartContextProvider
