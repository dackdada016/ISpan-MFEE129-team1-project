import { Link, useNavigate } from 'react-router-dom'

import { QuantitySelector, SquareAccounts } from '../template'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faAnglesLeft,
  faXmark,
  faComment,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons'

function AbilityTrain() {
  return (

    <div className="ability-train">
      <Link to="/login">
        <FontAwesomeIcon icon={faUser} />
      </Link>
      <a href="/startToChat">
        <FontAwesomeIcon icon={faComment} />
      </a>
    </div>
  )
}

export default AbilityTrain
