import { createContext, useContext, useState } from 'react';
import ChefDepartementAjoutEsein from './ChefDepartementAjoutEsein';
import ChefDepartementAjoutEtud from './ChefDepartementAjoutEtud';
import ChefDepartementGereEnseignant from './ChefDepartementGereEnseignat';
import ChefDepartementGereUsers from './ChefDepartementGereUsers';
import DashboardChefDepartement from './DashboardChefDepartement';
import Utilisateurprofile from './userprofile';
import FormLogin from '../../components/pages/FormLogin';

export const RecoveryContextChef=createContext();

function ChefDepartement(){
   
    const[page,setPage]=useState("dashbordChef");  
    
    function NavigateComponents(){
        if(page === "dashbordChef") return <DashboardChefDepartement x />
        if(page === "chefajouteretud") return <ChefDepartementAjoutEtud />
        if(page === "chefajouterenseignant") return <ChefDepartementAjoutEsein />
        if(page === "chefgereruser") return <ChefDepartementGereUsers />
        if(page === "chefgererenseignant") return <ChefDepartementGereEnseignant />
        if(page === "userprofil") return <Utilisateurprofile />
        if(page === "logout") return <FormLogin />


        
        return <DashboardChefDepartement  /> }

    return(

        <div>

            <RecoveryContextChef.Provider
                value={{setPage}} >

                <NavigateComponents />

            </RecoveryContextChef.Provider> 

        </div>
    );
}

export default ChefDepartement;