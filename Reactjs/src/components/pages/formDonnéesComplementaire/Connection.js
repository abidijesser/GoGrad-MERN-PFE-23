import React, { useState } from "react";
import Form from "../Form";
import DashboardChefDepartement from "../../../Dashboard/DashbordChefDepartement/DashboardChefDepartement";

function ParentComponent() {
  const [chefID, setChefID] = useState("");

  return (
    <>
      <Form setChefID={setChefID} />
      <DashboardChefDepartement chefID={chefID} />
    </>
  );
}

export default ParentComponent;
