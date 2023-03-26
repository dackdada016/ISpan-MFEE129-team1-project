import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

function MealsHeaderSearch() {
  return (
    <>
      <div className="main-button">
        <div className="button__list">
          <Link to="/Cat/4">風味餐點</Link>
          <Link to="/Cat/4">香醇飲品</Link>
          <Link to="/Cat/4">精緻甜點</Link>
          <Link to="/Cat/4">寵物專區</Link>
        </div>
        <form className="header-search">
          <input type="search" placeholder="搜尋" name="" />
          <button type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
      </div>
    </>
  )
}

export default MealsHeaderSearch
