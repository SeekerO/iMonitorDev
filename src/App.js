import React, { useEffect, useState } from "react";
import MainNavBar from "./components/MainNavBar";


function App() {
  return (
    <div className="App">
      <div className="bg-cover bg-center">
        <div className=" flex-col">
          <header className="fixed top-0"><MainNavBar /></header>
        </div>
      </div>
    </div>
  );
}

export default App;
