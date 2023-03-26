import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import 'datejs'
import Swal from 'sweetalert2'
import BackToPrevious from '../../template/BackToPrevious'

function SignUpSheetDetail() {
  const { activityform_id } = useParams()
  const [list, setList] = useState({})
  const [firstRender, setFirstRender] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:3002/activity/DetailActivityRecord/${activityform_id}`,
        {
          method: 'GET',
        }
      )
      let list = await res.json()
      list = {
        ...list,
        activity_image: list.activity_image.split(','),
      }
      console.log('list', list)

      setFirstRender(false)
      setList({ ...list })
    }
    fetchData()
  }, [activityform_id])
  // console.log(activity)
  const handleClick = (e) => {
    fetch(`http://localhost:3002/activity/AformState/${activityform_id}`, {
      method: 'PUT',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: '取消成功',
            showConfirmButton: false,
            timer: 1500,
          })
          setList({ ...list, activityform_state: 0 })
        } else {
          alert('取消失敗')
        }
        console.log(data)
      })
  }
  return (
    <>
      {firstRender ? (
        false
      ) : (
        <div>
          <BackToPrevious />
          <section className="col-10 m-auto pt-3">
            <h4 className="border-bottom pb-2">活動報名資訊</h4>
            <div className="order d-flex flex-column border-bottom mb-3">
              <h5 className="mb-3 ">詳細資訊</h5>
              <div className="row">
                <p className="col-auto me-auto">
                  狀態:
                  {list.activityform_state === 0 ? (
                    <span>已取消</span>
                  ) : (
                    <span>報名</span>
                  )}
                </p>
                <div className="col-auto">
                  {list.activityform_state === 0 ? (
                    false
                  ) : (
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={handleClick}
                    >
                      取消報名
                    </button>
                  )}
                </div>
              </div>

              <p className="mb-3">報名編號：{list.activityform_id}</p>
              <p className="mb-3">
                報名日期:
                {new Date(list.activityform_time).toString(
                  'yyyy.MM.dd - HH:mm:ss'
                )}
              </p>
            </div>
            <div className="person d-flex flex-column border-bottom mb-3">
              <h5 className="mb-3">報名人資訊</h5>
              <p>姓名:{list.name}</p>
              <p>連絡電話:{list.mobile}</p>
              <p>信箱:{list.email}</p>
            </div>
            <div className="person d-flex flex-column border-bottom mb-3">
              <h5 className="mb-3">寵物資訊</h5>
              <p>姓名:{list.pet_name}</p>
              <p>寵物類型:{list.pet_type}</p>
              <p>性別:{list.pet_gender}</p>
            </div>

            <div className="test border-bottom mb-3">
              <table>
                <thead>
                  <tr>
                    <th>活動圖</th>
                    <th>活動名稱</th>
                    <th>時間</th>
                    <th>活動日期</th>
                    <th>結束日期</th>
                    <th>適合寵物類型</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img
                        src={`http://localhost:3002/uploads/${list.activity_image[0]}/`}
                        alt="activity_img"
                      />
                    </td>
                    <td>{list.activity_name}</td>
                    <td>{list.activity_time}</td>
                    <td>
                      {new Date(list.activity_datestart).toString('yyyy-MM-dd')}
                    </td>
                    <td>
                      {new Date(list.activity_dateend).toString('yyyy-MM-dd')}
                    </td>
                    {list.activity_pettype === 1 ? (
                      <td>所有</td>
                    ) : list.activity_pettype === 2 ? (
                      <td>狗狗</td>
                    ) : (
                      <td>貓貓</td>
                    )}
                    {/* <td>{list.activity_pettype}</td> */}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <div className="return d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => navigate(-1)}
            >
              返回
            </button>
          </div>
        </div>
      )}
    </>
  )
}
export default SignUpSheetDetail
