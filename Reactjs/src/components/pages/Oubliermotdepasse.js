import axios from "axios";
import React, {  useContext, useState } from "react";
// import { RecoveryContext } from "../../App";
// import { RecoveryContext } from "./Login";
import { RecoveryContext } from "./FormLogin";


function Oubliermotdepasse (){


    const {setPage, Email} = useContext(RecoveryContext);
    const [timerCount, setTimer] = React.useState(120);
    const [disable, setDisable] = useState(true);
    const [OTPinput, setOTPinput] = useState([0, 0, 0, 0]);
    const [validationCode, setvalidationCode ]=useState("");



    function navigateToReset() {

      setPage("reset");
      
      
         
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


    
    
    
    return(
            
        <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
          <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
            <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="font-semibold text-3xl">

                  <p>Verification par Email</p>

                </div>

              <div className="flex flex-row text-sm font-medium text-gray-400">

                <p>Nous avons envoyé un code à votre email: {Email}</p>
                

              </div>
          </div>

          <div>
            <form>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  <div className="w-16 h-16 ">
                    <input
                      maxLength="1"
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="tel"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          e.target.value,
                          OTPinput[1],
                          OTPinput[2],
                          OTPinput[3],
                        ])
                      }
                      
                    ></input>
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      maxLength="1"
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          e.target.value,
                          OTPinput[2],
                          OTPinput[3],
                        ])
                      }
                      
                    ></input>
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      maxLength="1"
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          OTPinput[1],
                          e.target.value,
                          OTPinput[3],
                        ])
                      }
                    
                    ></input>
                  </div>
                  <div className="w-16 h-16 ">
                    <input
                      maxLength="1"
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                      type="text"
                      name=""
                      id=""
                      onChange={(e) =>
                        setOTPinput([
                          OTPinput[0],
                          OTPinput[1],
                          OTPinput[2],
                          e.target.value,
                        ])
                      }
                      
                    ></input>
                  </div>
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <a
                    className="flex flex-row cursor-pointer items-center font-medium justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                    onClick={() => navigateToReset()}
                    >
                      Verifier
                    </a>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Vous n'avez pas reçu le code ?</p>{" "}
                    <a
                      className="flex flex-row items-center"
                      style={{
                        color: disable ? "gray" : "blue",
                        cursor: disable ? "none" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                      }}
                      onClick={() => resendvalidationcode()}
                      
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Renvoyer OTP"}
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
            
    
    
};

export default  Oubliermotdepasse;