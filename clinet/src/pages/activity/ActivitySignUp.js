import React from 'react'
import Stepper from './Stepper'
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

function ActivitySignUp() {
  //頁數
  const [step, setStep] = useState(1)
  const handleStepChange = (newStep) => {
    setStep(newStep)
  }
  const navigate = useNavigate()
  //有無驗證成功->預設驗證成功
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  //第一步列表
  const [tagCheck, setTagCheck] = useState('tab1')
  const handleChange = (event) => {
    setTagCheck(event.target.id)
  }
  const { activity_id } = useParams()
  const id = localStorage.getItem('id')
  const [activity, setActivity] = useState({})
  const [member, setMember] = useState({})
  const [pets, setPets] = useState([])
  const [firstRender, setFirstRender] = useState(true)

  useEffect(() => {
    // if (firstRender) {
    //   setFirstRender(false)
    // }

    const storedId = localStorage.getItem('id')
    if (storedId) {
      setIsAuthenticated(true)
      fetchData()
    } else {
      Swal.fire('請先登入')
      navigate('/login')
    }
  }, [activity_id, id])
  // console.log(activity)

  const fetchData = async () => {
    const res = await fetch(
      `http://localhost:3002/activity/activitydetail/${activity_id}`,
      {
        method: 'GET',
      }
    )
    let activities = await res.json()
    activities = {
      ...activities,
      activity_image: activities.activity_image.split(','),
    }

    setFirstRender(false)
    setActivity({ ...activities })

    const res2 = await fetch(`http://localhost:3002/member/pet/${id}`, {
      method: 'GET',
    })
    const pets = await res2.json()
    setPets(pets)

    const res3 = await fetch(`http://localhost:3002/member/edit/${id}`, {
      method: 'GET',
    })
    const member = await res3.json()
    setMember(member)

    // setFirstRender(false)
  }

  //第二步表單
  const [pet, setPet] = useState({
    name: '',
    type: '狗',
    gender: '男生',
  })
  //---用於記錄錯誤訊息之用
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    type: '',
    gender: '',
  })
  //---處理每個欄位的變動
  const handleFieldChange = (e) => {
    //---以下要依照通用的三步驟原則來更新狀態
    setPet({ ...pet, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    //---第一航要阻擋預設的form送出行為
    e.preventDefault()
    //---獲得目前的表單輸入值
    //---1.從state獲得
    console.log(pet)
    //---2. 用FormData API獲得
    const formData = new FormData(e.target)
    console.log(formData.get('name'))
    formData.set('activity_id', activity_id)

    //---做送至伺服器(fetch, ajax...) ->submit
    fetch(`http://localhost:3002/member/addPet/${id}`, {
      method: 'POST',
      // headers: { 'Content-Type': 'application/json' },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success1) {
          fetchData()
        } else {
          alert('新增失敗')
        }
        console.log(data)
      })
  }
  //表單有發生驗證錯誤時，會觸發事件
  const handelInvalid = (e) => {
    e.preventDefault()
    console.log('檢查有錯誤:', e.target.name, e.target.validationMessage)

    //紀錄錯誤訊息
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: e.target.validationMessage,
    })
  }

  // 當使用者回頭修正表單中任一欄位時，先清除此欄位的錯誤訊息
  const handleFormChange = (e) => {
    // 記錄錯誤訊息
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: '',
    })
  }

  const submitActivity = (e) => {
    const formA = document.querySelector('#formActivity')
    const fd = new FormData(formA)
    fd.set('mid', id)
    fd.set('activity_id', activity_id)
    for (let i in fd.entries()) {
      console.log(i)
    }

    const url = `http://localhost:3002/activity/addForm`
    fetch(url, {
      method: 'post',
      body: fd,
    })
      .then((r) => r.json())
      .then((rData) => {
        if (rData.success) {
          navigate(setStep(3))
          fetchData()
        } else {
          alert('新增失敗')
        }
        console.log(url, rData)
      })
  }

  return (
    <>
      {!isAuthenticated || firstRender ? (
        false
      ) : (
        <div className="SignUp-page">
          <div className="SignUp-head">
            <Stepper step={step} />
          </div>
          <div className="SignUp-body">
            {/* 步驟一 */}
            {step === 1 && (
              <div>
                {/* 步驟一的內容。 */}
                <main className="checkoutFlow">
                  <div className="tabs">
                    <input
                      type="radio"
                      className="tabs__radio"
                      name="tabs-example"
                      id="tab1"
                      onChange={handleChange}
                      checked={tagCheck === 'tab1'}
                    />
                    <label htmlFor="tab1" className="tabs__label">
                      活動
                    </label>
                    <div className="tabs__content">
                      <table>
                        <thead>
                          <tr>
                            <th>活動圖</th>
                            <th>名稱</th>
                            <th>活動日期</th>
                            <th>截止日期</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <img
                                src={`http://localhost:3002/uploads/${activity.activity_image[0]}/`}
                                alt=""
                              />
                            </td>
                            <td>{activity.activity_name}</td>
                            <td>
                              {new Date(activity.activity_datestart).toString(
                                'yyyy-MM-dd'
                              )}
                            </td>
                            <td>
                              {new Date(activity.activity_dateend).toString(
                                'yyyy-MM-dd'
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </main>
                <div className="mt-5 d-flex justify-content-between">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => handleStepChange(2)}
                  >
                    下一步
                  </button>
                </div>
              </div>
            )}

            {/* 步驟二 */}
            {step === 2 && (
              <div>
                <div className="step2-container">
                  {/* 步驟二的內容。 */}
                  <div className="step2-form1">
                    <div className="step2-form1-title">
                      <h5 className="step-form1-word">報名人資料</h5>
                    </div>
                    <div className="step-table-wrap">
                      <div className="step-table-title">姓名</div>
                      <div className="step-table-description">
                        {member.name}
                      </div>
                    </div>
                    <div className="step-table-wrap">
                      <div className="step-table-title">電話</div>
                      <div className="step-table-description">
                        {member.mobile}
                      </div>
                    </div>
                    <div className="step-table-wrap">
                      <div className="step-table-title">信箱</div>
                      <div className="step-table-description">
                        {member.email}
                      </div>
                    </div>

                    <form name="formActivity" id="formActivity">
                      <div div className="step-table-wrap">
                        <div className="step-table-title">選擇攜帶寵物</div>
                        <div className="pet-select">
                          {pets.map((el, idx) => {
                            return (
                              <div key={idx} className="pet-select-box">
                                <input
                                  type="radio"
                                  name="pets"
                                  id="pets"
                                  value={el.pet_id}
                                  checked
                                />
                                {el.pet_name}
                                <label htmlFor="exampleRadios1"></label>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="step-form2">
                    <div className="step2-form1-title">
                      <h5 className="step-form1-word">新增寵物</h5>
                    </div>

                    <form
                      className="addpet-form"
                      onSubmit={handleSubmit}
                      onInvalid={handelInvalid}
                      onChange={handleFormChange}
                    >
                      <input type="hidden" name="id" value={id} />
                      <div className="step2-form-text">名字</div>
                      <label className="addpet-control">
                        <input
                          id="name"
                          type="text"
                          name="name"
                          className="addpet-control"
                          value={pet.name}
                          onChange={handleFieldChange}
                          required
                        />

                        <span className="error">{fieldErrors.name}</span>
                      </label>

                      <div className="addpet-select">
                        <span className="step2-form-text">寵物種類</span>
                        <label className="addpet-type">
                          <input
                            onChange={handleFieldChange}
                            type="radio"
                            value="貓"
                            name="type"
                            checked
                          />
                          <span className="step2-form-text">貓</span>
                          <input
                            onChange={handleFieldChange}
                            type="radio"
                            value="狗"
                            name="type"
                          />
                          <span className="step2-form-text">狗</span>
                          <input
                            onChange={handleFieldChange}
                            type="radio"
                            value="其他"
                            name="type"
                          />
                          <span className="step2-form-text">其他</span>
                        </label>
                        <br />
                        <span className="step2-form-text">寵物性別</span>
                        <label className="addpet-type">
                          <input
                            onChange={handleFieldChange}
                            type="radio"
                            value="男生"
                            name="gender"
                            checked
                          />
                          <span className="step2-form-text">男生</span>

                          <input
                            onChange={handleFieldChange}
                            type="radio"
                            value="女生"
                            name="gender"
                          />
                          <span className="step2-form-text">女生</span>
                        </label>
                      </div>

                      <div className="signupbtn-box">
                        <button className=" btn btn-lg btn-primary-for-login">
                          送出
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="mt-5 d-flex justify-content-between">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => handleStepChange(1)}
                  >
                    上一步
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    type="submit"
                    onClick={submitActivity}
                  >
                    送出
                  </button>
                </div>
              </div>
            )}

            {/* 步驟三 */}
            {step === 3 && (
              <div className="step3">
                <h4>報名成功</h4>
                <div className="checkmark-container">
                  <svg
                    x="0px"
                    y="0px"
                    width="50px"
                    stroke="red"
                    fill="none"
                    className="checkmark-svg"
                    viewBox="0 0 25 30"
                  >
                    <path d="M2,19.2C5.9,23.6,9.4,28,9.4,28L23,2" />
                  </svg>
                </div>
                <div className="checkmark-foot">
                  <a href="/activityRecord" className="btn-to-Record">
                    查看報名紀錄
                  </a>
                  <a href="/" className="btn btn-primary btn-lg">
                    回首頁
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ActivitySignUp
