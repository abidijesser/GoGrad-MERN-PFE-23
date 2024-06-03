import React from 'react'
import './Dashboard.css'
import { useContext} from "react";
import { RecoveryContextEnseignant } from './Enseignant';


function DashboardEnseignant() {

    const {setPage}=useContext(RecoveryContextEnseignant);

    function gotoAjoutStage(){
        setPage("ajouterstage")
    }

    function gotoMesStages(){
        setPage("messtages")
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
                
                <span className='ml-2 cursor-pointer' onClick={gotoMesStages} > Mes Stages</span>
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
                                <a className="dropdown-item" href="#">
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
                <div className="modal-body">Sélectionnez "Déconnexion" ci-dessous si vous êtes prêt à mettre fin à votre session en cours.</div>
               <input></input> 
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

export default DashboardEnseignant;