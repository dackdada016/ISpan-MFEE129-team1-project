import { AddToCartLg, AddToFavoritesLg, BackToPrevious } from '../../template'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function ProductDetail() {
  const [product, setProduct] = useState({})

  const navigate = useNavigate()
  // 取得query string的值
  const { product_id } = useParams()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchProductDetails() {
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
  const handleBackToPrevious = () => navigate(-1)

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

  const imageUrls = imageUrl ? imageUrl.split(',') : []
  const id = localStorage.getItem('id')

  useEffect(() => {
    if (!product_id) return
    fetchProductDetails()
  }, [product_id])
  return (
    <>
      <BackToPrevious onClick={handleBackToPrevious} />
      <div className="product-container">
        <section className="product-introduction">
          <div className="product-photo-wrapper">
            {imageUrls[0] && (
              // eslint-disable-next-line jsx-a11y/img-redundant-alt
              <img
                className="product-photo"
                src={`http://localhost:3002/uploads/${imageUrls[0]}`}
                alt="product-photo"
              />
            )}
          </div>
          <div className="product-information">
            <h1 className="product-name">{name}</h1>
            <span className="product-unit">{unit}</span>
            <p className="product-article">{descripttion}</p>
            <h2 className="product-price">NT.{price}</h2>
            <div className="product-button-wrapper">
              {/* <button className="product-add-collection">加入收藏</button>
              <button className="product-add-cart">加入購物車</button> */}
              <AddToFavoritesLg product={product} id={id} typeID={typeID} />
              <AddToCartLg product={product} />
            </div>
          </div>
        </section>
        <section className="image-list">
          <p className="col-9 pt-3 pb-3 m-auto mt-3 mb-3 border-bottom border-warning white-space-pre">
            商品介紹
          </p>
          {imageUrls.slice(1).map((imageUrl, index) => (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img
              key={index}
              className="product-photo m-auto"
              src={`http://localhost:3002/uploads/${imageUrl}`}
              alt="product-photo"
            />
          ))}
          <p className="col-9 pt-3 pb-3 m-auto mt-3 mb-3 border-top border-bottom border-warning white-space-pre">
            退貨須知:
            收到商品之後，若因商品瑕疵、錯誤寄送，非人為因素之商品損毀、刮傷、或運輸過程造成包裝破損不完整的情形，可以申請退換貨
          </p>
        </section>
      </div>
    </>
  )
}
export default ProductDetail
