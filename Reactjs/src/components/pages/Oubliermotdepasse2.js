import React from 'react';
import './Oubliermotdepasse222.css'
import { useContext, useState } from 'react';
import axios from 'axios';
import { RecoveryContext } from './FormLogin';

const OTPForm = () => {

    const {setPage, Email, setotpcode} = useContext(RecoveryContext);

    const [otpValues, setOtpValues] = useState(['', '', '', '']);

    const [timerCount, setTimer] = useState(120);
    const [disable, setDisable] = useState(true);




    const handleOtpInputChange = (index, value) => {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const codeValidation = otpValues.join('');
        setotpcode(codeValidation);

        try {
            const response = await axios.post(`http://127.0.0.1:8000/verifierCodeValidation`, {
              codeValidation : codeValidation,
            })

            console.log(codeValidation);

            if (response.data) {
                alert("Code de validation correct");        
                setPage("reset")        
            } 
                      
        }

        catch (error) {
            
            alert("Code de validation incorrect, vérifiez à nouveau.");
        }
    };

    function resendvalidationcode(){
      
      if(disable) return;
      axios.post('http://localhost:3000/api/resendvalidationcode',{
      Email},
      
      )

      .then(() => setDisable(true))
      .then(() => alert("A new OTP has succesfully been sent to your email."))
      .then(() => setTimer(120))
      .catch(console.log);
  };


    React.useEffect(() => {
        let interval = setInterval(() => {
          setTimer((lastTimerCount) => {
            lastTimerCount <= 1 && clearInterval(interval);
            if (lastTimerCount <= 1) setDisable(false);
            if (lastTimerCount <= 0) return lastTimerCount;
            return lastTimerCount - 1;
          });
        }, 1000); //each count lasts for a second
      //cleanup the interval on complete
        return () => clearInterval(interval);
    }, [disable]);


  return (
    
    <div className="container">

    <form className="otp-Form" onSubmit={handleSubmit}>

      <span className="mainHeading">Code de validation</span>
      <p className="otpSubheading">Nous avons envoyé un code de vérification à votre email : </p>
      <p className="otpSubheading">{Email}</p>
      <div className="inputContainer">

        <input required maxLength="1" type="text" className="otp-input" id="otp-input1" 
            value={otpValues[0]}
            onChange={(e) => handleOtpInputChange(0, e.target.value)}/>

        <input required maxLength="1" type="text" className="otp-input" id="otp-input2" 
            value={otpValues[1]}
            onChange={(e) => handleOtpInputChange(1, e.target.value)}/>

        <input required maxLength="1" type="text" className="otp-input" id="otp-input3" 
            value={otpValues[2]}
            onChange={(e) => handleOtpInputChange(2, e.target.value)}/>

        <input required maxLength="1" type="text" className="otp-input" id="otp-input4" 
            value={otpValues[3]}
            onChange={(e) => handleOtpInputChange(3, e.target.value)}/> 

      </div>

      <button className="verifyButton" type="submit" >Vérifier</button>
      
      <div className="resendContainer">
        <p className="resendNote mt-1 ">Vous n'avez pas reçu le code?</p>{" "}

        <button 

            className="resendBtn flex flex-row items-center"
            style={{
                color: disable ? "gray" : "blue",
                cursor: disable ? "none" : "pointer",
                fontSize: disable ? "0.8em" : "1em" ,
                textDecorationLine: disable ? "none" : "underline",
              }}
              onClick={() => resendvalidationcode()}
            >
             {disable ? `Renvoyer dans ${timerCount}s` : "Renvoyer"}

        </button>

      </div>

    </form>

    </div>
  );
};

export default OTPForm;
