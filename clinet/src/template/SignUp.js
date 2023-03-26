import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
function SignUp() {
  return (
    <>
      {/* 藍色小按鈕 */}
      <button
        type="button"
        className="btn max-width-auto btn-sm min-width-auto radius-5px"
      >
        立即報名
      </button>
    </>
  )
}
export default SignUp
