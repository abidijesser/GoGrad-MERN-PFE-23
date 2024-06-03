import { createContext, useState } from 'react';
import DashboardEnseignant from './DashboardEnseignant';
import EnseignantAjoutStage from './EnseignantAjoutStage';
import MesEtudiants from './EnseignantMesEtudiants';
import EnseignantStages from './EnseignantStages';
import FormLogin from '../../components/pages/FormLogin';
export const RecoveryContextEnseignant=createContext();

function Enseignant(){

    const[page,setPage]=useState("dashbordEnseignant");

    function NavigateComponents(){
        if(page === "dashbordEnseignant") return <DashboardEnseignant/>
        if(page === "ajouterstage") return <EnseignantAjoutStage/>
        if(page === "messtages") return <EnseignantStages/>
        if(page === "mesetudiants") return <MesEtudiants/>
        if(page === "deconnexion") return <FormLogin/>
        
        return <DashboardEnseignant /> }

    return(

        <div>

            <RecoveryContextEnseignant.Provider
                value={{page, setPage}} >

                <NavigateComponents />

            </RecoveryContextEnseignant.Provider> 

        </div>
    );
}

export default Enseignant;