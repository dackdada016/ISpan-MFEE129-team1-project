import React from 'react'

function FormTemplate() {
  return (
    <>
      <div className="form-container">
        <form>
          <div className="mb-3">
            <select
              className="form-select mb-3"
              aria-label="Default select example"
            >
              <option selected>信用卡</option>
              <option value="1">貨到付款</option>
            </select>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="卡號"
            />
          </div>
          <div className="d-flex">
            <div className="mb-3 col-6 pr-1">
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="到期日"
              />
            </div>
            <div className="mb-3 col-6 pl-1">
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="安全碼"
              />
            </div>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            <label className="form-check-label" for="exampleCheck1">
              Check me out
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
            />
            <label className="form-check-label" for="flexRadioDefault1">
              Default radio
            </label>
          </div>
        </form>
      </div>
    </>
  )
}

export default FormTemplate
