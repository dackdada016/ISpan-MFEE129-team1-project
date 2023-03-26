import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons'

function HeaderSearch(props) {
  const [search, setSearch] = useState('')
  const [filteredProduct, setFilteredProduct] = useState(props.product)
  const navigate = useNavigate()
  const handleFilter = (product_class) => {
    const filteredProducts = props.product.filter(
      (p) => p.product_class === product_class
    )

    setFilteredProduct(filteredProducts)
    props.onFilter(filteredProducts)
  }

  const productButtons = [
    ...props.product.reduce(
      (types, p) =>
        types.includes(p.product_class) ? types : [...types, p.product_class],
      []
    ),
  ].slice(0, 4)

  return (
    <>
      <div className="main-button">
        <div className="button__list">
          {productButtons.map((product_class, index) => (
            <button
              key={index}
              className={productButtons.includes(product_class) ? 'button ' : ''}
              onClick={() => handleFilter(product_class)}
            >
              {product_class}
            </button>
          ))}
          <button className='button '
            onClick={() => {
              props.handleClear()
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
    </>
  )
}

export default HeaderSearch
