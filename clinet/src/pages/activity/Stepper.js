import React from 'react'
import 'react-step-progress-bar/styles.css'
import { ProgressBar, Step } from 'react-step-progress-bar'

function Stepper(props) {
  return (
    <>
      <ProgressBar
        percent={((props.step - 1) * 100) / 2}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
      >
        <Step transition="scale">
          {({ accomplished, page }) => (
            <div className={`step ${accomplished ? 'completed' : ''}`}>
              <div className="stepper-number">1</div>
              <div className="stepper-text">確認活動</div>
            </div>
          )}
        </Step>
        {/* <div>確認活動</div> */}
        <Step transition="scale">
          {({ accomplished, page }) => (
            <div className={`step ${accomplished ? 'completed' : ''}`}>
              <div className="stepper-number">2</div>
              <div className="stepper-text">填寫資料</div>
            </div>
          )}
        </Step>
        {/* <div>填寫資料</div> */}
        <Step transition="scale">
          {({ accomplished, page }) => (
            <div className={`step ${accomplished ? 'completed' : ''}`}>
              <div className="stepper-number">3</div>
              <div className="stepper-text">完成</div>
            </div>
          )}
        </Step>
        {/* <div>報名成功</div> */}
      </ProgressBar>
    </>
  )
}

export default Stepper
