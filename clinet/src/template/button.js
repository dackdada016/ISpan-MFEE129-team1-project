import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
function ButtonTemplate() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        {/* 大的按鈕: 加入購物車 */}
        <button type="button" className="btn btn-primary btn-lg">
          加入購物車
        </button>
        {/* 大的按鈕: 加入收藏 */}
        <button type="button" className="btn btn-outline-primary btn-lg">
          加入收藏
        </button>
        {/* 大的按鈕: 下一步，確認送出，回首頁 */}
        <button type="button" className="btn btn-primary btn-lg min-width-auto">
          下一步
        </button>
        {/* 大的按鈕: 結帳 */}
        <button
          type="button"
          className="btn btn-primary btn-lg min-width-auto ml-10px"
        >
          結帳
        </button>

        {/* 大的按鈕: 繼續選購，回上一步 */}
        <button
          type="button"
          className="btn btn-outline-primary btn-lg min-width-auto"
        >
          繼續選購
        </button>
      </div>

      <div>
        {/* 中的按鈕: 加入購物車 */}
        <button type="button" className="btn btn-primary btn-md">
          加入購物車
        </button>

        {/* 中的按鈕: 加入收藏 */}
        <button type="button" className="btn btn-outline-primary btn-md">
          加入收藏
        </button>
        {/* 中的按鈕: 下一步，確認送出，回首頁，返回，確定 */}
        <button type="button" className="btn btn-primary btn-md min-width-auto">
          下一步
        </button>
        {/* 中的按鈕: 繼續選購，回上一步 */}
        <button
          type="button"
          className="btn btn-outline-primary btn-md min-width-auto"
        >
          繼續選購
        </button>
      </div>

      {/*  */}

      {/* footer按鈕 */}
      <button type="button" className="btn btn-secondary btn-md min-width-auto">
        活動預約
        <FontAwesomeIcon icon={faCaretRight} />
      </button>

      {/* 藍色小按鈕 */}
      <button
        type="button"
        className="btn btn-primary btn-sm min-width-auto radius-5px"
      >
        報名中
      </button>

      {/* 黃色小按鈕(方形): 看更多，已結束，立即訂房 */}
      <button
        type="button"
        className="btn btn-secondary btn-sm min-width-auto radius-5px"
      >
        看更多
      </button>
      {/* 黃色小按鈕(圓弧形): 看更多，已結束，立即訂房 */}
      <button
        type="button"
        className="btn btn-secondary btn-sm min-width-auto "
      >
        看更多
      </button>

      {/* 加減數量按鈕 */}
      <div className="calculate-btn-box">
        <button
          className="dash calculate-btn"
          disabled={count <= 0 ? true : false}
          onClick={() => {
            if (count > 0) {
              setCount(count - 1)
            }
          }}
        ></button>
        <span>{count}</span>
        <button
          className="add calculate-btn"
          onClick={() => {
            setCount(count + 1)
          }}
        ></button>
      </div>
    </>
  )
}
export default ButtonTemplate
