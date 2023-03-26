import { useState, useContext } from 'react'
import { CartContext } from '../layouts/CartContext'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
function AddToCartLg({ product }) {
  // const productData = { ...product }
  // console.log(productData)
  // 判斷是否有購物車，沒有的話設為空陣列
  const { handleAddCart } = useContext(CartContext)
  const [quantity, setQuantity] = useState(1)
  return (
    <>
      {/* 大的按鈕: 加入購物車 */}
      <button
        type="button"
        className="btn btn-primary btn-lg"
        onClick={() => handleAddCart(product, quantity)}
      >
        加入購物車
      </button>
    </>
  )
}
export default AddToCartLg
