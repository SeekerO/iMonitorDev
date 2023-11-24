import React, { useEffect, useState } from "react";
import MainNavBar from "./components/MainNavBar";
import BeneficiaryCreator from "./components/AdminPages/BeneficiaryCreator";

function App({ instance }) {
  return (
    <div className="App">
      <div className="bg-cover bg-center flex-col">
        <div>
          <header className="fixed top-0">
            <MainNavBar instance={instance} />       
          </header>
        </div>

      </div>
    </div>
  );
}

export default App;
