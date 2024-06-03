import React, { Fragment } from "react";

import "./Home.css";
import research from "./pfe.png";
import myhome from "./home.png";
import cardOne from "./cardOne.png";
import cardTwo from "./cardTwo.png";
import card3 from "./card3.png";

const Home = () => {
  return (
    <Fragment>
       
      <main>
        <div
        
          className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75"
          style={{ paddingTop: "0rem" }}
        >
          
          <div className="absolute top-0 w-full  bg-center bg-cover customeColor" style={{height:"655px"}}>
            <span
              id="blackOverlay"
              className="absolute opacity-75 "
            ></span>
          </div>
          <div className="container relative ">
           
            <div className=" flex flex-wrap">
            
              <div className="col-lg-6 col-md-8 col-sm-12 ">
             
                <p className="ProverbeLandingPageStyle " >
                  
                  Stay ambitious, strong and achieve PFE greatness with our
                  plate-forme !
                </p>
              </div>
              <div className="col-lg-6 col-md-8 col-sm-12 ">
                <img src={research} style={{ width: "100%" }} alt="image" />
              </div>
            </div>
          </div>
        </div>

        <div className=" mb-4 sagesse">
          <p className="text-center m notreConseil">
            {" "}
            Rejoignez la révolution de la gestion{" "}
          </p>
          <p className="text-center  notreConseil">
            {" "}
            de vos projets de fin d’étude avec{" "}
          </p>
          <p className="text-center  notreConseil"> GoGrad !</p>
        </div>

        <div style={{ backgroundColor: "#070033" }}>
          <div className="row">
            <div className="col-lg-6 col-md-12 ml-5 p-5 sagesse">
              <p className="question">Etes-vous souvent perdu dans </p>
              <p className="question"> les details de PFE/PT?</p>
              <div className="col-lg-8 col-md-12 ">
                <p className="guide mt-4">
                  Nous comprenons bien que les PFEs /PT peuvent etre assez
                  complexe , GoGrad vous aide a assurer une bonne organisation
                  et déroulement étape par étape?{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-6 col-md-12 ml-5 p-5 sagesse">
              <p className="question">Avez-vous besoin de centraliser </p>
              <p className="question">toutes les informations liées au</p>
              <p className="question">projet a un seul endroit ?</p>
              <div className="col-lg-8 col-md-12 ">
                <p className="guide mt-4">
                  GoGrad vous permet de le faire tout en assurant le partage de
                  fichier avec tout les membres(encadrant ou binome)
                </p>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-lg-6 col-md-12 ml-5 p-5 sagesse">
              <p className="question">Est-ce que vous oubliez souvent </p>
              <p className="question">vos dates d’échéances et de </p>
              <p className="question">réunion ?</p>
              <div className="col-lg-8 col-md-12 ">
                <p className="guide mt-4">
                  Grace au syteme de rappel tout vos delais seront bien
                  réspéctée .
                </p>
              </div>
            </div>
            <div className="col-lg-5 col-md-12  p-3 ">
              <img src={myhome} style={{ width: "80%" }} alt="Team" />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-lg-6 col-md-12 ml-5 p-5 sagesse">
              <p className="question">Est-ce que vous recontrez </p>
              <p className="question">souvent des problémes de mal </p>
              <p className="question">organisation ?</p>
              <div className="col-lg-8 col-md-12 ">
                <p className="guide mt-4">
                  Ne vous inquiétez pas dés maintenant , notre plateforme vous
                  aide a bien organiser vos taches vos notes....
                </p>
              </div>
            </div>
          </div>

          <div className="row mt-3 mb-5">
            <div className="col-lg-6 col-md-12 ml-5 p-5 sagesse">
              <p className="question">Est -ce que GoGrad peut aider </p>
              <p className="question">les universités ainsi qu’au </p>
              <p className="question">étudiant et aux encadrants ?</p>
              <div className="col-lg-8 col-md-12 ">
                <p className="guide mt-4">
                  Oui , GoGrad peut etre utilisée par les établissements afin de
                  suivre la progression de PFE de leurs étudiants , ce qui lui
                  permt de mieux gérer les ressources .
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mb-5 mt-5"></div>

        <div className=" mb-5 mt-5 customeColor">
          <div className="d-flex justify-content-around align-items-center">
            <div className="mySimpleCard mt-5 mb-5">
              <img src={cardOne} alt="Team" />

              <p className="advantages text-center mt-5">
                Plus de productivité
              </p>
            </div>

            <div className="mySimpleCard mt-5 mb-5">
              <img src={cardTwo} alt="Team" />
              <p className="advantages text-center mt-5">plus de temps</p>
            </div>

            <div className="mySimpleCard mt-5 mb-5">
              <img src={card3} alt="Team" />
              <p className="advantages text-center mt-5">Plus d’organisation</p>
            </div>
          </div>
        </div>
        <div className=" mt-3 mb-4 sagesse">
          <p className="text-center mt-3 notreConseil2">
            {" "}
            Fini les journées stressantes de{" "}
          </p>
          <p className="text-center  notreConseil2">
            {" "}
            poursuivi de projet avec GoGrad !{" "}
          </p>
        </div>
        <hr className="mt-4 " style={{ border: " 1px solid #000000" }} />
        <div className="row ">
          <div className="col-lg-4 col-md-4 ml-5 mt-5 ">
            <p className="foooterTitle">GoGrad</p>
            <div className="sagesse">
              <a className="Liste mt-2 mb-2">A propos</a>
              <a className="Liste mb-2">Qui somme nous</a>
              <a className="Liste mb-2">Confidentialité</a>
              <a className="Liste mb-5">Conditions d'utilisation</a>
            </div>
          </div>
          <div className="col-lg-3 col-md-3 mt-5 ">
            <p className="foooterTitle">Communauté</p>
            <div className="sagesse">
              <a className="Liste mt-2 mb-2">
                {" "}
                <i className="bi bi-facebook"></i> Facebook
              </a>
              <a className="Liste mb-2">
                <i class="bi bi-linkedin"></i> Linkedin
              </a>
            </div>
          </div>
          <div className="col-lg-4 col-md-4  mt-5 ">
            <p className="foooterTitle">Plus</p>
            <div className="sagesse">
              <a className="Liste mt-2 mb-2"> aide</a>
              <a className="Liste mb-2">Contact :</a>
              <a className="Liste mt-2 mb-2">
                {" "}
                <i class="bi bi-envelope-at-fill"></i> contact@gograd.com.tn
              </a>
              <a className="Liste mb-2">
                <i class="bi bi-whatsapp"></i> +21652000000
              </a>
            </div>
          </div>
        </div><hr className="mt-4 mb-3 " style={{ border: " 1px solid #000000" }}/>
        <div className=" mb-3">
          <p className="copy ml-4"> © 2023 GoGrad. Tous droits réservés.</p>
        </div>
      </main>
    </Fragment>
  );
};

export default Home;
