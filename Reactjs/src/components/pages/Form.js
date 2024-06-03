import { useContext, useState, createContext} from "react";
import axios from 'axios';
import { RecoveryContext } from "./FormLogin";
import MySpinner from "./Myspinner";
import DashboardChefDepartement from "../../Dashboard/DashbordChefDepartement/DashboardChefDepartement";

export const RecoveryContextUSERID=createContext();


function Form() {                               

    const[MotDePasse, setMotdepasse] = useState('');
    const[showSpinner, setShowSpinner] = useState(false);   
    const{setPage, Email, setEmail, setIdentifiant}=useContext(RecoveryContext);

    function gotochef() {
        setPage("DashboardChef");
    }
    
    
    const navigateToOublier = async(event) => {

        setPage("validationcode");
        // event.preventDefault();
        
        // if(Email){   
            

        //     try {
        //         const response =await axios.post('http://127.0.0.1:8000/demandeReinitialisationMotDePasse', { 
        //             Email:Email }
        //         );
    

        //         if (response.data) {
        //             alert("Code de validation envoyé avec succés");
        //             setPage("validationcode");   
        //         } 
                
        //         else {
        //             alert("Échec de la connexion. Veuillez vérifier votre e-mail ou votre mot de passe.");
        //         }
                
        //     } 

        //     catch (error) {
        //         console.error(error);
        //         alert("Une erreur se produit. Veuillez réessayer plus tard.");
        //     }
        // }
            
        
        // else {
        //     alert("veuillez entrer votre email puis appuyez sur mot de passe oublié")}
        };



    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowSpinner(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/Connexion', { 
                Email:Email, 
                MotDePasse: MotDePasse }
                 
            );

            console.log(response.data);

            if (response.status) {
                
                alert("Login successful!");
                const { status, token, expiresIn } = response.data;

                const userID = status.split(' ')[1];
                console.log(userID);
                setIdentifiant(userID)

                const userType = status.split(' ')[0];
                console.log(userType);


                if(userType === "ChefDepart"){
                    gotochef();
                    
                }

                else if (userType === "Etudiant"){
                    setPage("Interne")
                }

                else{
                    setPage("Enseignant");
                }
                
            } 
            
            else {
             alert("Échec de la connexion. Veuillez vérifier votre e-mail ou votre mot de passe.");
            }
        }

        catch (error) {
             console.error(error);
             alert("Une erreur se produit. Veuillez réessayer.");
        }

        setShowSpinner(false);

    };
   
    
        return(    

            <div>
            

            <div className="bg-white px-11 py-20 rounded-3xl border-2 ">
                <h1 className="text-5xl font-semibold ">Bienvenue !</h1>
                <p className="font-medium text-lg text-gray-700 mt-3">Veuillez saisir vos coordonnées.</p>

                <form onSubmit={handleSubmit}>

                <div className="mt-8 ">

                    <div>
                        
                        <label htmlFor="email" className="text-lg font-medium ">Email</label>
                        <input id="email" value={Email}
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full border-2 border-gray-200 rounded-xl p-2 mt-1 bg-gray-100 "
                        placeholder="Entrer votre email"
                        autoFocus
                        required
                        type="email"/>
                        
                    </div>

                    <div>

                        <label htmlFor="motdepasse" className="text-lg font-medium"  >Mot de passe</label>
                        <input id="motdepasse" name="motdepasse1" value={MotDePasse} 
                        onChange={(e) => setMotdepasse(e.target.value)} 
                        className="w-full border-2 border-gray-200 rounded-xl p-2 mt-1 bg-gray-100"
                        placeholder="Entrer votre mot de passe"
                        required
                        type="password"
                        minLength="8" />
                        
                    </div>

                    <div className="mt-1.5 ">
                        
                        <a
                            href="#"
                            onClick={navigateToOublier}
                            className="text-blue-900 font-medium text-base no-underline hover:no-underline" >
                            Mot de passe oublié
                            
                        </a>

                    </div>

                    <div className="mt-8 flex flex-col gap-y-4">
                        <button type="submit" className=" active:scale-[.99] active:duration-100 hover:scale[1.01] ease-in-out transition-all  py-2 bg-blue-900 text-white text-lg font-bold rounded-xl " >Se connecter</button> 
                    </div>           
              
                </div>
              </form>
            </div>  
            

            

            </div>
         
        );
    }


export default Form;

