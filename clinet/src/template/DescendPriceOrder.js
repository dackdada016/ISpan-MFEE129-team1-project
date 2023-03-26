import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
const DescendPriceOrder = () => {
  const [data, setData] = useState([])
  const { typeID } = useParams()

  useEffect(() => {
    fetch(`http://localhost:3002/product/list-product/${typeID}`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.log(err))
  }, [typeID])

  const descendSort = () => {
    //如果後面的價格比較大，那就會移到前面
    const descend = data.sort(
      (a, b) => parseInt(b.product_price) - parseInt(a.product_price)
    )
    setData(descend)
  }
  return (
    <button id="price-ascend-order" onClick={descendSort}>
      由高至低
    </button>
  )
}

export default DescendPriceOrder
