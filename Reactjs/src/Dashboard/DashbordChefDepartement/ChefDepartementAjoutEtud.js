import React,{ useState} from 'react'
import './Dashboard.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useContext} from "react";
import { RecoveryContextChef } from './ChefDepartement';
import { RecoveryContext } from '../../components/pages/FormLogin';



function ChefDepartementAjoutEtud () {

    const{setPage}=useContext(RecoveryContextChef);
    const{identifiant}=useContext(RecoveryContext);

    const[Nom,setNom]=useState("");
    const[Prenom,setPrenom]=useState("");
    const[Email,setEmail]=useState('');
    const[Departement,setDepartement]=useState('Informatique');
    const[Filiere,setFiliere]=useState('LGLSI');
    const[Niveau,setNiveau]=useState('3');

   

    function AjouterEnseingnant(){
        setPage("chefajouterenseignant")
    }

    function GererUsers() {
        setPage("chefgereruser")
    }

    function GererEnseignants() {
        setPage("chefgererenseignant")
    }

    function gobackdash(){
        setPage("dashbordChef")
    }

    function gotouserprofile() {
        setPage("userprofil")
    }


    const handleSubmit = async (event) => {
        event.preventDefault();


        try {
            const response = await axios.post(`http://127.0.0.1:8000/ChefDepart/AjouterEtudiant/${identifiant}`, {
                 
                Nom:Nom,
                Prenom:Prenom,
                Email:Email, 
                Departement:Departement,
                Filiere:Filiere,
                Niveau:Niveau

                }
               
            );

            if (response.data) {
                alert("Etudiant ajouté avec succés");

                setNom("");
                setPrenom("");
                setEmail("");
                setDepartement("");
                setFiliere("");
                setNiveau("");
            } 
                      
        }

        catch (error) {
             alert("L'etudiant existe déja, changer l'email et essayer de nouveau.");
             setEmail("");
             }
        };


  return (
    
    <div id='page-top'>
        <div id="wrapper">

        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion " id="accordionSidebar">

            <a className="sidebar-brand d-flex align-items-center justify-content-center " href="#" onClick={gobackdash}>
                <div className="sidebar-brand-icon rotate-n-15">
                    <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="sidebar-brand-text  ml-2">Pfe </div>
            </a>

            <hr className="sidebar-divider my-0"/>

            <li className="nav-item active">
                <a className="nav-link" href="#" onClick={gobackdash}>
                <i className="fas fa-user"></i>
                    <span> Mon espace</span></a>
            </li>

            <hr className="sidebar-divider"/>

            <div className="sidebar-heading">
               Bienvenue dans votre dashboard
            </div>

           
            <hr className="sidebar-divider"/>

            

            <div className="sidebar-heading  text-white">
                
                <i className="fas fa-plus"></i>
                <span className='ml-2 cursor-pointer'>Ajouter Etudiant</span>
            </div>
                
            <hr className="sidebar-divider d-none d-md-block"/>

            <div className="sidebar-heading text-white">
                
                <i className="fas fa-plus"></i>
                <span className='ml-2 cursor-pointer' onClick={AjouterEnseingnant}>Ajouter Enseignant</span>
            </div>

            

            <hr className="sidebar-divider d-none d-md-block"/>

            <div className="sidebar-heading  text-white">
                
            <i className="fas fa-users"></i>
                <span className='ml-2 cursor-pointer'onClick={GererUsers}>Gerer Etudiants</span>
            </div>

            <hr className="sidebar-divider d-none d-md-block"/>

            <div className="sidebar-heading  text-white">
                
            <i className="fas fa-users"></i>
                <span className='ml-2 cursor-pointer' onClick={GererEnseignants}>Gerer Enseignants</span>
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
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={gotouserprofile}>
                                
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

                <div  >

                <Form 
                    className='bg-white rounded border-0 p-3 ml-4 pr-5' 
                    style={{ width: '96%' }}
                    onSubmit={handleSubmit}
                >

                    <h4 className='text-bold font-bold font-medium mb-4'>Ajouter Etudiant </h4>

                    <Form.Group className="mb-2" controlId="formBasicEmail">
                        <Form.Label>Nom <span className='text-red-500'> *</span></Form.Label>
                        <Form.Control type="text"
                            required
                            autoFocus
                            placeholder="Enter le nom"
                            style={{ width: '98%' }}
                            value={Nom}
                            onChange={(e) => setNom(e.target.value)} 
                             />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Prénom <span className='text-red-500'> *</span></Form.Label>
                        <Form.Control type="text" 
                            placeholder="Enter le prénom" 
                            style={{ width: '98%' }}
                            required
                            value={Prenom}
                            onChange={(e) => setPrenom(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicEmail">
                        <Form.Label>Adresse Email <span className='text-red-500'> *</span></Form.Label>
                        <Form.Control type="email" 
                            placeholder="Enter email" 
                            style={{ width: '98%' }} 
                            value={Email}
                            required
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formBasicEmail">
                        <Form.Label>Niveau <span className='text-red-500'> *</span></Form.Label>
                        <Form.Select aria-label="Default select example" 
                        style={{ width: '98%' }}
                        value={Niveau}
                        required
                        onChange={(e) => setNiveau(e.target.value)}
                        >
                            <option value="3">3</option>
                            <option value="master">master</option>
                            
                        </Form.Select>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Filière <span className='text-red-500'> *</span></Form.Label>
                        <Form.Select
                            aria-label="Default select example"
                            style={{ width: '98%' }}
                            required
                            onChange={(e) => setFiliere(e.target.value)}
                            value={Filiere}
                        >
                            <option value="LGLSI">LGLSI</option>
                            <option value="LC">LC</option>
                            <option value="LPC">LPC</option>
                        </Form.Select>
                    </Form.Group>

                    <Button variant="primary" type='submit' className='mt-é'>Ajouter</Button>
                </Form>
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

export default ChefDepartementAjoutEtud;