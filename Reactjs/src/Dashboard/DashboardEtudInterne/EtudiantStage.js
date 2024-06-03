import React, { useState, useEffect } from 'react'
import './Dashboard.css'
import { useContext} from "react";
import { RecoveryContextEtudiant } from './interne';
import { RecoveryContext } from '../../components/pages/FormLogin';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Modal, Ripple, initTE } from "tw-elements";
initTE({ Modal, Ripple });



function EtudiantGereStage () {


    const[Titre,setTitre]=useState('');
    const[Description,setDescription]=useState('');
    const[Technologie,setTechnologie]=useState('');
    const[Etablissement,setEtablissement]=useState('');

    const[STAGEID,setSTAGEID]=useState('');
    const[STAGETITRE, setSTAGETITRE]=useState('');


    function handlechange(stageid, stagetitre){

        setSTAGEID(stageid);
        setSTAGETITRE(stagetitre);       
    }


    function handlereset( ){

        setSTAGEID("");
        setSTAGETITRE("");
           
        setDescription("");
        setTitre("");
        setTechnologie("");
        setEtablissement("")

    }


    const [Stage, setStage] = useState
        ([
              
        ]);


    const [Stagevide, setStagevide] = useState([
        {Titre: "Pas encore", Description: "Pas encore",Technologie: "Pas encore",Societe: "Pas encore",EncadrantProEmail: "Pas encore"}
    ]);

      

    const {setPage}=useContext(RecoveryContextEtudiant);
    const {identifiant}=useContext(RecoveryContext);

    function goToDeposerStage(){
        setPage("DeposerStageEtud")
    };

    function gootoDemandeEncadrement() {
        setPage("DemandeEncadrement")
    };

    function toUserprofile() {
        setPage("userprofile");
    };

    function backtodash(){
        setPage("dashbordInterne");
    }


    useEffect(() => {
        
        const fetchEtudiantStage = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/Etudiant/getStage/${identifiant}`) 
            console.log(response.data)

                const EtudiantStage = response.data;
                setStage([EtudiantStage]);

          } 
          
        catch (error) {
            console.error(error);
                if (error.response && error.response.data && error.response.data.error) {
                  const errorMessage = error.response.data.error;
                  alert(errorMessage);
                  setStage(Stagevide);
                }
          }
        };
        
        fetchEtudiantStage();
        
    }, []); 


    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(STAGEID);

        try {
            const response = await axios.patch(`http://127.0.0.1:8001/Etudiant/ModifieStage/aiIDKRN6/${STAGEID}`, {
                 
                Titre:Titre,
                Description:Description,
                Technologie:Technologie, 
                Etablissement:Etablissement
                
                }             
            );

            console.log(response.data);

            if (response.data) {
                setDescription("");
                setTitre("");
                setTechnologie("");
                setEtablissement("")
                alert("Données modifiées avec succés");                                
            } 
            
            else {
             alert("An error occurred. Please try again.111");
            }

        }

        catch (error) {
             console.error(error);
             alert("An error occurred. Please try again.222");
        }
    };



    



    const DeleteStage = async (stageid, stagetitre) => {

        console.log(stageid);
        const result = window.confirm(` Voulez-vous supprimer votre stage : ${stagetitre} `);
        if(result){
            try {    

                const response = await axios.delete(`http://127.0.0.1:8001/ChefDepart/SupprimerEnseignant/q8jw9LRI/Enseignant/${stageid}` );

                   
                if (response.status) {
                    alert(`${stagetitre}  est supprimé avec succès`)
                } 

                else {
                    alert(`Erreur lors de la suppression de ${stagetitre}`);
                  }
            } 
            
            catch (error) {
            alert(`Erreur lors de la suppression de ${stagetitre}`);          
            }
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
                <div className="sidebar-brand-text ">Pfe </div>
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
                <span className='ml-2 cursor-pointer' onClick={goToDeposerStage}>Deposer Stage</span>
            </div>

            <hr className="sidebar-divider"/>

            <div className="sidebar-heading text-white">
                
                <i className="fas fa-briefcase"></i>
                <span className='ml-2 cursor-pointer' >Mon Stage</span>
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

                    <a
                        className='text-gray-800 hover:bg-gray-100 py-4 px-4 font-bold no-underline hover:no-underline'
                        href='#'
                        onClick={gootoDemandeEncadrement}
                        >
                        Encadrant                   
                    </a>

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
                                <a className="dropdown-item" href="#" onClick={toUserprofile}>
                                    <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Profile
                                </a>
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

                    <h4 className='text-bold font-bold font-medium mb-4'>Mon stage</h4>
                    <table class="table-bordered table  ">

                        <thead class="table-primary">
                            <tr>

                                <th className="pr-10 ">Titre </th>
                                <th>Description</th>
                                <th>Technologies</th>
                                <th>Etablissement d'acceuil</th>
                                <th>Email d'encadrant professional</th>                               
                                <th></th>

                            </tr>
                        </thead>

                        <tbody>

                            {Stage.map((stage) => (
                            
                                <tr  key={stage.id}  >
                                    <td style={{ width: 'auto' }} >{stage.Titre} </td>
                                    <td style={{ width: 'auto' }} >{stage.Description}</td>
                                    <td style={{ width: 'auto' }} >{stage.Technologie}</td>
                                    <td style={{ width: 'auto' }} >{stage.Societe}</td>
                                    <td style={{ width: 'auto' }} >{stage.EncadrantProEmail}</td>
                                    <td className='text-center' style={{ width: 'auto' }}  > 

                                        <div className=' d-flex align-items-center justify-content-center'>
                                        <button 
                                            type="button"
                                            style={{width:'30px', height:'30px'}} 
                                            className="hover:bg-blue-100  rounded mr-3"
                                            data-te-toggle="modal"
                                            data-te-target="#exampleModalScrollable"
                                            data-te-ripple-init
                                            data-te-ripple-color="light" 
                                            onClick={() => handlechange(stage.StageID, stage.Titre, )}
                                            >
                                            <i className="fas fa-pen text-blue-500"></i>  
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
                                                     
                                                     <h4>Modifier Stage :</h4>  
                                                    

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

                                                    <Form.Label style={{ marginRight: '98%' }}>Titre </Form.Label>
                                                    <Form.Control type="text"
                                                        autoFocus
                                                        placeholder="Modifer le Titre"
                                                        style={{ width: '100%' }}
                                                        value={Titre}
                                                        onChange={(e) => setTitre(e.target.value)}
                                                    />

                                                </Form.Group>                                                            

                                                <Form.Group className="mb-3" controlId="formBasicEmail">    

                                                    <Form.Label style={{ marginRight: '369px' }}>Description </Form.Label>
                                                    <Form.Control type="text"
                                                               
                                                        placeholder="Modifer la Description"
                                                        style={{ width: '100%' }}
                                                        value={Description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        />
                                                        
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label style={{ marginRight: '359px' }}>Technologies  </Form.Label> 
                                                    <Form.Control type="text" 
                                                        placeholder="Modifer les Technologies" 
                                                        style={{ width: '100%' }}          
                                                        value={Technologie}
                                                        onChange={(e) => setTechnologie(e.target.value)}                                                    
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-2" controlId="formBasicEmail">
                                                    <Form.Label style={{ marginRight: '353px' }}>Etablissement </Form.Label>
                                                    <Form.Control type="text" 
                                                        placeholder="Modifer l'tablissement d'acceuil" 
                                                        style={{ width: '100%' }}                                                       
                                                        value={Etablissement}
                                                        onChange={(e) => setEtablissement(e.target.value)}                                                    
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

                                        <button style={{width:'30px', height:'30px'}} className="hover:bg-red-100  rounded"
                                        onClick={() => DeleteStage(Stage.StageID, Stage.Titre)}
                                        >
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

export default EtudiantGereStage;