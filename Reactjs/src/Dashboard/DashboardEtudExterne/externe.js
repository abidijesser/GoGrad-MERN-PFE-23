import { createContext, useState } from 'react';
import DashbordEtudExterne from './DashboardEtudExterne';
import DemandeEncadrementExterne from './DemandeEncadrementExterne';
export const RecoveryEtudExterne=createContext();

function Externe(){

    const[page,setPage]=useState("dashbordExterne");

    function NavigateComponents(){
        if(page === "dashbordExterne") return <DashbordEtudExterne />
        if(page === "demandeEncadExterne") return <DemandeEncadrementExterne />
        
        return <DashbordEtudExterne /> }

    return(

        <div>

            <RecoveryEtudExterne.Provider
                value={{page, setPage}} >

                <NavigateComponents />

            </RecoveryEtudExterne.Provider> 

        </div>
    );
}

export default Externe;