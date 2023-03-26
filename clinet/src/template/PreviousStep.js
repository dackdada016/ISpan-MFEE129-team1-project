import React from 'react'

function PreviousStep(props) {
  return (
    <button
      type="button"
      className="btn btn-outline-primary btn-lg min-width-auto " onClick={props.onClick}
    >
      回上一步
    </button>
  )
}

export default PreviousStep
