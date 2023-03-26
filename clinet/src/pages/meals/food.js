import { AddToCartLg, AddToFavoritesLg } from '../../template'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import MealsHeaderSearch from './MealsHeaderSearch'

function Food() {
  const { product_id } = useParams()
  const id = localStorage.getItem('id')
  const [Food, setFood] = useState([])
  useEffect(() => {
    fetch(`http://localhost:3002/product/list-detail/${product_id}`)
      .then((res) => res.json())
      .then((data) => {
        setFood(data)
      })
      .catch((error) => console.log(error))
  }, [product_id])

  return (
    <>
      <MealsHeaderSearch />
      {Food.map((item, i) => {
        return (
          <div className="course-detail-container" key={i}>
            <div className="course-detail-photo-wrapper">
              <img
                src={`http://localhost:3002/uploads/${item.product_image}`}
                alt=""
              />
            </div>
            <div className="course-detail-information">
              <h1 className="product-name">{item.product_name}</h1>
              <span className="product-unit">{item.product_unit}</span>
              <p className="product-article">{item.product_descripttion}</p>
              <h2 className="product-price">NT.{item.product_price}</h2>
              <div className="product-button-wrapper">
                {/* <button className="product-add-collection">加入收藏</button>
              <button className="product-add-cart">加入購物車</button> */}
                <AddToFavoritesLg product={item} typeID={4} />
                <AddToCartLg product={item} />
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default Food
