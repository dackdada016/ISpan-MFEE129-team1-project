import React, { useState, useEffect, useContext, createContext } from 'react'
import { Link, useNavigate, Outlet } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark,
  faCartShopping,
  faAnglesLeft,
} from '@fortawesome/free-solid-svg-icons'
import Ball from '../img/layout/毬.svg' //圖片
import Menu from './Menu'
import AbilityTrain from './AbilityTrain'
import { Cart, SquareAccounts } from '../template'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import CartContextProvider, { CartContext } from './CartContext'
import ModalContextProvider, { ModalContext } from './ModalContext'

function MainLayouts() {

  const [isShowMenu, setIsShowMenu] = useState(false)

  const navigate = useNavigate()
  const { isModalOpen, setIsModalOpen, handleClose, handleShow } =
    useContext(ModalContext)
  const handleCheckoutClick = () => {
    setIsModalOpen(false)
    navigate('/CheckoutFlow')
  }
  return (
    <ModalContextProvider>
      <CartContextProvider>
        <div className="wrap">
          <nav
            className={`nav-mobile navbar ${isShowMenu ? 'active-menu' : ''}`}
          >
            <div className="logo-member">
              <button
                class="navbar-toggler"
                type="button"
                onClick={() => {
                  setIsShowMenu(!isShowMenu)
                }}
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <Link to="/">
                <img src={Ball} alt="logo" />
              </Link>
              <Button className="btn-outline-cart" onClick={handleShow}>
                <FontAwesomeIcon icon={faCartShopping} />
              </Button>
            </div>
            <Menu />
          </nav>
          {/* PC的nav */}
          <nav className="nav">
            <Link to="/">
              <img src={Ball} alt="logo" />
            </Link>
            <Menu />

            <Button className="btn-outline-cart" onClick={handleShow}>

              <FontAwesomeIcon icon={faCartShopping} />
            </Button>
          </nav>
          <main className="content-border">
            <div className="content">
              <Outlet />
              <Modal
                show={isModalOpen}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                className='modal'
              >
                <Modal.Header>
                  <Modal.Title>購物車</Modal.Title>
                  <Button variant="secondary" onClick={handleClose}>
                    <FontAwesomeIcon icon={faXmark} />
                  </Button>
                </Modal.Header>
                <Cart />
                <div className="aside d-flex justify-content-center p-2">
                  <SquareAccounts
                    onClick={handleCheckoutClick}
                    className="more_color"
                  />
                </div>
              </Modal>
            </div>
          </main>
        </div>
      </CartContextProvider>
    </ModalContextProvider>
  )
}

export default MainLayouts
