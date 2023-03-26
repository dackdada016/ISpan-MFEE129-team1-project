import HeaderSearch from '../../layouts/HeaderSearch'
import { useState, useEffect } from 'react'
import { Card } from '../../template'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/scss'
import 'swiper/scss/pagination'
import { Autoplay, Pagination, EffectFade } from 'swiper'
function Product() {
  const { typeID } = useParams()
  const [product, setProduct] = useState([])
  const [filteredProduct, setFilteredProduct] = useState([])

  // 取得DB資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(typeID)
        const res = await fetch(
          `http://localhost:3002/product/list-product/${typeID}`
        )
        if (!res.ok) {
          throw new Error('Network res was not ok')
        }

        const product = await res.json()
        setProduct(product)
      } catch (error) {
        throw new Error('沒有商品資料')
      }
    }
    fetchData()
  }, [typeID])
  const {
    product_id: productID,
    product_name: name,
    product_class: productClass,
    product_descripttion: descripttion,
    product_price: price,
    product_unit: unit,
    product_image: imageUrl,
  } = product

  const handleFilter = (filteredProducts) => {
    setFilteredProduct(filteredProducts)
  }
  const handleClear = () => {
    setFilteredProduct(product)
  }

  const mapProduct = filteredProduct.length === 0 ? product : filteredProduct

  return (
    <div className="productPage">
      <HeaderSearch
        product={product}
        filteredProduct={filteredProduct}
        onFilter={handleFilter}
        handleClear={handleClear}
      />
      <div className="swiper-Content ms-5 d-flex">
        <Swiper
          slidesPerView="3"
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          speed={3000}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper"
        >
          {product.map((product, idx) => {
            const imageUrls = product.product_image
              ? product.product_image.split(',')
              : []
            const imageUrl = imageUrls.length > 0 ? imageUrls[0] : ''
            console.log(imageUrl)
            return (
              <SwiperSlide key={idx}>
                <Link to={`/product/Detail/${product.product_id}`}>
                  <img
                    src={`http://localhost:3002/uploads/${imageUrl}`}
                    alt=""
                    className="swiper-img"
                  />
                </Link>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
      <h2 className="m-3">全部商品</h2>
      <div className="productContent col-12 ">
        {mapProduct.map((product) => (
          <Card
            key={product.id}
            className="col-6"
            product={product}
            typeID={typeID}
          />
        ))}
      </div>
    </div>
  )
}

export default Product
