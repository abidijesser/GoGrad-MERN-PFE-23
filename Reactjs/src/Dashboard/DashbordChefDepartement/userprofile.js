import React, { useState, useEffect } from 'react';
import profileimage from './undraw_profile.svg';
import axios from 'axios';
import background from './background.jpg';
import Form from 'react-bootstrap/Form';
import { Modal, Ripple, initTE } from "tw-elements";
initTE({ Modal, Ripple });

function Utilisateurprofile() {

  const[Nom, setNom]=useState("");
  const[Prenom, setPrenom]=useState("");
  const[Email, setEmail]=useState("");
  const[Motdepasseactual, setMotdepasseactual]=useState("");
  const[Motdepasse, setMotdepasse]=useState("");
  const[ConfirmMotdepasse, setConfirmMotdepasse]=useState("");

  const[Userdata, setUserdata]=useState([
    {EtudiantID: "gghg", Nom:"ahmed", Prenom: "abidi", Email:"jasserabidi00@gmail.com", filiere:"LGLSI", 
    Etablissementacceuil:"Faculté des sciences de Monastir", Stage:"Plate-forme de gestion des projets de fin d'etudes a distance",
    Description:"c'est une plate-forme web mobile qui va permettre aux differentes parties pernantes de surmonter les defis liés a la coordination et a la tracabilié tout en favorisant l'echange de connaissances et en renforcant les liens entre l'acdemie et l'industrie.",
     },
  ])


  function handleReset() {
    setNom("");
    setPrenom("");
    setEmail("");
    setMotdepasseactual("");
    setMotdepasse("");
    setConfirmMotdepasse("");
  }

  useEffect(() => {
        
    const fetchUserData = async () => {
      try {
        const response = await axios.patch('http://127.0.0.1:8001/Etudiant/GetEnseignants/DUc43QVh'); 
        const ListeEncadrants = response.data;
        setUserdata(ListeEncadrants);
      } catch (error) {
        console.error('Erreur lors de la récupération de vos données:', error);
      }
    };
    
    fetchUserData();
    
  }, []); 


  const handleSubmit = async (event) => {
    event.preventDefault();

    if(Motdepasse === ConfirmMotdepasse){

        try {
            const response = await axios.patch(`http://127.0.0.1:8002/Etudiant/Modifiedata/${Userdata[0]?.EtudiantID}`, {
                
                Nom:Nom,
                Prenom:Prenom,
                Email:Email, 
                Motdepasseactual:Motdepasseactual,
                Motdepasse:Motdepasse,
                ConfirmMotdepasse:ConfirmMotdepasse

                }             
            );

            console.log(response.data);

            if (response.data) {
                setNom("");
                setPrenom("");
                setEmail("");
                setMotdepasseactual("");
                setMotdepasse("");
                setConfirmMotdepasse("");
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
    }  
    else{
      alert("Mot de passe incompatible.")
    }  
};



  return (
    <div>
      <section className=" " >
        <div  >
        <img alt="..." src={background} style={{ width: '1500px', height:"600px"}}  />
          <span id="blackOverlay" className="w-full h-full absolute  bg-"></span>
        </div>
        <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px" style={{ transform: 'translateZ(0px)' }}>
          <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
            <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
      </section>
      <section className="relative py-16 bg-">
        <div className="container mx-auto px-4" style={{ width: '98%' }}>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64" >
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    <img alt="..." src={profileimage} style={{ width: '150px'}}  />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    <button 
                      className="-ml-10 text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" 
                      type="button" 
                      style={{ backgroundColor: '#5666AF', letterSpacing: '1px' }}
                      data-te-toggle="modal"
                      data-te-target="#exampleModalScrollable"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      
                      >
                      Modifier 
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
                                                     
                                                     <h4 className='pt-2'>Modifier vos données </h4>   
                                                    

                                                    <button
                                                    type="button"
                                                    className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                                    data-te-modal-dismiss
                                                    aria-label="Close"
                                                    onClick={handleReset}
                                                    >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 hover:bg-gray-200">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    </button>
                                                </div>
                                                <div className="relative overflow-y-auto p-4">  

                                                <Form onSubmit={handleSubmit} >
                                                                             
                                                <Form.Group className="mb-3" controlId="formBasicEmail">

                                                    <Form.Label style={{ marginRight: '97%' }}>Nom </Form.Label>
                                                    <Form.Control type="text"
                                                        autoFocus
                                                        placeholder="Modifer votre nom"
                                                        style={{ width: '100%' }}
                                                        value={Nom}
                                                        onChange={(e) => setNom(e.target.value)}
                                                    />

                                                </Form.Group>                                                            

                                                <Form.Group className="mb-3" controlId="formBasicEmail">    

                                                    <Form.Label style={{ marginRight: '400px' }}>Prénom </Form.Label>
                                                    <Form.Control type="text"
                                                        value={Prenom}
                                                        onChange={(e) => setPrenom(e.target.value)}       
                                                        placeholder="Modifer votre prenom"
                                                        style={{ width: '100%' }}
                                                        
                                                        />
                                                        
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label style={{ marginRight: '420px' }}>Email  </Form.Label> 
                                                    <Form.Control type="email" 
                                                        placeholder="Modifer votre email" 
                                                        style={{ width: '100%' }}     
                                                        value={Email}
                                                        onChange={(e) => setEmail(e.target.value)}     
                                                                                                         
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-2" controlId="formBasicEmail">
                                                    <Form.Label style={{ marginRight: '297px' }}>Mot de passe actuel</Form.Label>
                                                    <Form.Control type="password" 
                                                        placeholder="Modifer votre mot de passe" 
                                                        style={{ width: '100%' }}                                                       
                                                        value={Motdepasseactual}
                                                        onChange={(e) => setMotdepasseactual(e.target.value)}                                                   
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-2" controlId="formBasicEmail">
                                                    <Form.Label style={{ marginRight: '275px' }}>Nouveau Mot de passe </Form.Label>
                                                    <Form.Control type="password" 
                                                        placeholder="Modifer votre mot de passe" 
                                                        style={{ width: '100%' }}                                                       
                                                        value={Motdepasse}
                                                        onChange={(e) => setMotdepasse(e.target.value)}                                                   
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-2" controlId="formBasicEmail">
                                                    <Form.Label style={{ marginRight: '267px' }}>Confirmer mot de passe </Form.Label>
                                                    <Form.Control type="password" 
                                                        placeholder="Confirmer votre mot de passe" 
                                                        style={{ width: '100%' }}                                                       
                                                        value={ConfirmMotdepasse}
                                                        onChange={(e) => setConfirmMotdepasse(e.target.value)}                                                   
                                                    />
                                                </Form.Group>
                                                
                                                    
                                                
                                                <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 pt-3 dark:border-opacity-50 ">
                                                    <button
                                                    type="button"
                                                    className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                                                    data-te-modal-dismiss
                                                    data-te-ripple-init
                                                    data-te-ripple-color="light"
                                                    onClick={handleReset}
                                                    >
                                                    Close    
                                                    </button>

                                                    <button
                                                    
                                                    className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium  leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                                    data-te-ripple-color="light"
                                                    type='submit'
                                                    
                                                    style={{ backgroundColor: '#5666AF', letterSpacing: '1px' }}
                                                    >
                                                    Enregistrer
                                                    </button>
                                                    

                                                </div>
                                                
                                                </Form>
                                                </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                  </div>


                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-white">22</span><span className="text-sm text-white">Friends</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-white">10</span><span className="text-sm text-white">Photos</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-white">89</span><span className="text-sm text-white">Comments</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-">
                <h3 className="text-4xl font-semibold leading-normal  text-blueGray-700">
                {Userdata[0]?.Prenom} {Userdata[0]?.Nom}
                </h3>

                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400  " style={{ letterSpacing: '0.5px' }}>
                  <i className="fas fa-envelope mr-2 text-lg text-blueGray-400"></i>
                  {Userdata[0]?.Email} 
                </div>

                <div className="text-sm leading-normal mt-10 mb-2 text-blueGray-400 ">
                  <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                  Faculté des sciences de Monastir
                </div>

                <div className="mb-6 text-blueGray-600 mt-6">
                  <i className="fas fa-user-graduate mr-2 text-lg text-blueGray-400"></i>Etudiant en {Userdata[0]?.filiere}
                </div>

                <div className="mb-2 text-blueGray-600">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{Userdata[0]?.Etablissementacceuil}
                </div>

              </div>
              <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-1 text-lg leading-relaxed text-blueGray-700 ml-10">
                      <span className="font-semibold">Stage : </span> {Userdata[0]?.Stage}
                    </p>
                    <p className="mb text-lg leading-relaxed text-blueGray-700 ml-10">
                      <span className="font-semibold">Description :</span> c'est une plate-forme web mobile qui va permettre aux differentes parties pernantes de surmonter les defis liés a la coordination et a la tracabilié tout en favorisant l'echange de connaissances et en renforcant les liens entre l'acdemie et l'industrie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      </section>
      </div>
    
  );
}

export default Utilisateurprofile;
