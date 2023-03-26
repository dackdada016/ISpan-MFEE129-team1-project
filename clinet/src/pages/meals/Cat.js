import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
function Cat() {
  const [courseName, setCourseName] = useState('')
  const [isFilterActive, setIsFilterActive] = useState('')
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
        const train = data.filter((item) => item.product_class === '風味餐點')
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
          (item) => item.product_class === '香醇飲品'
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
          (item) => item.product_class === '精緻甜點'
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
        const care = data.filter((item) => item.product_class === '寵物專區')
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
  const showPriceFilterButton = () => {
    if (isFilterActive === '') setIsFilterActive(' active')
    else setIsFilterActive('')
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
          <span className="course-search-tags">
            <button className="course-search-tag" onClick={trainingCourses}>
              風味餐點
            </button>

            <button className="course-search-tag" onClick={interactiveCourses}>
            香醇飲品
            </button>

            <button className="course-search-tag" onClick={petKnowledges}>
            精緻甜點
            </button>

            <button className="course-search-tag" onClick={takeCarePets}>
              寵物專區
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
                  <Link to={`/Food/${item.product_id}`}>
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

export default Cat
