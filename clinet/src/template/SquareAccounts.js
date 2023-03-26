import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from '../layouts/CartContext'
import { ModalContext } from '../layouts/ModalContext'

function SquareAccounts(props) {
  return (
    <button
      type="button"
      className="btn btn-primary btn-lg col-6 p-0 hover_style"
      onClick={props.onClick}
    >
      結帳
    </button>
  )
}

export default SquareAccounts
