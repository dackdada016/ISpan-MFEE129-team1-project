import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const passwordType = showPassword ? 'text' : 'password'
  const passwordType2 = showPassword2 ? 'text' : 'password'

  const passwordIcon = showPassword ? faEye : faEyeSlash
  const passwordIcon2 = showPassword2 ? faEye : faEyeSlash

  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== password2) {
      setMessage('密碼不一致')
      return
    }
    const urlParams = new URLSearchParams(window.location.search)
    console.log(window.location.search)
    const token = urlParams.get('token')

    try {
      const passData = { password, password2 }
      const response = await fetch(
        `http://localhost:3002/reset-password${window.location.search}`,
        {
          method: 'post',
          body: JSON.stringify(passData),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()
      setMessage(data.message)
      Swal.fire('重設密碼成功', '', 'success')
      navigate('/')
    } catch (error) {
      console.error(error)
      setMessage('錯誤發生')
    }
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
            <h3>重設密碼</h3>

            {/* <br /> */}
            {/* <div className="pwdGroup1"> */}
            <input
              className="form-control"
              type={passwordType}
              value={password}
              placeholder="新密碼:"
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              maxLength={10}
            />
            <FontAwesomeIcon
              className="passwordGroup"
              icon={passwordIcon}
              onClick={handleShowPassword}
              style={{
                position: 'absolute',
                top: 'calc(50% - 60px)',
                right: '10%',
                left: '75%',
                // transform: 'translateX(-180%)',
                color: '#515151',
              }}
            />
            {/* </div> */}
            <br />
            {/* <div className="pwdGroup2"> */}
            <input
              className="form-control"
              type={passwordType2}
              value={password2}
              placeholder="確認密碼:"
              onChange={(event) => setPassword2(event.target.value)}
              required
              minLength={6}
              maxLength={10}
            />
            <FontAwesomeIcon
              className="passwordGroup2"
              icon={passwordIcon2}
              onClick={handleShowPassword2}
              style={{
                position: 'absolute',
                top: 'calc(60% - 52px)',
                right: '10%',
                left: '75%',
                // transform: 'translateX(-180%)',
                color: '#515151',
              }}
            />
            {/* </div> */}
            <br />
            <button className="btn btn-primary-for-login" type="submit">
              送出
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
export default ResetPassword
