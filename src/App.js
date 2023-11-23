import React, { useEffect, useState } from "react";
import MainNavBar from "./components/MainNavBar";

function App({ instance }) {
  return (
    <div className="App">
      <div className="bg-cover bg-center flex-col">
        <header className="fixed top-0">
          <MainNavBar instance={instance} />
        </header>
      </div>
    </div>
  );
}

export default App;
