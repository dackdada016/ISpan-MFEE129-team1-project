import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
function MoreSquare({ product_id, typeID }) {

  const navigate = useNavigate()
  const [URL, setURL] = useState('')
  // 利用type_id辨識共用元件應該導向哪個網址

  const urlMap = {
    1: `/product/Detail/${product_id}`,
    2: `/course/${product_id}`,
    3: `/reserve/${product_id}`,
    4: `/meals/${product_id}`,
  }
  const handleClick = () => {
    navigate(URL)
  }

  useEffect(() => {
    setURL(urlMap[typeID] || '/')
  }, [product_id, typeID])

  // console.log(product_id)

  return (
    <>
      {/* 黃色小按鈕(圓弧形): 看更多，已結束，立即訂房 */}
      <button
        type="button"
        className="btn btn-secondary btn-sm min-width-auto radius-5px"
        onClick={handleClick}
      // onClick={setID}
      >
        {/* <Link to={'/product/Detail/' + product_id}>看更多</Link> */}
        <Link to={URL}>
          看更多
        </Link>
      </button>
    </>
  )
}
export default MoreSquare
