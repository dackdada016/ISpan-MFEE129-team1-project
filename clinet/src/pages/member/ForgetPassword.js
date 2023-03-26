import React, { useState } from 'react'

function ForgetPassword() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3002/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      alert(data.message)
    } catch (error) {
      console.error(error)
      alert('錯誤發生')
    }
  }

  return (
    <section className="login-container">
      <div className="login-main">
        <form className="login-form" onSubmit={handleSubmit}>
          <h3>忘記密碼</h3>
          <div className="typeArea">
            <input
              className="form-control"
              type="email"
              value={email}
              placeholder="請輸入email"
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <br />
          <button
            className="btn btn-primary-for-login min-width-auto"
            type="submit"
          >
            重設密碼
          </button>
        </form>
      </div>
    </section>
  )
}
export default ForgetPassword
