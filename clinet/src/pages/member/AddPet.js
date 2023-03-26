import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function AddPet() {
  const [addPet, setAddPet] = useState('')

  return (
    <div className="member-container">
      <section className="member-main">
        <h1 className="member-title">毛孩資訊</h1>
        <span>
          新增一筆寵物資料
          <FontAwesomeIcon
            icon={faPlus}
            className="faCirclePlus"
            display="none"
            onClick={() => {}}
          />
        </span>
        <form className="member-form">
          <div className="pet">
            <select className="form-select">
              <option selected>寵物種類</option>
              <option value="0">貓</option>
              <option value="1">狗</option>
              <option value="2">其他</option>
            </select>
            <select className="form-select">
              <option selected>寵物性別</option>
              <option value="0">男</option>
              <option value="1">女</option>
            </select>
          </div>

          <label className="member-label" id="adjust">
            <input
              id="name"
              type="text"
              name="name"
              placeholder="寵物姓名"
              value=""
            />
          </label>
          <button
            type="button"
            className="btn btn-outline-primary btn-md"
            onclick="history.back();"
          >
            返回
          </button>
          <button
            type="button"
            className="btn btn-primary btn-md min-width-auto"
          >
            確認
          </button>
        </form>
      </section>
    </div>
  )
}
export default AddPet
