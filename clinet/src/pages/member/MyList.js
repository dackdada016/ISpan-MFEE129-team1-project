import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCartShopping,
  faCircleLeft,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import 'datejs'

import { AddToCartLg, BackToPrevious } from '../../template'
import Swal from 'sweetalert2'

function MyList({ id, onDelete }) {
  const [tagCheck, setTagCheck] = useState(0)
  const [like, setLike] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)

  const navigate = useNavigate()
  const product = [...like]

  useEffect(() => {
    const id = localStorage.getItem('id')
    const fetchData = async () => {
      const res = await fetch(`http://localhost:3002/member/likes/${id}`, {
        method: 'GET',
      })
      const data = await res.json()
      const like = Array.isArray(data) ? data : [data]
      console.log(`http://localhost:3002/member/likes/${id}`, like)

      // const [...orders] = order
      like[0].likes.forEach((element) => {
        const imageArray = element.product_image.split(',')
        element.product_image = imageArray[0]
      })
      setLike(like[0].likes)
    }
    fetchData()
  }, [id])
  // console.log(order)

  const handleChange = (typeId) => {
    // console.log(typeId)
    setTagCheck(typeId)
  }

  const handleDelete = (sid) => {
    setIsDeleting(true)
    const id = localStorage.getItem('id')
    if (
      Swal.fire({
        title: '確定要刪除這筆收藏?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '確定刪除!',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('刪除成功!', '這筆收藏已被刪除', 'success')
        }
      })
    )
      fetch(`http://localhost:3002/member/deleteLikes/${sid}`, {
        method: 'DELETE',
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Like deleted successfully')
          // onDelete(sid)
          // console.log(sid)
          navigate('/login')
        })
        .catch((error) => {
          console.error('Error deleting like', error)
        })
        .finally(() => {
          setIsDeleting(false)
        })
    // navigate('/login')
  }

  return (
    <>
      {/* <button className="click" onClick={() => navigate(-1)}>
        <FontAwesomeIcon className="d-flex pt-1" icon={faCircleLeft} />
        返回上一頁
      </button> */}
      <BackToPrevious></BackToPrevious>
      <h1 className="orderTitle">我的收藏列表</h1>
      {/* <div className="info">{JSON.stringify(order)}</div> */}
      <main className="checkoutFlow">
        <div className="tabs">
          <input
            type="radio"
            className="tabs__radio"
            name="tabs-example"
            id="tab1"
            onChange={() => {
              handleChange(0)
            }}
            checked={tagCheck === 0}
            // checked={tagCheck === '所有'}
          />
          <label htmlFor="tab1" className="tabs__label">
            所有
          </label>
          <input
            type="radio"
            className="tabs__radio"
            name="tabs-example"
            type_id="1"
            id="tab2"
            onChange={() => {
              handleChange(1)
            }}
            checked={tagCheck === 1}
            // checked={tagCheck}
          />
          <label htmlFor="tab2" className="tabs__label">
            商城
          </label>
          <input
            type="radio"
            className="tabs__radio"
            name="tabs-example"
            id="tab3"
            type_id="4"
            onChange={() => {
              handleChange(4)
            }}
            checked={tagCheck === 4}
          />
          <label htmlFor="tab3" className="tabs__label">
            餐點
          </label>
          <input
            type="radio"
            className="tabs__radio"
            name="tabs-example"
            id="tab5"
            type_id="2"
            onChange={() => {
              handleChange(2)
            }}
            checked={tagCheck === 2}
          />
          <label htmlFor="tab5" className="tabs__label">
            課程
          </label>
          <input
            type="radio"
            className="tabs__radio"
            name="tabs-example"
            id="tab6"
            type_id="3"
            onChange={() => {
              handleChange(3)
            }}
            checked={tagCheck === 3}
          />
          <label htmlFor="tab6" className="tabs__label">
            住宿
          </label>
          <div className="test">
            <table>
              <thead>
                <tr>
                  {/* <th>編號</th> */}
                  <th>商品圖</th>
                  <th>分類</th>
                  <th>商品名稱</th>
                  <th>刪除</th>
                  <th>加入購物車</th>
                </tr>
              </thead>
              <tbody>
                {tagCheck === 0
                  ? like.map((like, k) => (
                      <tr key={`${like.sid}${k}`}>
                        {/* <td>{like.sid}</td> */}
                        <td>
                          <img
                            src={`http://localhost:3002/uploads/${like.product_image}`}
                            alt="product_img"
                          />
                        </td>
                        <td>
                          {like.type_id === 1
                            ? '商品'
                            : like.type_id === 2
                            ? '課程'
                            : like.type_id === 3
                            ? '住宿'
                            : '餐點'}
                        </td>
                        <td>{like.product_name}</td>
                        <td>
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="more-button"
                            onClick={() => handleDelete(like.sid)}
                          />
                        </td>
                        <td>
                          <>
                            <AddToCartLg
                              product={like}
                              className="more-button"
                            />
                            {/* <FontAwesomeIcon icon={faCartShopping} /> */}
                          </>
                        </td>
                      </tr>
                    ))
                  : like
                      .filter((el) => {
                        return el.type_id === tagCheck
                      })
                      .map((like, k) => (
                        <tr key={`${like.sid}${k}`}>
                          {/* <td>{like.sid}</td> */}
                          <td>
                            <img
                              src={`http://localhost:3002/uploads/${like.product_image}`}
                              alt="product_img"
                            />
                          </td>
                          <td>
                            {like.type_id === 1
                              ? '商品'
                              : like.type_id === 2
                              ? '課程'
                              : like.type_id === 3
                              ? '住宿'
                              : '餐點'}
                          </td>
                          <td>{like.product_name}</td>
                          <td>
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="more-button cursor-pointer"
                              onClick={() => handleDelete(like.sid)}
                            />
                          </td>
                          <td>
                            <>
                              <AddToCartLg
                                product={like}
                                className="more-button"
                              />
                              {/* <FontAwesomeIcon icon={faCartShopping} /> */}
                            </>
                          </td>
                        </tr>
                      ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}

export default MyList
