import { createContext, useState } from 'react';
import DashbordEtudInterne from './DashboardEtudInterne';
import DemandeEncadrement from './DemandeEncadrement';
import DeposerStageEtud from './DeposerStageEtudiant';
import EtudiantGereStage from './EtudiantStage';
import Userprofile from './userprofile';
import FormLogin from '../../components/pages/FormLogin';

export const RecoveryContextEtudiant=createContext();

function Interne(){

    const[page,setPage]=useState("dashbordInterne");

    function NavigateComponents(){
        if(page === "dashbordInterne") return <DashbordEtudInterne />
        if(page === "DemandeEncadrement") return <DemandeEncadrement />
        if(page === "DeposerStageEtud") return <DeposerStageEtud />
        if(page === "EtudiantGereStage") return <EtudiantGereStage />
        if(page === "userprofile") return <Userprofile />
        if(page === "logout") return <FormLogin />

        
        return <DashbordEtudInterne /> }

    return(

        <div>

            <RecoveryContextEtudiant.Provider
                value={{page, setPage}} >

                <NavigateComponents />

            </RecoveryContextEtudiant.Provider> 

        </div>
    );
}

export default Interne;