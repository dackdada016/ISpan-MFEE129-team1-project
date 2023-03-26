import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
const AscendPriceOrder = () => {
  const [data, setData] = useState([])
  const { typeID } = useParams()

  useEffect(() => {
    fetch(`http://localhost:3002/product/list-product/${typeID}`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.log(err))
  }, [typeID])

  const ascendSort = () => {
    //如果前面的價格比較大，那就會移到後面
    const ascend = data.sort(
      (a, b) => parseInt(a.product_price) - parseInt(b.product_price)
    )
    setData(ascend)
  }
  return (
    <button id="price-ascend-order" onClick={ascendSort}>
      由低至高
    </button>
  )
}

export default AscendPriceOrder
