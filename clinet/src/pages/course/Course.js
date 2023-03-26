import dog from '../../img/course/dog.jpg'
import child from '../../img/course/child.jpg'
import corgi from '../../img/course/corgi.jpg'
import dogAndBoy from '../../img/course/dog-and-boy.jpg'
import { Link } from 'react-router-dom'

function Course() {
  return (
    <>
      <div className="course-container">
        <Link to="/courseSearch/2">
          <button className="course-enter-search-tag">進入課程搜尋</button>
        </Link>

        <section className="photos">
          <div className="big-photo-one">
            <img src={dog} alt="dog" />
          </div>
          <div className="small-photo-one">
            <img src={dogAndBoy} alt="dogAndBoy" />
          </div>
          <div className="small-photo-two">
            <img src={child} alt="child" />
          </div>
          <div className="big-photo-two">
            <img src={corgi} alt="corgi" />
          </div>
        </section>
      </div>
    </>
  )
}
export default Course
