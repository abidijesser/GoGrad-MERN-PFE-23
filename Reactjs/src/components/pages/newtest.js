import React from "react";
import './newtest2.css'

const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };


function Newtest() {

    
    return(

        <div>

<form className="otp-Form" onSubmit={handleSubmit}>
        <span className="mainHeading">Enter OTP</span>
        <p className="otpSubheading">We have sent a verification code to your mobile number</p>
        <div className="inputContainer">
          <input required maxLength="1" type="text" className="otp-input" id="otp-input1" />
          <input required maxLength="1" type="text" className="otp-input" id="otp-input2" />
          <input required maxLength="1" type="text" className="otp-input" id="otp-input3" />
          <input required maxLength="1" type="text" className="otp-input" id="otp-input4" />
        </div>
        <button className="verifyButton" type="submit">Verify</button>
        <button className="exitBtn">×</button>
        <p className="resendNote">
          Didn't receive the code? <button className="resendBtn">Resend Code</button>
        </p>
      </form>


        </div>

    );
}

export default Newtest;