import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  faCircleXmark,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Swal from 'sweetalert2'

function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const passwordType = showPassword ? 'text' : 'password'
  const passwordType2 = showPassword2 ? 'text' : 'password'

  const passwordIcon = showPassword ? faEye : faEyeSlash
  const passwordIcon2 = showPassword2 ? faEye : faEyeSlash

  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const id = localStorage.getItem('id')
    const email = localStorage.getItem('email')

    fetch(`http://localhost:3002/member/changePassword/${id}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data)
      })
      .catch((error) => console.error(error))
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault()
    const id = localStorage.getItem('id')
    const passData = { password, password2 }

    // if (password !== password2) {
    //   console.log('密碼不一致')
    //   setMessage('密碼不一致')
    //   return
    // }
    fetch(`http://localhost:3002/member/changePassword/${id}`, {
      method: 'PUT',
      body: JSON.stringify(passData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Swal.fire('密碼更改成功!', '', 'success')
          navigate('/login')
        } else {
          Swal.fire('密碼沒有修改成功!', '', 'error')
        }
      })
      .catch((error) => console.error(error))
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleShowPassword2 = () => {
    setShowPassword2(!showPassword2)
  }

  return (
    <>
      <section className="login-container">
        <div className="login-main">
          <form className="login-form" onSubmit={handleSubmit}>
            <h3 className="m-3">更新密碼</h3>
            <div className="typeArea">
              <input
                className="form-control"
                type={passwordType}
                value={password}
                placeholder="新密碼:"
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                maxLength={10}
                required
              />
              <FontAwesomeIcon
                className="passwordGroup"
                icon={passwordIcon}
                onClick={handleShowPassword}
                style={{
                  position: 'absolute',
                  top: '15%',
                  transform: 'translateY(-23%)',
                  color: '#515151',
                }}
              />
              <br />
              <input
                className="form-control"
                type={passwordType2}
                value={password2}
                placeholder="確認密碼:"
                onChange={(event) => setPassword2(event.target.value)}
                minLength={6}
                maxLength={10}
                required
              />
              <FontAwesomeIcon
                className="passwordGroup"
                icon={passwordIcon2}
                onClick={handleShowPassword2}
              />
            </div>
            <br />
            <button className="btn btn-primary-for-login" type="submit">
              送出
            </button>
          </form>
          <button
            className="btn btn-primary btn-lg px-5"
            onClick={() => navigate(-1)}
          >
            返回
          </button>
        </div>
      </section>
    </>
  )
}
export default ChangePassword
