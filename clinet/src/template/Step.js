import React from 'react'

function Step(props) {
  const { step } = props;
  return (
    <aside className="order-step-guide col-10">
      <div className="row d-flex">
        <div className="step_group col-2">
          <div className={`step1 ${step >= 1 ? 'stepState' : ''}`}>1</div>
          <div className="steptext">確認商品</div>
        </div>
        {/* <div className="stepline"></div> */}
        <div className={`stepline ${step >= 2 ? 'lineState' : ''}`} />
        <div className="step_group col-2">
          <div className={`step2 ${step >= 2 ? 'stepState' : ''}`}>2</div>
          <div className="steptext">填寫資料</div>
        </div>
        {/* <div className="stepline"></div> */}
        <div className={`stepline ${step >= 3 ? 'lineState' : ''}`} />
        <div className="step_group col-2">
          <div className={`step3 ${step >= 3 ? 'stepState' : ''}`}>3</div>
          <div className="steptext">訂購成功</div>
        </div>
      </div>
    </aside>
  )
}

export default Step
