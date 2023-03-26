import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleLeft } from '@fortawesome/free-solid-svg-icons'
function BackToPrevious() {
  const navigate = useNavigate()
  return (
    <>
      {/* 返回上一頁按鈕 */}
      <button className="click" onClick={() => navigate(-1)}>
        <FontAwesomeIcon className="d-flex pt-1" icon={faCircleLeft} />
        返回上一頁
      </button>
    </>
  )
}
export default BackToPrevious
