import { useState, useContext } from 'react'
import { CartContext } from '../layouts/CartContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
// import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
function AddToCartSm({ product }) {
  // const productData = { ...product }
  // console.log(productData)
  // 判斷是否有購物車，沒有的話設為空陣列
  const { handleAddCart } = useContext(CartContext)
  const [quantity, setQuantity] = useState(1)
  return (
    <>
      <button
        type="button"
        className="btn min-width-auto p-0"
        onClick={() => handleAddCart(product, quantity)}
      >
        <FontAwesomeIcon icon={faCartPlus} />
      </button>
    </>
  )
}
export default AddToCartSm