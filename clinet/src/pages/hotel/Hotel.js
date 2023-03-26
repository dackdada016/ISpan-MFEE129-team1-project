import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MoreSquare from '../../template/MoreSquare'
// import { AddToFavoritesLg } from '../../template'

function Hotel() {
  const [room, setRoom] = useState([]) //房型資料
  // typeID 取 App.js檔案中 path="hotel/:typeID" (:typeID是定義Param)，而typeID如何取得?是由ex: http://localhost:3000/hotel/3 那他的參數值就是3。目前hotel/3寫死是從Menu.js來的
  const { typeID } = useParams()
  // didMount
  useEffect(() => {
    fetch(`http://localhost:3002/product/list-product/${typeID}`)
      .then((res) => res.json())
      .then((room) => {
        //讓每一個物件裡都有product_likes值
        room.forEach((item) => {
          // item.product_likes = false
          console.log('item.product_image', item.product_image)
          const img = item.product_image.split(',')
          const bigImage = img[0]
          item.hotel_img = bigImage
          console.log('item', item)
        })

        setRoom(room)

        if (sessionStorage.getItem('reserveData')) {
          window.sessionStorage.removeItem('reserveData')
        }
        if (sessionStorage.getItem('roomDetail')) {
          window.sessionStorage.removeItem('roomDetail')
        }
      })
      .catch((err) => console.error(err))
  }, [typeID])

  // const test = () => {
  //   const str = []
  //   room.map((item) => str.push(item.products_descripttion))
  //   return console.log(str)
  // }
  // test()
  return (
    <>
      <div className="h-banner">
        <img
          src={require('../../img/hotels/hotel.js-banner.jpg')}
          alt="girl&dog"
          height="600"
        />
      </div>

      <div className="h-text-title">住宿房型</div>
      {/* photo */}
      {/* <Card photo={room[0] && room[0].img} /> */}
      {/* <Card photo={'hotel-single.jpg'} /> */}
      {/* <Card photo={'logo192.png'} /> */}

      <div className="card-wrap rwd-container">
        {room.map((item, i) => {
          return (
            <div className="h-card col-6 rwd-col-12" key={i}>
              <div className="h-card-left col-6">
                <div className="h-card-header">
                  <h3 className="h-card-title">{item.product_name}</h3>
                  <p className="h-card-subtitle">NT.{item.product_price}</p>
                  <p className="h-card-text">
                    {item.product_descripttion.split('').map((str, index) => {
                      return str === ',' ? <br key={index} /> : str
                    })}
                  </p>
                </div>
                <div className="h-card-footer">
                  {/* 愛心 */}
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      const newItems = [...room]
                      newItems[i] = {
                        ...newItems[i],
                        product_likes: !newItems[i].product_likes,
                      }
                      setRoom(newItems)
                    }}
                  >
                    {item.product_likes ? (
                      <span>&#9829;</span>
                    ) : (
                      <span>&#9825;</span>
                    )}
                  </span>
                  {/* <AddToFavoritesLg product={item} typeID={typeID} /> */}
                  {/* 父傳子 */}
                  <MoreSquare product_id={item.product_id} typeID={typeID} />
                </div>
              </div>
              <div className="h-card-right col-7">
                <img
                  src={`http://localhost:3002/uploads/${item.hotel_img}`}
                  alt=""
                />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
export default Hotel
