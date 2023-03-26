import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import moment from 'moment-timezone'
import Swal from 'sweetalert2'
// import { CloudinaryContext, Image, Transformation } from 'cloudinary-react'
// import axios from 'axios'
// import { set } from 'date-fns'

function EditMember() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    birthday: '',
    // avatar: '',
  })
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    birthday: '',
    avatar: '',
  })

  const [image, setImage] = useState('')

  const navigate = useNavigate()

  // 設定統一時區
  moment.tz.setDefault('Asia/Taipei')

  // 將日期字串轉換為moment物件
  const date = moment(user.birthday, 'YYYY-MM-DD')

  // 轉換時區
  const dateInTimezone = date.clone().tz('Asia/Taipei')

  // 取得轉換後的日期字串
  const yyyyMMddDate = dateInTimezone.format('YYYY-MM-DD')

  useEffect(() => {
    const id = localStorage.getItem('id')
    const email = localStorage.getItem('email')

    fetch(`http://localhost:3002/member/edit/${id}`, {
      method: 'GET',
      headers: {
        // 'Content-Type': 'application/json',
        // Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data)
        setUser(data)
        // if (user.avatar !== '') {
        //   setImage(user.avatar)
        // }
      })
      .catch((error) => console.error(error))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const id = localStorage.getItem('id')
    const fd = new FormData(e.currentTarget)

    fetch(`http://localhost:3002/member/edit/${id}`, {
      method: 'PUT',
      headers: {
        // 'Content-Type': 'application/json',
        // Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: fd,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Swal.fire('修改成功!', '', 'success')
          navigate('/')
        } else {
          Swal.fire('修改失敗!', '', 'error')
        }
      })
      .catch((error) => console.error(error))
  }

  //圖片
  // const handleImageChange = async(event) => {
  //   const file = event.target.files[0]
  //   const formData = new FormData()
  //   formData.append('file', file)
  // formData.append('upload_preset', 'pnnm2cbe')

  // axios
  //   .post('https://api.cloudinary.com/v1_1/dwc9top1o/image/upload', formData)
  //   .then((res) => {
  //     setImage(res.data.secure_url)
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   })
  //   try{
  //     const res = await fetch ('http://localhost:3002/member/upload',{
  //       method:'GET',
  //       body:'formData',
  //     })
  //     const data= await res.json()
  //     console.log(data)
  //   }catch(error){
  //     console.log(error)
  //   }
  // }

  // const uploadImage = (files) => {
  //   // console.log(files[0])
  //   const formData = new FormData()
  //   formData.append('file', image)
  //   formData.append('upload_prset', 'pnnm2cbe')

  //   axios
  //     .post('https://api.cloudinary.com/v1_1/dwc9top1o/image/upload', formData)
  //     .then((res) => {
  //       console.log(res)
  //     })
  // }

  return (
    <div className="member-container">
      <section className="member-main">
        <h1 className="member-title">我的個人資料</h1>
        <form className="member-form" onSubmit={handleSubmit}>
          {/* <div>
            {image !== '' ? (
              <Image
                src={image}
                publicId={image}
                cloudName="dwc9top1o"
                onError={(err) => console.log(err)}
                secure
              >
                <Transformation width="200" height="200" crop="thumb" />
              </Image>
            ) : (
              <>
                <label htmlFor="upload-image" className="upload-icon">
                  <FontAwesomeIcon icon={faCircleUser} />
                </label>
                <input
                  type="file"
                  name="avatar"
                  id="upload-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </>
            )}
          </div> */}

          <label className="member-label">
            <input
              id="name"
              type="text"
              name="name"
              placeholder="姓名"
              value={user.name}
              onChange={(e) =>
                setUser({
                  ...user,
                  name: e.target.value,
                })
              }
            />
            {fieldErrors.name && <span>{fieldErrors.name}</span>}
          </label>

          <label className="member-label">
            <input
              id="mobile"
              type="tel"
              name="mobile"
              placeholder="電話"
              value={user.mobile}
              onChange={(e) =>
                setUser({
                  ...user,
                  mobile: e.target.value,
                })
              }
            />
            {fieldErrors.mobile && <span>{fieldErrors.mobile}</span>}
          </label>

          <label className="member-label">
            <input
              id="email"
              type="email"
              name="email"
              placeholder="信箱"
              value={user.email}
              onChange={(e) =>
                setUser({
                  ...user,
                  email: e.target.value,
                })
              }
            />
            {fieldErrors.email && <span>{fieldErrors.email}</span>}
          </label>

          <label className="member-label">
            <input
              id="address"
              type="text"
              name="address"
              placeholder="地址"
              value={user.address}
              onChange={(e) =>
                setUser({
                  ...user,
                  address: e.target.value,
                })
              }
            />
            {fieldErrors.address && <span>{fieldErrors.address}</span>}
          </label>

          <label className="member-label">
            <input
              id="birthday"
              type="date"
              name="birthday"
              value={yyyyMMddDate}
              onChange={(e) =>
                setUser({
                  ...user,
                  birthday: e.target.value,
                })
              }
            />
            {fieldErrors.birthday && <span>{fieldErrors.birthday}</span>}
          </label>
          <div className="click d-flex justify-content-evenly">
            <button
              type="button"
              className="btn btn-outline-primary btn-lg me-3"
              onClick={() => navigate(-1)}
            >
              返回
            </button>
            <button type="submit" className="btn btn-primary btn-lg ms-3">
              確認
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
export default EditMember
