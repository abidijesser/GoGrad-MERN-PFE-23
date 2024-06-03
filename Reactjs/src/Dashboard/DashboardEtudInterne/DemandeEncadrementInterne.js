import React, { Component } from 'react';
import './DemandeEcadrement.css'
import axios from 'axios';
import ReactModal from "react-modal";


class DemandeEncadrementInterne extends Component {
    constructor(props) {
      super(props);
      this.state = {
  
        
        selectedIdSujet:null,
        selectedSujet:null,
        selectedIdEncadrant:null,

        IdEt:2, 
        // (id du etudiant interne)

        isModalOpen: false,
        response:"",
  
  
        Encadrants: [
          { id: 1, Nom: "John", Prenom: "John2", Email:"jasserabidi00@gmail.com" },
          { id: 2, Nom: "Jane", Prenom: "jane2", Email:"jasserjane@gmail.com" },
          { id: 3, Nom: "Bob", Prenom: "bob2", Email:"jasserbob@gmail.com" },
          { id: 4, Nom: "Sara", Prenom: "sara2", Email:"jassersarra@gmail.com" },
        ],
  
        Sujets: [
          { id: 1, idE: 1, sujet:"here is the sujets by John 1" },
          { id: 2, idE: 1, sujet:"here is the sujets by John 2" },
          { id: 3, idE: 1, sujet:"here is the sujets by John 3" },
          
        ],
        
      };
  
      this.handleVoirClick = this.handleVoirClick.bind(this);
      this.handleCloseModal = this.handleCloseModal.bind(this);
      this.DemanderEncadrement = this.DemanderEncadrement.bind(this);
      this.handleSelectSujet = this.handleSelectSujet.bind(this);
      
      
    }

    // async componentDidMount() {
    //     try {
    //         const response = await axios.get('https://your-backend-api-url/Encadrant', 
    //              {
    //                 IdEt
    //             },

    //             {
    //                 headers: {
    //                     'X-Requested-With': 'XMLHttpRequest',
    //                     "content-type": "application/json",
    //                     "Access-Control-Allow-Origin": "http://localhost:5000",
    //                     "Access-control-request-methods": "POST, GET, DELETE, PUT, PATCH, COPY, HEAD, OPTIONS"},
   //                      "withCredentials": true 
    //             }
    
    //         );

    //         const EncadrantData = response.data;
    //         this.setState({ Encadrants: EncadrantData });
    //    } 

    //    catch (error) {
    //         alert("An error occurred. Please try again later.");
    //     }
    // }




    handleCloseModal() {
      this.setState({ 

        isModalOpen: false,
        selectedIdSujet: null,
        selectedSujet: null,
        selectedIdEncadrant: null       

       });
    }

  
    async handleVoirClick(id) {

      this.setState({ 
        selectedIdEncadrant: id
      })
      try {
        const response = await axios.get(
          'https://your-backend-api-url/demandeencadrant',
            {
              id: id
            },

            {
              headers: {
              'X-Requested-With': 'XMLHttpRequest', 
              "content-type":"application/json", 
              "Access-Control-Allow-Origin": "http://localhost:5000", 
              "Access-control-request-methods":"POST, GET, DELETE, PUT, PATCH, COPY, HEAD, OPTIONS"}, 
              "withCredentials": true 
            }
        );

        console.log('Request sent successfully');
        console.log(response.data);

        const SujetsEncadrant = response.data;
        this.setState({ Encadrants: SujetsEncadrant });
     
      } 


      catch (error) {
        console.error(error);
           alert("An error occurred. Please try again.");         
      }

      this.setState({isModalOpen: true})

      // const selectedEncadrant = this.state.Encadrants.find(encadrant => encadrant.id === id);
      // this.setState({ id: id});     
    }


    handleSelectSujet = (sujet) => {
      this.setState({ 

        selectedSujet: sujet,
        selectedIdSujet: sujet.id

      });
    };


    async DemanderEncadrement(){

      const { selectedIdSujet, selectedIdEncadrant } = this.state;

      // extrait les valeurs des propriétés selectedIdSujet et selectedIdEncadrant de lobjet state
      //  Cela permet de créer des variables locales avec les mêmes noms que ces propriétés et dy
      //  assigner les valeurs correspondantes.
      try {
        const response = await axios.post(
          'https://your-backend-api-url/demandeencadrant',
            {
              id: selectedIdEncadrant,
              idsujet: selectedIdSujet
            },

            {
              headers: {
              'X-Requested-With': 'XMLHttpRequest', 
              "content-type":"application/json", 
              "Access-Control-Allow-Origin": "http://localhost:5000", 
              "Access-control-request-methods":"POST, GET, DELETE, PUT, PATCH, COPY, HEAD, OPTIONS"}, 
              "withCredentials": true 
            }
        );

        console.log('Request sent successfully');
        console.log(response.data)

        if (response.data.success) {

          alert("Demnade envoyée avec succés");
          
        } 
      
        else {

          alert("erreur, try again later");
        }
        
      } 
      
      catch (error) {
        console.error(error);
           alert("An error occurred. Please try again.");         
      }
      
    }


  
    render() {

      const { selectedSujet } = this.state;
      const isDisabled = this.state.response === "pas encore";

      return (
          
        <div className=' ml-50 bg-gray-100 pl-5 mt-32  pt-1  container'>

          <h3 className='mt-4 mb-4 font-medium '>Liste des Encadrants :</h3>
          <ul >
              {this.state.Encadrants.map((encadrant) => (
                  <li key={encadrant.id}>
  
                      <label >
                          {encadrant.Nom} {encadrant.Prenom} 
                      </label>
  
                      <button className='ml-40 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded mb-5'                      
                      onClick={() =>{   

                          const result = window.confirm("Voulez-vous envoyer un email a: " +encadrant.Nom+" " +encadrant.Prenom+ "?");

                          if(result){
                              window.open(`mailto:${encadrant.Email}`, '_blank')}

                          }}>
                          Contacter
                      </button>
  
                      <button 

                          className='ml-5 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded mb-5' 
                          onClick={() => this.handleVoirClick(encadrant.id)} >                          
                          Voir sujets

                      </button>

                      <ReactModal
                        isOpen={this.state.isModalOpen}
                        onRequestClose={this.handleCloseModal}
                        contentLabel="Example Modal"
                        className= ""
                        style={{
                          content: {
                            width: "500px",
                            height: "300px",
                            color: "black",
                            margin: "auto",
                           
                          }
                        }}
                      >

                        <div>
                        <h2 className='mt-2'>Choisissez un sujet :</h2>

                        <ul>
                        
                        {this.state.Sujets.map((sujet) => (
                          <li key={sujet.id} className="mr-2" >

                            <label >

                              <input
                                type="radio"
                                name="sujet"
                                value={sujet.id}
                                checked={selectedSujet && selectedSujet.id === sujet.id}
                                onChange={() => this.handleSelectSujet(sujet)}
                              />
   
                              <span className='ml-2'>{sujet.sujet}</span>
                            </label>
                            </li>
                        ))}
                      
                      </ul>
                        <button onClick={this.handleCloseModal}
                        
                        style={{ 
                          position: "absolute", 
                          top: "1px", 
                          right: "10px", 
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "20px",
                          color:"red",
                        }}>
                        x

                        </button>

                        <button 

                          className=' block w-40 mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded mb-5 '
                          disabled={isDisabled}
                          onClick={this.DemanderEncadrement}>
                          Demander

                        </button>
                      </div>
                    </ReactModal>
  
                  </li>
              ))}
          </ul>
  
        </div>
        
      );
    }
  }
  
  export default DemandeEncadrementInterne;
  