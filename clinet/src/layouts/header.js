import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumbList">
          <li>
            <Link to="/" className="Breadcrumb__link">
              首頁
            </Link>
          </li>
          <li>
            <Link to="/Product" className="Breadcrumb__link">
              商城
            </Link>
          </li>
          <li className="current">
            <em aria-current="page">商品詳細</em>
          </li>
        </ol>
      </nav>
    </>
  )
}

export default Header
