import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'
function ActivityReservation() {
  return (
    <>
      {/* footer按鈕 */}
      <button type="button" className="btn btn-secondary btn-md min-width-auto">
        活動預約
        <FontAwesomeIcon icon={faCaretRight} />
      </button>
    </>
  )
}
export default ActivityReservation