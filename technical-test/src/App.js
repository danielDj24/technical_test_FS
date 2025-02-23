import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//componente del menu
import Navbar from "./components/topBar/topbar";

//rutas principales
import Articles from "./pages/articles/Articles";
import CreateUserWithSpecialPrices from "./pages/createUser/createUserSpecial";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Articles />} />
        <Route path="/subida" element={<CreateUserWithSpecialPrices />} /> 
      </Routes>
    </Router>
  );
}

export default App;
