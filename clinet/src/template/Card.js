import photo from '../img/productDetails/cheese.jpg'
// { photo }帶入參數
// function Card({photo}) {
import { AddToCartSm, MoreSquare, Heart } from './index'

function Card({ product, typeID }) {
  // eslint-disable-next-line prettier/prettier
  [product].forEach((product) => {
    const img = product.product_image.split(',')
    const bigImage = img[0]
    product.product_img = bigImage
  })
  const {
    product_id,
    product_name,
    product_class,
    product_price,
    product_descripttion,
    product_img,
  } = product
  // console.log(product)
  return (
    <div className="productCard col-4 m-auto">
      <section className="text-part">
        <h2 className="title">{product_name}</h2>
        <span hidden>{product_class}</span>
        <p className="description">{product_descripttion}</p>
        <span className="price">NT. {product_price}</span>
      </section>
      <section className="buttons">
        <div className="button-collection">
          <Heart product={product} typeID={typeID} />
          <AddToCartSm product={product} />
          <MoreSquare product_id={product_id} typeID={typeID} />
        </div>
        {/* <MoreSquare typeID={typeID} product_id={product_id} /> */}
      </section>
      {/* 圖片動態引入 ，圖片須放在public資料夾*/}
      <img src={`http://localhost:3002/${product_img}`} alt="" />
      {/* <img src={'http://localhost:3000/' + photo} alt="" /> */}
      {/* <img src={photo} alt="" /> */}
    </div>
  )
}
export default Card
