import React from 'react'
import { useState } from 'react'

const KeywordSearch = () => {
  const [dataInput, setDataInput] = useState('')
  const searchData = () => {
    if (dataInput !== '') {
      let text = dataInput
      let regex = new RegExp(`.*${text}.*`, 'i')
      const data = dataInput.filter((item) => item.product_name.match(regex))
      setDataInput(data)
    } else {
      return
    }
  }

  return (
    <div className="searchbar">
      <input
        type="search"
        id="search"
        onChange={(e) => {
          setDataInput(e.target.value)
        }}
        placeholder="搜尋"
      />
      <button id="search-button" onClick={searchData}>
        &#128269;
      </button>
    </div>
  )
}

export default KeywordSearch
