import React, { Component } from 'react';
import './DemandeEcadrement.css'
import axios from 'axios';


class DemandeEncadrementExterne extends Component {
    constructor(props) {
      super(props);
      this.state = {
  
        Encadrants: [
          { id: 1, Nom: "John", Prenom: "John2", Email:"jasserjohn@gmail.com" },
          { id: 2, Nom: "Jane", Prenom: "jane2", Email:"jasserjane@gmail.com" },
          { id: 3, Nom: "Bob", Prenom: "bob2", Email:"jasserbob@gmail.com" },
          ],     
      };
  
      this.handleDemanderClick = this.handleDemanderClick.bind(this); 
      
    }

  
    async handleDemanderClick(id) {

      const selectedEncadrant = this.state.Encadrants.find(encadrant => encadrant.id === id);

      const selectedIdEncadrant = selectedEncadrant ? selectedEncadrant.id : null;
      this.setState({ selectedIdEncadrant });

      const selectedNomEncadrant = selectedEncadrant ? selectedEncadrant.Nom : null;
      this.setState({ selectedNomEncadrant });

      const selectedPrenomEncadrant = selectedEncadrant ? selectedEncadrant.Prenom : null;
      this.setState({ selectedPrenomEncadrant });


      
      const result = window.confirm("Voulez-vous envoyer une demande a: " +selectedNomEncadrant+" " +selectedPrenomEncadrant+ "?");

      if(result){
        // alert("Demande envoyé");
        try {
          const response = await axios.post(
            'https://your-backend-api-url/demandeencadrant',
              {
                id: selectedIdEncadrant
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

      else{
        alert("Demane annulée")
      }
      
    }


  //   async componentDidMount() {
  //     try {
  //         const response = await axios.get('https://your-backend-api-url/Encadrant', {
  //                 IdEt
  //             },

  //             {
                  

  //                 headers: {
  //                     'X-Requested-With': 'XMLHttpRequest',
  //                     "content-type": "application/json",
  //                     "Access-Control-Allow-Origin": "http://localhost:5000",
  //                     "Access-control-request-methods": "POST, GET, DELETE, PUT, PATCH, COPY, HEAD, OPTIONS"
  //                 },
  //                  "withCredentials": true
  //             }
  //         )

  //         const EncadrantData = response.data;
  //         this.setState({ Encadrants: EncadrantData });

  //     } catch (error) {
  //         alert("An error occurred. Please try again later.");
  //     }
  // }
    
   
  
    render() {

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
  
                      <button className='ml-40 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded mb-5' onClick={() =>{ 
  
                          const result = window.confirm("Voulez-vous envoyer un email a: " +encadrant.Nom+" " +encadrant.Prenom+ "?");
                          if(result){
                              window.open(`mailto:${encadrant.Email}`, '_blank')}
                          }}>
  
                          Contacter
                      </button>
  
                      <button 
                          className='ml-5 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded mb-5' 
                          onClick={() => this.handleDemanderClick(encadrant.id)}
                          >
                          Demander
                      </button>
  
                  </li>
              ))}

          </ul>
  
        </div>
        
      );
    }
  }
  
  export default DemandeEncadrementExterne;
  