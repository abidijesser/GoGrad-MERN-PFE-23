import React, { useContext, useState, useEffect} from 'react'
import './Dashboard.css'
import { RecoveryContextEnseignant } from './Enseignant';
import { RecoveryContext } from '../../components/pages/FormLogin';
import Form from 'react-bootstrap/Form';

import axios from 'axios';


function EnseignantStages() {

    const {setPage}=useContext(RecoveryContextEnseignant);
    const {identifiant}=useContext(RecoveryContext);

    const[Titre, setTitre]=useState("");
    const[Description, setDescription]=useState("");
    const[Technologie, setTechnologie]=useState("");

    const[identifiantStage, setidentifstage]=useState("");
    

    function gotoAjoutStage(){
        setPage("ajouterstage")
    }

    function gotoMesEtudiants(){
        setPage("mesetudiants")
    }

    function backtodash(){
        setPage("dashbordEnseignant")
    }

    function sedeconnecter() {
        setPage("deconnexion")
    }


    const [Stages, setStages] = useState([]);

    const [Stagevide, setStagevide] = useState([
        {StageID: "0", Titre: "Pas encore", Technologie: "Pas encore", Description: "Pas encore"}
    ]);

    function handlereset( ){

        setidentifstage("");
        
        setTitre("");
        setDescription("");
        setTechnologie("");      

    }

    function handlechange(stageident ){

        setidentifstage(stageident);
        
    }


    useEffect(() => {
        // Fetch user data from the server
        const fetchEnseignantStages = async () => {
          try {
            const response = await axios.get( `http://127.0.0.1:8000/Enseignant/GetStagesbyEnseignantID/${identifiant}` ); 

            console.log(response.data);
            if (Array.isArray(response.data) && response.data.length > 0) {
                const stageData = response.data;
                setStages(stageData);
            } 
    
            else {              
                setStages(Stagevide);
            }
          } 
          
          catch (error) {
            console.error('Error fetching user data:', error);
          }

        };
        
        fetchEnseignantStages();
        
    }, []); 
    // Empty dependency array to run the effect only once when the component mounts

    const DeleteStage = async (stageid, stagetitre) => {

        const result = window.confirm(` Voulez-vous supprimer le stage: ${stagetitre} `);
        if(result){
            if( stageid !== 0){
                try {    

                    const response = await axios.delete(`http://127.0.0.1:8000/ChefDepart/SupprimerEnseignant/${identifiant}/Enseignant/${stageid}` );

                    
                    if (response.status) {
                        alert(`Le stage ${stagetitre} est supprimé avec succès`)
                    } 

                    else {
                        alert(`Erreur lors de la suppression du stage: ${stagetitre} `);
                    }
                } 
            
                catch (error) {
                alert(`Erreur lors de la suppression du stage: ${stagetitre}`);          
                }
            }
        else{
            alert("Vous pouvez pas supprimer ce stage")
        }
    }
     
      };

    const handleSubmit = async (event) => {
        event.preventDefault();

            try {
                const response = await axios.patch(`http://127.0.0.1:8000/ChefDepart/UpdateEnseignantByID/${identifiant}/${identifiantStage}`, {
                                            
                        
                }             
                );

                if (response.data) {
                                      
                                    
                    } 

                }

            catch (error) {
                    
                alert("An error occurred. Please try again.222");
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
                <div className="sidebar-brand-text  ml-2">Pfe </div>
            </a>

            <hr className="sidebar-divider my-0"/>

            <li className="nav-item active">
                <a className="nav-link" href="#" onClick={backtodash}>
                <i className="fas fa-user"></i>
                    <span> Mon espace</span></a>
            </li>

            <hr className="sidebar-divider"/>

            <div className="sidebar-heading">
               Bienvenue dans votre dashboard  
            </div>

           
            <hr className="sidebar-divider"/>

            <div className="sidebar-heading text-white">               
                    
                <span className='ml-2 cursor-pointer'  > Mes Stages</span>
            </div>

            <hr className="sidebar-divider"/>

            <div className="sidebar-heading text-white">               
                
                <span className='ml-2 cursor-pointer' onClick={gotoMesEtudiants} > Mes Etudiants</span>
            </div>

            <hr className="sidebar-divider"/>
                
            <div className="sidebar-heading text-white">               
                <i className="fas fa-plus"></i>
                <span className='ml-2 cursor-pointer' onClick={gotoAjoutStage} >Ajouter Stage</span>
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
                                        <div className="small text-gray-500">Avril 12, 2023</div>
                                        <span >Une nouvelle tâche a été ajouter par votre
                                         encadrant profissionel.</span>
                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="mr-3">
                                        <div className="icon-circle bg-success">
                                        <i className="fas fa-check-square white-icon "></i>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="small text-gray-500">Avril 7, 2023</div>

                                        <span >La tâche " Gestion de profil " est validée par votre encadrant universitaire . </span>

                                    </div>
                                </a>
                                <a className="dropdown-item d-flex align-items-center" href="#">
                                    <div className="mr-3">
                                        <div className="icon-circle bg-danger">
                                        <i className="fas fa-clock white-icon"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="small text-gray-500">Mai 1, 2023</div>
                                        Nous tenions a vous rappeler que la date d'echeance de la tâche  
                                        <span > Diagramme De Sequence </span> est 
                                        <span className='text-red-600'> 2/5/2023 .</span> 
                                    </div>
                                </a>
                                <a className="dropdown-item text-center small text-gray-500" href="#">Afficher toutes les alertes</a>
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
                                <a className="dropdown-item text-center small text-gray-500" href="#">Lire plus de messages</a>
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
                                <a className="dropdown-item" href="#">
                                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Profil
                                </a>
                                <a className="dropdown-item" href="#">
                                    <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Paramètres
                                </a>
                                <a className="dropdown-item" href="#">
                                    <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Journal d'activité
                                </a>
                                <div className="dropdown-divider"></div>
                                <a className="dropdown-item" href="" data-toggle="modal" data-target="#logoutModal">
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Déconnexion
                                </a>
                            </div>
                        </li>

                    </ul>

                </nav>

                <div className='bg-white rounded ml-3'
                style={{ width: '97%', height:'85%', border: '2px solid #E7E7E7' }}>
                    <div className="row p-3 m-0 bg-white rounded ml-3 mt-3" >

                        <h3 className='mb-4'>Mes Stages</h3>
                   
                    <table className='ml-4 mt-2' class="table table-bordered " >

                        <thead>
                            <tr class="table-primary">
                                <th className="pr-10">Titre </th>
                                <th className="pr-10">Technologies </th>
                                <th className="pr-10">Description </th>
                                
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {Stages.map((stage) => (
                            
                                <tr  key={stage.id}  >
                                    <td className='cursor-pointer' style={{width:'300px'}}>{stage.Titre}</td>
                                    <td className='cursor-pointer' style={{width:'300px'}}>{stage.Technologie}</td>
                                    <td className='cursor-pointer' style={{width:'300px'}}>{stage.Description}</td>
                                
                                    <td>

                                    <div>

                                        <button 
                                            style={{width:'30px', height:'30px'}} 
                                            className=" hover:bg-blue-100  rounded ml-2  "
                                            data-te-toggle="modal"
                                            data-te-target="#exampleModalScrollable"
                                            data-te-ripple-init
                                            data-te-ripple-color="light" 
                                            onAuxClick={() => handlechange(stage.StageID)}
                                            >
                                            <i className="fas fa-pen text-blue-500 "></i> 
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
                                                <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4  dark:border-opacity-50">
                                                     
                                                     <h4>Modifier  </h4>     
                                                    

                                                    <button
                                                    type="button"
                                                    className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                                    data-te-modal-dismiss
                                                    aria-label="Close"
                                                    onClick={handlereset}
                                                    >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 hover:bg-gray-200">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    </button>
                                                </div>

                                                <Form onSubmit={handleSubmit} >
                                                <div className="relative overflow-y-auto p-4">
                               
                                                <Form.Group className="mb-3" controlId="formBasicEmail">

                                                    <div style={{ display: 'flex', alignItems: 'center' }}>

                                                        <div style={{ marginRight: '10px' }}>
                                                            <Form.Label className='text-left mr-44'>Nom </Form.Label>
                                                            <Form.Control type="text"
                                                                autoFocus
                                                                placeholder="Modifer le nom"
                                                                style={{ width: '99%' }}
                                                                 />
                                                        </div>

                                                        <div className='ml-2'>
                                                            <Form.Label className='text-left mr-44'>Prenom </Form.Label>
                                                            <Form.Control type="text"
                                                               
                                                                placeholder="Modifer le prenom"
                                                                style={{ width: '96%' }}
                                                                />
                                                        </div>
                                                    </div>

                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label style={{ marginRight: '350px' }}>Adresse Email </Form.Label> 
                                                    <Form.Control type="email" 
                                                        placeholder="Modifer email" 
                                                        style={{ width: '100%' }}          
                                                                                                          
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-2" controlId="formBasicEmail">
                                                    <Form.Label style={{ marginRight: '375px' }}>Téléphone </Form.Label>
                                                    <Form.Control type="number" 
                                                        placeholder="Modifer téléphone" 
                                                        style={{ width: '100%' }}                                                       
                                                                                                           
                                                    />
                                                </Form.Group>
                                                
                                                    
                                                </div>
                                                <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                                    <button
                                                    type="button"
                                                    className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                                                    data-te-modal-dismiss
                                                    data-te-ripple-init
                                                    data-te-ripple-color="light"
                                                    onClick={handlereset}
                                                    >
                                                    Close    
                                                    </button>

                                                    <button
                                                    
                                                    className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                                    data-te-ripple-init
                                                    data-te-ripple-color="light"
                                                    type='submit'
                                                    
                                                    >
                                                    Modifer
                                                    </button>
                                                    

                                                </div>
                                                
                                                </Form>
                                                </div>
                                                
                                            </div>
                                        </div>

                                        <button 
                                        style={{width:'30px', height:'30px'}} 
                                        className="hover:bg-red-100  rounded ml-2 "
                                        onClick={()=> DeleteStage(stage.StageId, stage.Titre)}>

                                        <i className="fas fa-trash text-red-500"></i>
                                        </button>

                                    </div>       

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
                    <h5 className="modal-title" id="exampleModalLabel">Prêt à partir?</h5>
                    <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">Sélectionnez "Déconnexion" ci-dessous si vous êtes prêt 
                à mettre fin à votre session en cours.</div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" type="button" data-dismiss="modal">Annuler</button>
                    <a className="btn btn-primary" href="#" onClick={sedeconnecter}>Déconnexion</a>
                </div>
            </div>
        </div>
    </div>

    


    </div>
  );
}

export default EnseignantStages;