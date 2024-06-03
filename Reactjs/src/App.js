import './index.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Interne from './Dashboard/DashboardEtudInterne/interne';
import FormLogin from './components/pages/FormLogin';
import ChefDepartement from './Dashboard/DashbordChefDepartement/ChefDepartement';
import Enseignant from './Dashboard/DashboardEnseignant/Enseignant';
import MyTable from './Dashboard/DashbordChefDepartement/Sorttable';
import EnseignantDemandes from './Dashboard/DashboardEnseignant/EnseignantGereDemande';
import UserProfile from './components/pages/userprofile/UserProfile';
import MyTable2 from './Dashboard/DashbordChefDepartement/sortedtable2';
import Userprofile from './Dashboard/DashbordChefDepartement/userprofile';
import OTPForm from './components/pages/Oubliermotdepasse2';
import Home from './LandingPage/Home';
import Utilisateurprofile from './Dashboard/DashbordChefDepartement/userprofile';
// import Resetpassword from './components/pages/Resetpassword';



function App() {
    return (
        <div >
          <FormLogin />         
        </div>
    );
}

export default App;