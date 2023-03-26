import React, { createContext, useState } from 'react'

export const ModalContext = createContext()

const ModalContextProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClose = () => setIsModalOpen(false)
  const handleShow = () => setIsModalOpen(true)
  // const closeModal = () => {
  //   setIsModalOpen(false)
  // }
  return (
    <ModalContext.Provider
      value={{ isModalOpen, setIsModalOpen, handleClose, handleShow }}
    >
      {children}
    </ModalContext.Provider>
  )
}
export default ModalContextProvider
