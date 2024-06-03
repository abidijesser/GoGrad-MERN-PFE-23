import { createContext, useState } from 'react';
import Login from './Login';
import Resetpassword from './resetpassword';
import Home from '../../LandingPage/Home';
import DemandeEncadrementInterne from '../../Dashboard/DashboardEtudInterne/DemandeEncadrementInterne';
import ChefDepartement from '../../Dashboard/DashbordChefDepartement/ChefDepartement';
import Enseignant from '../../Dashboard/DashboardEnseignant/Enseignant';
import Interne from '../../Dashboard/DashboardEtudInterne/interne';
import Test234 from './Test22';
import OTPForm from './Oubliermotdepasse2';


export const RecoveryContext=createContext();
 // this function will allows us to manipulate the states in different components

function FormLogin() {

  const[page,setPage]=useState("Login");
  const[Email,setEmail]=useState('');
  const[identifiant, setIdentifiant]=useState("")
  const[validationcode,setValidationcode]=useState('');
  const[homepage,setHomepage]=useState('');
  const[otpcode, setotpcode]=useState('');
  

   
   

   function NavigateComponents(){
     if(page === "Login") return <Login />
     if(page === "validationcode") return <OTPForm/>
     if(page === "reset") return <Resetpassword />
     if(page === "homepage") return <Home />
     if(page === "demandeEncadrementInter") return <DemandeEncadrementInterne />
     if(page === "DashboardChef") return <ChefDepartement />
     if(page === "Enseignant") return <Enseignant />
     if(page === "Interne") return <Interne />
     if(page === "test234") return <Test234  />

     return <Login /> }
  

  return (
    <div >
        
        <RecoveryContext.Provider
          value={{page, setPage, validationcode, setValidationcode, homepage, Email, setEmail, identifiant, setIdentifiant, otpcode, setotpcode}} >

        <NavigateComponents />

        </RecoveryContext.Provider>  

        

    </div>
  );
}

export default FormLogin;