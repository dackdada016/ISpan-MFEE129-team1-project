import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

function QuantitySelector({ product_quantity, onCountChange }) {
  const [currentCount, setCurrentCount] = useState(product_quantity)
  console.log(currentCount)

  useEffect(() => {
    // 檢查 count 是否存在
    if (product_quantity !== undefined) {
      setCurrentCount(product_quantity)
    }
  }, [product_quantity])

  const handleQuantityChange = (newCount) => {
    setCurrentCount(newCount)
    onCountChange(newCount)
  }

  return (
    <>
      {/* 加減數量按鈕 */}
      <div className="calculate-btn-box">
        <button
          className="dash calculate-btn"
          disabled={currentCount <= 1}
          onClick={() => handleQuantityChange(currentCount - 1)}
        ></button>
        <span>{currentCount}</span>
        <button
          className="add calculate-btn "
          onClick={() => handleQuantityChange(currentCount + 1)}
        ></button>
      </div>
    </>
  )
}

export default QuantitySelector
