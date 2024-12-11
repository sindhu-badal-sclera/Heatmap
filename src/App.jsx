import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Heatmap from "./heatmap";
import Cctv from "./cctv";



function App() {
const[clicked, setclicked]=useState(false)
function handleClick(){
  setclicked((prevState)=> !prevState)
}

  return (
    <Router>
      <div style={{width:'100vw', height:'100vh'}} >
        {/* Navigation bar */}
        <nav
          style={{
            padding: "10px",
            backgroundColor: "#282c34",
            color: "white",
            display: "flex",  
            justifyContent: "space-around",
          }}
        >
         <div style={{backgroundColor: clicked? "inherit" : "grey"}} onClick={handleClick}>
         <Link to="/" style={{ color: "white", textDecoration: "none" }} > 
            WiFi Heatmaps
          </Link>
          </div>
          <div style={{backgroundColor: clicked? "grey" : "inherit"}} onClick={handleClick}>
          <Link to="/cctv" style={{ color: "whited", textDecoration: "none"}}>
            CCTV Cameras
          </Link>
         
         </div>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Heatmap />} />
          <Route path="/cctv" element={<Cctv />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
