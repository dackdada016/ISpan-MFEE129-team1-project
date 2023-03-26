/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCaretRight,
  faHeart as faHeartRegular,
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons'

function Heart({ product, typeID }) {
  const id = localStorage.getItem('id')

  const {
    product_id,
    product_name,
    product_class,
    product_price,
    product_descripttion,
    product_image,
  } = product
  const [isFavorite, setIsFavorite] = useState(false)
  // const [product_id, setProduct_id] = useState('')

  const toggleLike = async (product_id) => {
    try {
      const response = await fetch(
        `http://localhost:3002/member/toggle-like/${product_id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            typeID,
          }),
        }
      )
      const result = await response.json()

      if (result.success) {
        setIsFavorite(result.action === 'insert')
      } else {
        setIsFavorite(result.action === 'delete')
      }
    } catch (error) {
      console.error(error)
    }
  }

  function handleFavoriteClick() {
    toggleLike(product_id)
    setIsFavorite(!isFavorite)
  }

  return (
    <>
      <button
        type="button"
        className="btn min-width-auto p-0"
        onClick={handleFavoriteClick}
      >
        {isFavorite ? (
          <>
            <FontAwesomeIcon icon={faHeartRegular} />
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faHeartOutline} />
          </>
        )}
      </button>
    </>
  )
}
export default Heart
