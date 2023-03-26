import React from 'react'
import { useState } from 'react'

const DescendTimeSort = () => {
  const [data, setData] = useState([])
  const sortData = () => {
    let regex = /\d/gi
    //從單位字串中先篩選數字出來，去掉第一個不用的數字，接著把字元串在一起，轉成數值資料後再比較大小作排序
    const sample = data.sort(
      (a, b) =>
        parseInt(
          b.product_unit
            .match(regex)
            .slice(1)
            .reduce((a, b) => a + b)
        ) -
        parseInt(
          a.product_unit
            .match(regex)
            .slice(1)
            .reduce((a, b) => a + b)
        )
    )
    setData(sample)
  }
  return (
    <>
      <button id="time-descend-order" onClick={sortData}>
        由高至低
      </button>
    </>
  )
}

export default DescendTimeSort
