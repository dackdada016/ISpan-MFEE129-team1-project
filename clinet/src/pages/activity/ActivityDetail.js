import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import DetailSignUp from '../../template/DetailSignUp'
import Header from '../../layouts/header'
import { AiFillFacebook } from 'react-icons/ai'
import { IoCalendarSharp } from 'react-icons/io5'
import { MdOutlinePets } from 'react-icons/md'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import BackToPrevious from '../../template/BackToPrevious'

function ActivityDetail() {
  const { activity_id } = useParams()
  const [activity, setActivity] = useState({})
  const [firstRender, setFirstRender] = useState(true)
  const navigate = useNavigate()

  console.log('activity', activity)

  useEffect(() => {
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

      console.log(activities)

      setFirstRender(false)
      setActivity({ ...activities })
    }
    fetchData()
  }, [activity_id])

  const now = new Date().getTime()
  const endDate = new Date(activity.activity_dateend).getTime()
  const expired = endDate > now

  console.log(activity)

  return (
    <>
      <BackToPrevious />
      {firstRender ? (
        false
      ) : (
        <div className="activity-container">
          <div className="container-box">
            <div className="activity-photo-wrapper"></div>

            <img
              className="activity-photo"
              src={`http://localhost:3002/uploads/${activity.activity_image[0]}/`}
              alt=""
            />

            <div className="activity-titlebox">
              <span className="activity-title">
                <MdOutlinePets />
                {activity.activity_name}
              </span>
            </div>
            <div className="activity-informationbox">
              <p className="activity-information">
                活動日期 :
                {new Date(activity.activity_datestart).toString('yyyy-MM-dd')}
              </p>
              <p className="activity-information">
                截止日期 :
                {new Date(activity.activity_dateend).toString('yyyy-MM-dd')}
              </p>
              <p className="activity-information">{activity.activity_time}</p>
              {activity.activity_pettype === 1 ? (
                <p className="activity-information">適合寵物類型 : 所有</p>
              ) : activity.activity_pettype === 2 ? (
                <p className="activity-information">適合寵物類型 : 狗狗</p>
              ) : (
                <p className="activity-information">適合寵物類型 : 貓貓</p>
              )}
              <p className="activity-information">
                地址 : {activity.activity_location}
              </p>
            </div>
            <div className="activity-content">
              <p className="content-h5">活動資訊</p>
              <p className="content-p">{activity.activity_decription}</p>
              <div className="activity-photo-wrapper">
                <img
                  className="activity-photo2"
                  src={`http://localhost:3002/uploads/${activity.activity_image[1]}/`}
                  alt=""
                />
              </div>
              <p className="content-h5">注意事項</p>
              <p className="content-p2">{activity.activity_notice}</p>
              <p className="content-p2">{activity.activity_notice2}</p>
            </div>
          </div>
          <div className="activity-text">
            <div className="activity-textbox">
              <p className="activity-textbox-text">{activity.activity_name}</p>
              <p className="activity-textbox-text">
                活動日期 :
                {new Date(activity.activity_datestart).toString('yyyy-MM-dd')}
              </p>
              <p className="activity-textbox-text">
                截止日期 :
                {new Date(activity.activity_dateend).toString('yyyy-MM-dd')}
              </p>
              {expired ? (
                <Link to={`/ActivitySignUp/${activity_id}`}>
                  <DetailSignUp className="btn-signup" />
                </Link>
              ) : (
                <div className="timeout">已結束</div>
              )}
              <div className="linkbox">
                <IoCalendarSharp
                  onClick={() => navigate(-1)}
                  className="calendaricon"
                />
                <AiFillFacebook
                  onClick={() => navigate(-1)}
                  className="facebookicon"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ActivityDetail
