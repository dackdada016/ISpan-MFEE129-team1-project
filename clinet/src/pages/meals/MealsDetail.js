/* eslint-disable jsx-a11y/img-redundant-alt */
import photo from '../../img/productDetails/cheese.jpg'
import { AddToCartLg, AddToFavoritesLg } from '../../template'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons'

import Header from '../../layouts/header'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function MealsDetail() {
  const [product, setProduct] = useState({})

  const navigate = useNavigate()
  // 取得query string的值
  const { product_id } = useParams()
  async function fetchMealsDetail() {
    try {
      const res = await fetch(
        `http://localhost:3002/product/list-detail/${product_id}`
      )
      if (!res.ok) {
        throw new Error('network res was not ok')
      }
      const product = await res.json()
      if (product) {
        setProduct(...product)
        // console.log(product)
      } else {
        // 商品不存在，導向 404 頁面或顯示錯誤訊息
        throw new Error('Product not found')
      }
    } catch (error) {
      console.error('Error fetching product data:', error)
    }
  }

  useEffect(() => {
    if (!product_id) return
    fetchMealsDetail()
  }, [product_id])

  const {
    product_id: productID,
    product_type: typeID,
    product_name: name,
    product_class: productClass,
    product_descripttion: descripttion,
    product_price: price,
    product_unit: unit,
    product_image: imageUrl,
  } = product

  const id = localStorage.getItem('id')

  return (
    <>
      <Header />
      <FontAwesomeIcon icon={faAnglesLeft} onClick={() => navigate(-1)} />
      <div className="product-container">
        <section className="product-introduction">
          <div className="product-photo-wrapper">
            <img
              className="product-photo"
              src={'http://localhost:3002/uploads/' + imageUrl}
              alt="product-photo"
            />
          </div>
          <div className="product-information">
            <h1 className="product-name">{name}</h1>
            <span className="product-unit">{unit}</span>
            <p className="product-article">
              {descripttion}
              想必大家都能了解潔牙零食的重要性。話雖如此，浦利尼斯二世在不經意間這樣說過，痛苦有個限度，恐懼則綿綿無際。這句話看似簡單，但其中的陰鬱不禁讓人深思。泰戈爾相信，完全理智的心，恰如一柄全是鋒刃的刀，會叫使用它的人手上流血。帶著這句話，我們還要更加慎重的審視這個問題。
            </p>
            <h2 className="product-price">NT.{price}</h2>
            <div className="product-button-wrapper">
              {/* <button className="product-add-collection">加入收藏</button>
              <button className="product-add-cart">加入購物車</button> */}
              <AddToFavoritesLg product={product} id={id} typeID={typeID} />
              <AddToCartLg product={product} />
            </div>
          </div>
        </section>
        <section className="product-switcher">
          <ul className="product-switches">
            <li className="product-switch">
              <a href="#" className="product-switch-link">
                商品規格
              </a>
            </li>
            <li className="product-switch">
              <a href="#act2" className="product-switch-link">
                商品規格
              </a>
            </li>
            <li className="product-switch">
              <a href="#act3" className="product-switch-link">
                商品規格
              </a>
            </li>
          </ul>
        </section>
        <section className="product-spec">
          <ul className="product-list">
            <li className="product-litem">
              <p>分類:首頁&gt;商品&gt;精緻零食</p>
            </li>
            <li className="product-litem">
              <p className="product-brand">
                品牌:<span className="product-brand-name">Merrick</span>
              </p>
            </li>
            <li className="product-litem">
              <p>產地:美國</p>
            </li>
            <li className="product-litem">
              <p>【適用寵物種類】全犬種</p>
            </li>
            <li className="product-litem">
              <p>
                【注意事項】鑑賞期並非適用期,若您需退換貨商品,必須是全新完整包裝狀態.
              </p>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}
export default MealsDetail
