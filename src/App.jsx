import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Heatmap from "./heatmap";
import Cctv from "./cctv";

function App() {
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
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            WiFi Heatmaps
          </Link>
          <Link to="/cctv" style={{ color: "white", textDecoration: "none" }}>
            CCTV Cameras
          </Link>
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
