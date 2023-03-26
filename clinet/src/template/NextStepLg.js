// import { useState } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
function NextStepLg(props) {
  return (
    <>
      {/* 大的按鈕: 下一步，確認送出，回首頁 */}
      <button type="button" className="btn btn-primary btn-lg min-width-auto" onClick={props.onClick}>
        下一步
      </button>
    </>
  )
}
export default NextStepLg