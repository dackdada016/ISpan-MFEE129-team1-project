import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
function CourseSearch() {
  const [courseName, setCourseName] = useState('')
  const [isFilterActive, setIsFilterActive] = useState('')
  const [isTimeFilterActive, setIsTimeFilterActive] = useState('')
  const [courses, setCourses] = useState([])
  const { typeID } = useParams()
  useEffect(() => {
    fetch(`http://localhost:3002/product/list-product/${typeID}`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((error) => console.log(error))
  }, [courseName, typeID])

  const trainingCourses = () => {
    fetch(`http://localhost:3002/product/list-product/${typeID}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data)
        const train = data.filter((item) => item.product_class === '寵物訓練')
        setCourses(train)
      })
      .catch((error) => console.log(error))
  }
  const interactiveCourses = () => {
    fetch(`http://localhost:3002/product/list-product/${typeID}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data)
        const interact = data.filter(
          (item) => item.product_class === '寵物互動'
        )
        setCourses(interact)
      })
      .catch((error) => console.log(error))
  }
  const petKnowledges = () => {
    fetch(`http://localhost:3002/product/list-product/${typeID}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data)
        const knowledge = data.filter(
          (item) => item.product_class === '寵物知識'
        )
        setCourses(knowledge)
      })
      .catch((error) => console.log(error))
  }
  const takeCarePets = () => {
    fetch(`http://localhost:3002/product/list-product/${typeID}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data)
        const care = data.filter((item) => item.product_class === '寵物照顧')
        setCourses(care)
      })
      .catch((error) => console.log(error))
  }
  const findOneCourse = () => {
    if (courseName !== '') {
      let text = courseName
      let regex = new RegExp(`.*${text}.*`, 'i')
      const data = courses.filter((item) => item.product_name.match(regex))
      setCourses(data)
    } else {
      return
    }
  }
  const ascTimeSort = () => {
    let regex = /\d/gi
    //從單位字串中先篩選數字出來，去掉第一個不用的數字，接著把字元串在一起，轉成數值資料後再比較大小作排序
    const data = courses.sort(
      (a, b) =>
        parseInt(
          a.product_unit
            .match(regex)
            .slice(1)
            .reduce((a, b) => a + b)
        ) -
        parseInt(
          b.product_unit
            .match(regex)
            .slice(1)
            .reduce((a, b) => a + b)
        )
    )
    setCourses(data)
  }
  const dscTimeSort = () => {
    let regex = /\d/gi
    const data = courses.sort(
      (a, b) =>
        parseInt(
          b.product_unit
            .match(regex)
            .slice(1)
            .reduce((a, b) => a + b)
        ) -
        parseInt(
          a.product_unit
            .match(regex)
            .slice(1)
            .reduce((a, b) => a + b)
        )
    )
    setCourses(data)
  }
  const showPriceFilterButton = () => {
    if (isFilterActive === '') setIsFilterActive(' active')
    else setIsFilterActive('')
  }
  const showTimeFilterButton = () => {
    if (isTimeFilterActive === '') setIsTimeFilterActive(' active')
    else setIsTimeFilterActive('')
  }
  const ascendPriceOrder = () => {
    //如果前面的價格比較大，那就會移到後面
    const asc = courses.sort(
      (a, b) => parseInt(a.product_price) - parseInt(b.product_price)
    )
    setCourses(asc)
  }
  const descendPriceOrder = () => {
    //如果後面的價格比較大，那就會移到前面
    const desc = courses.sort(
      (a, b) => parseInt(b.product_price) - parseInt(a.product_price)
    )
    setCourses(desc)
  }

  return (
    <>
      <div className="course-container">
        <div className="upper-part">
          <div className="searchbar">
            <input
              type="search"
              id="search"
              onChange={(e) => {
                setCourseName(e.target.value)
              }}
              placeholder="搜尋"
            />
            <button id="search-button" onClick={findOneCourse}>
              &#128269;
            </button>
          </div>
          <div className="filter-buttons">
            <button
              className={`time-filter${isTimeFilterActive}`}
              onClick={showTimeFilterButton}
            >
              以時數排序:
              <div className="time-button-wrapper">
                <button id="time-ascend-order" onClick={ascTimeSort}>
                  由低至高
                </button>
                <button id="time-descend-order" onClick={dscTimeSort}>
                  由高至低
                </button>
              </div>
            </button>
            <button
              className={`price-filter${isFilterActive}`}
              onClick={showPriceFilterButton}
            >
              以價格排序:
              <div className="price-button-wrapper">
                <button id="price-ascend-order" onClick={ascendPriceOrder}>
                  由低至高
                </button>
                <button id="price-descend-order" onClick={descendPriceOrder}>
                  由高至低
                </button>
              </div>
            </button>
          </div>
          <span className="course-search-tags">
            <button className="course-search-tag" onClick={trainingCourses}>
              寵物訓練
            </button>

            <button className="course-search-tag" onClick={interactiveCourses}>
              寵物互動
            </button>

            <button className="course-search-tag" onClick={petKnowledges}>
              寵物知識
            </button>

            <button className="course-search-tag" onClick={takeCarePets}>
              寵物照顧
            </button>
          </span>
        </div>
        <section className="course-search-results">
          {courses.map((item, i) => {
            return (
              <div className="course-product-card" key={i}>
                <section className="text-part">
                  <h2 className="title">{item.product_name}</h2>
                  <span className="text-unit">{item.product_unit}</span>
                  <p className="description">{item.product_descripttion}</p>
                  <span className="price">$.{item.product_price}</span>
                </section>
                <section className="buttons">
                  <button className="button-collection">&#9825;</button>
                  <Link to={`/CourseDetail/${item.product_id}`}>
                    <button className="button-moreInfo">看更多</button>
                  </Link>
                </section>
                {/* 圖片動態引入 ，圖片須放在public資料夾*/}
                <img
                  src={`http://localhost:3002/uploads/${item.product_image}`}
                  alt=""
                />
                {/* <img src={photo} alt="" /> */}
              </div>
            )
          })}
        </section>
      </div>
    </>
  )
}

export default CourseSearch
