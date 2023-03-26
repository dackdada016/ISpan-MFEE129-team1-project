import React from 'react'
import { GrFormPrevious, GrFormNext } from 'react-icons/gr'

function Paginationn({
  totalPosts,
  postsPerPage,
  setCurrentPage,
  currentPage,
  maxPageNumberLimit,
  minPageNumberLimit,
  setMaxPageNumberLimit,
  setMinPageNumberLimit,
  pageNumberLimit,
}) {
  let pages = []
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i)
  }

  const handleNextbtn = () => {
    setCurrentPage(currentPage + 1)

    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit)
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit)
    }
  }

  const handlePrevbtn = () => {
    setCurrentPage(currentPage - 1)

    if ((currentPage - 1) % maxPageNumberLimit === 5) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit)
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit)
    }
  }

  let pageIncrementBtn = null
  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn = <li onClick={handleNextbtn}> &hellip;</li>
  }
  let pageDecrementBtn = null
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = <li onClick={handlePrevbtn}>&hellip;</li>
  }

  return (
    <>
      <div className="pagination-bar">
        <li>
          <button
            className="page-btn-next"
            onClick={handlePrevbtn}
            disabled={currentPage === pages[0] ? true : false}
          >
            <GrFormPrevious />
          </button>
        </li>
        {pageDecrementBtn}
        {pages.map((page, index) => {
          if (page < maxPageNumberLimit + 1 && page > minPageNumberLimit) {
            return (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? 'active' : 'nothing'}
              >
                {page}
              </button>
            )
          } else {
            return null
          }
        })}
        {pageIncrementBtn}
        <li>
          <button
            className="page-btn-next"
            onClick={handleNextbtn}
            disabled={currentPage === pages[pages.length - 1] ? true : false}
          >
            <GrFormNext />
          </button>
        </li>
      </div>
    </>
  )
}

export default Paginationn
