import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import axios from 'axios';
import { useContext} from "react";
import { RecoveryContextEtudiant } from './interne';
import { RecoveryContext } from '../../components/pages/FormLogin';
import { Modal, Ripple, initTE } from "tw-elements";
initTE({ Modal, Ripple });


function DemandeEncadrement ()  {
    
    const [selectedIdEncadrant, setSelectedIdEncadrant] = useState(null);
   
    const [Encadrants, setEncadrants] = useState([
        { EnseignantID: 1, Nom: "Abidi", Prenom: "Kamel", Email:"jasserabidi00@gmail.com" },
        { EnseignantID: 2, Nom: "Youssef", Prenom: "Jihed", Email:"jasserjane@gmail.com" },
        { EnseignantID: 3, Nom: "Nasri", Prenom: "Marwa", Email:"jasserbob@gmail.com" },
        { EnseignantID: 4, Nom: "Amairi", Prenom: "Ons", Email:"jassersarra@gmail.com" },
        { EnseignantID: 4, Nom: "Belgacem", Prenom: "Samir", Email:"jassersarra@gmail.com" },
        { EnseignantID: 4, Nom: "Gafsi", Prenom: "Ahlem", Email:"jassersarra@gmail.com" },
    ]);


    const [Sujets, setSujets] = useState([
        { StageID: "0", Titre:"Pas encore " },
        
    ]);

    const [Sujetsvide, setSujetsvide] = useState([
        { StageID: "0", Titre:"pas encore" },
        
        
    ]);


    const {setPage}=useContext(RecoveryContextEtudiant);
    const {identifiant}=useContext(RecoveryContext);


    function toDeposerStage() {
        setPage("DeposerStageEtud")
    };

    function toMonStage() {
        setPage("EtudiantGereStage");
    };

    function toUserprofile() {
        setPage("userprofile");
    };

    function backtodash(){
        setPage("dashbordInterne");
    }


    useEffect(() => {
        
        const fetchEnseignantStages = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/Etudiant/GetEnseignants/${identifiant}`); 
            const ListeEncadrants = response.data;
            setEncadrants(ListeEncadrants);
          } catch (error) {
            console.error('Erreur lors de la récupération des enseignants:', error);
          }
        };
        
        fetchEnseignantStages();
        
    }, []); 
    // Empty dependency array to run the effect only once when the component mounts

    

    const VoirSujets = async (EnseignantID) => {

        try {
          
          setSelectedIdEncadrant(EnseignantID)
          
          const response = await axios.get(`http://127.0.0.1:8000/Etudiant/GetStagesByEnseignantID/${identifiant}/${EnseignantID}`);
      
          if (Array.isArray(response.data)) {
            const ListeSujets = response.data;
            setSujets(ListeSujets);
          } 

          else {
            
            setSujets(Sujetsvide);
          }

        } 
        
        catch (error) {
          alert('Erreur lors de la récupération des sujets:');
          setSujets(Sujetsvide);
        }
      };
      
    
    

    const handleDemander = async (StageId) => {

        if(StageId === '0') {
            alert("Vous ne pouvez pas choisir cet stage.")
        }
        else{
        const result = window.confirm(` Voulez-vous demander ce satge ? `);

        if(result){

            try {
            
                const response = await axios.post(`http://127.0.0.1:8000/Etudiant/DemanderStage/${identifiant}/from/${selectedIdEncadrant}/Stage/${StageId}`);

                if (response.status ) {
                    alert("Demande envoyé avec succés");
                    console.log(response.data);
                } 

            }
          
            catch (error) {
                alert("C'est interdit, vous avez déjà envoyé une demande dans les 72 heures dernieres!");
                
                
            }
        }

        else{
            alert('demande d\'encadrement annulée');
        }

    }};


    const DemandersansStage = async (enseignantid, enseignantnom, enseignantprenom) => {

        console.log(enseignantid)
        
        const result = window.confirm(` Voulez-vous solliciter l'encadrement de Mns/Mme? ${enseignantnom} ${enseignantprenom} `);

        if(result){

            try {
            
                const response = await axios.post(`http://127.0.0.1:8000/Etudiant/DemanderEncadrement/${identifiant}/${enseignantid}`);

                
                if (response.status ) {
                    alert("Demande envoyé avec succés");
                    console.log(response.data);
                } 

            }
          
            catch (error) {
                //console.error(error);         
                //if (error.response && error.response.data && error.response.data.message) {
                  //  const errorMessage = error.response.data.message;
                    //alert(errorMessage);
                    //console.log(errorMessage);

                //}
                alert("Vous devez deposer votre stage d'abord")
                
            }
        }

        else{
            alert('demande d\'encadrement annulée');
        }

    };



  return (
    
    <div id='page-top'>
        <div id="wrapper">

        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion " id="accordionSidebar">

            <a className="sidebar-brand d-flex align-items-center justify-content-center " href="#" onClick={backtodash}>
                <div className="sidebar-brand-icon rotate-n-15">
                <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="sidebar-brand-text">Pfe </div>
            </a>

            <hr className="sidebar-divider my-0"/>

            <li className="nav-item active">
                <a className="nav-link" href="#" onClick={backtodash}>
                <i className="fas fa-user"></i>
                    <span>Mon espace</span></a>
            </li>

            <hr className="sidebar-divider"/>

            <div className="sidebar-heading">
               Bienvenue dans votre dashboard
            </div>

            <hr className="sidebar-divider"/>

            <div className="sidebar-heading text-white">
                
                <i className="fas fa-plus"></i>
                <span className='ml-2 cursor-pointer' onClick={toDeposerStage}>Deposer Stage</span>
            </div>

            <hr className="sidebar-divider"/>

            <div className="sidebar-heading text-white">
                
                <i className="fas fa-briefcase"></i>
                <span className='ml-2 cursor-pointer' onClick={toMonStage}>Mon Stage</span>
            </div>

        </ul>
      
        <div id="content-wrapper" className="d-flex flex-column">

            <div id="content">

                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                    <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
                        <i className="fa fa-bars"></i>
                    </button>

                    <form
                        className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                        <div className="input-group">
                            <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..."
                                aria-label="Search" aria-describedby="basic-addon2"/>
                            <div className="input-group-append">
                                <button className="btn btn-primary" type="button">
                                    <i className="fas fa-search fa-sm"></i>
                                </button>
                            </div>
                        </div>
                    </form>    

                    <div>

                        <button
                            className='text-gray-800 hover:bg-gray-100 py-4 px-4 font-bold no-underline hover:no-underline cursor-pointer'>
                            Encadrant
                        </button>                                          
                    </div>

                    <ul className="navbar-nav ml-auto">

                        <li className="nav-item dropdown no-arrow d-sm-none">
                            <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-search fa-fw"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                                aria-labelledby="searchDropdown">
                                <form className="form-inline mr-auto w-100 navbar-search">
                                    <div className="input-group">
                                        <input type="text" className="form-control bg-light border-0 small"
                                            placeholder="Search for..." aria-label="Search"
                                            aria-describedby="basic-addon2"/>
                                        <div className="input-group-append">
                                            <button className="btn btn-primary" type="button">
                                                <i className="fas fa-search fa-sm"></i>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </li>

                        <li className="nav-item dropdown no-arrow mx-1">
                            <a className="nav-link dropdown-toggle" href="#" id="alertsDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-bell fa-fw"></i>
                                <span className="badge badge-primary badge-counter">3</span>
                            </a>
                            <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="alertsDropdown">
                                <h6 className="dropdown-header">
                                    Alerts Center
                                </h6>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="mr-3">
                                        <div className="icon-circle bg-primary">
                                            <i className="fas fa-file-alt text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="small text-gray-500">December 12, 2023</div>
                                        <span className="font-weight-bold">A new monthly report is ready to download!</span>
                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="mr-3">
                                        <div className="icon-circle bg-success">
                                            <i className="fas fa-donate text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="small text-gray-500">December 7, 2019</div>
                                        $290.29 has been deposited into your account!
                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="mr-3">
                                        <div className="icon-circle bg-warning">
                                            <i className="fas fa-exclamation-triangle text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="small text-gray-500">December 2, 2019</div>
                                        Spending Alert: We've noticed unusually high spending for your account.
                                    </div>
                                </a>
                                <a className="dropdown-item text-center small text-gray-500" href="#">Show All Alerts</a>
                            </div>
                        </li>

                        <li className="nav-item dropdown no-arrow mx-1">
                            <a className="nav-link dropdown-toggle" href="#" id="messagesDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fas fa-comment-alt fa-fw"></i>
                                <span className="badge badge-primary badge-counter">7</span>
                            </a>
                            <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="messagesDropdown">
                                <h6 className="dropdown-header">
                                    Message Center
                                </h6>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="dropdown-list-image mr-3">
                                        <img className="rounded-circle" src="img/undraw_profile_1.svg"
                                            alt="..."/>
                                        <div className="status-indicator bg-success"></div>
                                    </div>
                                    <div className="font-weight-bold">
                                        <div className="text-truncate">Hi there! I am wondering if you can help me with a
                                            problem I've been having.</div>
                                        <div className="small text-gray-500">Emily Fowler · 58m</div>
                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="dropdown-list-image mr-3">
                                        <img className="rounded-circle" src="img/undraw_profile_2.svg"
                                            alt="..."/>
                                        <div className="status-indicator"></div>
                                    </div>
                                    <div>
                                        <div className="text-truncate">I have the photos that you ordered last month, how
                                            would you like them sent to you?</div>
                                        <div className="small text-gray-500">Jae Chun · 1d</div>
                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="dropdown-list-image mr-3">
                                        <img className="rounded-circle" src="img/undraw_profile_3.svg"
                                            alt="..."/>
                                        <div className="status-indicator bg-warning"></div>
                                    </div>
                                    <div>
                                        <div className="text-truncate">Last month's report looks great, I am very happy with
                                            the progress so far, keep up the good work!</div>
                                        <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="dropdown-list-image mr-3">
                                        <img className="rounded-circle" src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                                            alt="..."/>
                                        <div className="status-indicator bg-success"></div>
                                    </div>
                                    <div>
                                        <div className="text-truncate">Am I a good boy? The reason I ask is because someone
                                            told me that people say this to all dogs, even if they aren't good...</div>
                                        <div className="small text-gray-500">Chicken the Dog · 2w</div>
                                    </div>
                                </a>
                                <a className="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>
                            </div>
                        </li>

                        <div className="topbar-divider d-none d-sm-block"></div>

                        <li className="nav-item dropdown no-arrow">
                            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                
                                <img className="img-profile rounded-circle mr-3"
                                    src="img/undraw_profile.svg"/>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="userDropdown">
                                <boutton className="dropdown-item" onClick={toUserprofile}>
                                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Profile
                                </boutton>
                                <a className="dropdown-item" href="#">
                                    <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Settings
                                </a>
                                <a className="dropdown-item" href="#">
                                    <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Activity Log
                                </a>

                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="" data-toggle="modal" data-target="#logoutModal">
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Logout
                                </a>
                            </div>
                        </li>

                    </ul>

                </nav>

                <div className='bg-white rounded ml-3' 
                style={{ width: '97%', height:'85%', border: '2px solid #E7E7E7' }}>
                    <div className="row p-3 m-0 bg-white rounded ml-3" >
                    <h3 className='mb-4'>Liste des encadrants</h3>

                    <table  class="table-bordered table  ">

                        <thead class="table-primary" >
                            <tr className='bg-gray-200 ' >
                                <th className="pr-5">Nom </th>
                                <th>Prenom</th>
                                <th></th>
                                
                            </tr>
                        </thead>

                        <tbody  >

                            {Encadrants.map((encadrant) => (   

                                <tr  key={encadrant.id}  >
                                    
                                    <td style={{ width: '25%' }}>{encadrant.Prenom}</td>
                                    <td style={{ width: '25%' }}>{encadrant.Nom}</td>
                                    <td className='text-center'>           

                                    <button
                                        type="button"                             
                                        className=" inline-block rounded bg-gray-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-gray-600-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-gray-600-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-gray-600-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                        onClick={() => DemandersansStage(encadrant.EnseignantID, encadrant.Nom, encadrant.Prenom )}
                                        >
                                        Demander 
                                    </button>                        

                                    <button
                                        type="button"
                                        className=" inline-block rounded bg-primary ml-4 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                        data-te-toggle="modal"
                                        data-te-target="#exampleModalScrollable"
                                        data-te-ripple-init
                                        data-te-ripple-color="light" 
                                        onClick={() => VoirSujets(encadrant.EnseignantID)}                                          
                                        >
                                        Voir Sujets  
                                    </button>

                                            <div
                                            data-te-modal-init
                                            className="fixed left-0 top-11 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                                            id="exampleModalScrollable"
                                            tabIndex="-1"
                                            aria-labelledby="exampleModalScrollableLabel"
                                            aria-hidden="true"
                                            >
                                            <div
                                                data-te-modal-dialog-ref
                                                className="pointer-events-none relative h-[calc(100%-1rem)] w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:h-[calc(100%-3.5rem)] min-[576px]:max-w-[500px]"
                                            >
                                                <div className="pointer-events-auto relative flex max-h-[100%] w-full flex-col overflow-hidden rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
                                                <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                                    <h4 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200" id="exampleModalScrollableLabel">
                                                    Choisissez un  sujet :
                                                    </h4>
                                                    <button
                                                    type="button"
                                                    className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                                    data-te-modal-dismiss
                                                    aria-label="Close"
                                                    >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                                        <path strokeLinecap="round"    strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    </button>
                                                </div>
                                                <div className="relative overflow-y-auto p-4">
                                                    
                                                    <table class='table '>
                                                        <tbody>
                                                            {Sujets.map((sujet) => (
                                                            <tr key={sujet.id}>

                                                                <td style={{ width: '280px' }} className="text-left"> {sujet.Titre} </td>

                                                                <td className='text-center'>
                                                                <button
                                                                    type="button"
                                                                    className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                                                    data-te-ripple-init
                                                                    data-te-ripple-color="light"
                                                                    onClick={() => handleDemander(sujet.StageID)}
                                                                    >
                                                                    Demander 
                                                                </button>
                                                                </td>
                                                            </tr>
                                                            ))}
                                                        </tbody>
                                                        </table>
                                                    
                                                </div>
                                                <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                                    <button
                                                    type="button" 
                                                    className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                                                    data-te-modal-dismiss
                                                    data-te-ripple-init
                                                    data-te-ripple-color="light"
                                                    >
                                                    Close        
                                                    </button>

                                                    {/* <button
                                                    type="button"
                                                    className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                                    data-te-ripple-init
                                                    data-te-ripple-color="light"
                                                    onClick={() => handleDemander()}
                                                    >
                                                    Envoyer
                                                    </button> */}

                                                </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            className=" ml-4 inline-block rounded bg-green-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-green-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-green-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"  
                                            onClick={() => {
                                            const result = window.confirm("Voulez-vous envoyer un email a: " +encadrant.Nom+" " +encadrant.Prenom+ "?");
                                            if (result) {
                                                window.open(`mailto:${encadrant.Email}`);
                                            }
                                            }}
                                            >
                                            Contacter
                                        </button>
                                
                                    </td>                                      
                                </tr>                                                                
                            ))}
                        </tbody>

                    </table>

                    </div>

                </div>
                    
        </div>

    </div>
    </div>
                        

    <a className="scroll-to-top rounded" href="#page-top">
        <i className="fas fa-angle-up"></i>
    </a>

   
    <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                    <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <a className="btn btn-primary" href="login.html">Logout</a>
                </div>
            </div>
        </div>
    </div>

    


    </div>
    
  );
}

export default DemandeEncadrement;