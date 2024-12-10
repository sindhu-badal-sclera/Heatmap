import {
    MapContainer,
    ImageOverlay,
    Marker,
    Popup,
    SVGOverlay,
  } from "react-leaflet";
  import floorplan from "./assets/office.png";
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  import { useState } from "react";
  
  // Import the icons
  import wifiIconUrl from "./assets/router.png"; // Replace with your WiFi icon path
  import cameraIconUrl from "./assets/cctv.jpg"; // Replace with your CCTV icon path
  
  const wifiIcon = new L.Icon({
    iconUrl: wifiIconUrl,
    iconSize: [40, 40],
  });
  
  const cameraIcon = new L.Icon({
    iconUrl: cameraIconUrl,
    iconSize: [45, 45],
  });
  
  function App() {
    const imageWidth = 1920;
    const imageHeight = 1080;
  
    // Initial Points for WiFi and CCTV
    const initialWifiPoints = [
      [1000, 1920], // Example position
      [0, 1920], // Example position
      [0,0]
    ];
  
    const initialCCTVPoints = [
       [550, 512], // Example position
      [840, 114], // Example position
    ];
  
    const [wifiPoints, setWifiPoints] = useState(initialWifiPoints);
    const [cctvPoints, setCCTVPoints] = useState(initialCCTVPoints);
  
    const bounds = [
      [0, 0],
      [imageHeight, imageWidth],
    ];
  
    const handleMarkerDragEnd = (event, index, type) => {
      let { lat, lng } = event.target.getLatLng();
  
      // Constrain coordinates to the bounds of the image
      lat = Math.min(Math.max(lat, 0), imageHeight);
      lng = Math.min(Math.max(lng, 0), imageWidth);
  
      if (type === "wifi") {
        setWifiPoints((prevPoints) => {
          const newPoints = [...prevPoints];
          newPoints[index] = [lat, lng];
          return newPoints;
        });
      } else if (type === "cctv") {
        setCCTVPoints((prevPoints) => {
          const newPoints = [...prevPoints];
          newPoints[index] = [lat, lng];
          return newPoints;
        });
      }
    };
  
    const addWifiPoint = () => {
      setWifiPoints((prevPoints) => [
        ...prevPoints,
        [imageHeight / 2, imageWidth / 2], // Add at center
      ]);
    };
  
    const addCCTVPoint = () => {
      setCCTVPoints((prevPoints) => [
        ...prevPoints,
        [imageHeight / 2, imageWidth / 2], // Add at center
      ]);
    };
  
    const deleteMarker = (index, type) => {
      if (type === "wifi") {
        setWifiPoints((prevPoints) => {
          const newPoints = [...prevPoints];
          newPoints.splice(index, 1);
          return newPoints;
        });
      } else if (type === "cctv") {
        setCCTVPoints((prevPoints) => {
          const newPoints = [...prevPoints];
          newPoints.splice(index, 1);
          return newPoints;
        });
      }
    };
  
    return (
      <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      {/* Center-top button container */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          gap: "10px", // Adds space between the buttons
        }}
      >
        <button
          onClick={addWifiPoint}
          style={{
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Router Point
        </button>
  
        <button
          onClick={addCCTVPoint}
          style={{
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add CCTV Point
        </button>
      </div>
  
        <MapContainer
          zoom={-1}
          center={[imageHeight / 2, imageWidth / 2]}
          minZoom={-2}
          bounds={bounds}
          style={{ height: "100%", width: "100%" }}
          crs={L.CRS.Simple}
        >
          <ImageOverlay zIndex={1} url={floorplan} bounds={bounds} />
  
          {/* Render WiFi Points */}
          {wifiPoints.map(([y, x], index) => (
            <Marker
              key={index}
              position={[y, x]}
              icon={wifiIcon}
              draggable={true}
              eventHandlers={{
                dragend: (event) => handleMarkerDragEnd(event, index, "wifi"),
              }}
            >
              <Popup>
                <div>
                  <p>WiFi Router at [{y.toFixed(0)}, {x.toFixed(0)}]</p>
                  <button
                    onClick={() => deleteMarker(index, "wifi")}
                    style={{ backgroundColor: "red", color: "white", padding: "5px" }}
                  >
                    Delete Router
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
  
          {/* Render CCTV Points */}
          {cctvPoints.map(([y, x], index) => (
            <Marker
              key={index}
              position={[y, x]}
              icon={cameraIcon}
              draggable={true}
              eventHandlers={{
                dragend: (event) => handleMarkerDragEnd(event, index, "cctv"),
              }}
            >
              <Popup>
                <div>
                  <p>CCTV at [{y.toFixed(0)}, {x.toFixed(0)}]</p>
                  <button
                    onClick={() => deleteMarker(index, "cctv")}
                    style={{ backgroundColor: "red", color: "white", padding: "5px" }}
                  >
                    Delete CCTV
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
  
          {/* <SVGOverlay bounds={bounds} style={{ pointerEvents: "none" }}>
            <defs>
              <radialGradient id="wifiGradient" cx="50%" cy="50%" r="50%">
                <stop offset="20%" stopColor="green" stopOpacity={0.8} />
                <stop offset="50%" stopColor="yellow" stopOpacity={0.8} />
                <stop offset="85%" stopColor="orange" stopOpacity={0.75} />
                <stop offset="100%" stopColor="red" stopOpacity={0.2} />
              </radialGradient>
            </defs>
  
            {/* Optional Heatmap for WiFi */}
            {/* {wifiPoints.map(([y, x], index) => {
              const cxPercent = ((x / imageWidth) * 100).toFixed(2);
              const cyPercent = ((1 - y / imageHeight) * 100).toFixed(2);
  
              return (
                <circle
                  key={index}
                  cx={`${cxPercent}%`}
                  cy={`${cyPercent}%`}
                  r="20%"
                  fill="url(#wifiGradient)"
                  opacity="0.8"
                />
              );
            })} */}
          {/* </SVGOverlay> */} 
  
          {/* <SVGOverlay bounds={bounds} style={{ pointerEvents: "none" }}>
    <defs>
      <radialGradient id="wifiGradient" cx="50%" cy="50%" r="50%">
        <stop offset="20%" stopColor="green" stopOpacity={0.8} />
        <stop offset="50%" stopColor="yellow" stopOpacity={0.8} />
        <stop offset="85%" stopColor="orange" stopOpacity={0.75} />
        <stop offset="100%" stopColor="red" stopOpacity={0.2} />
      </radialGradient>
    </defs> */}
  
    {/* Optional Heatmap for WiFi */}
    {/* {wifiPoints.map(([y, x], index) => {
      console.log(x,y)
      const cxPercent = ((x / imageWidth) * 100).toFixed(2);
      const cyPercent = ((1 - y / imageHeight) * 100).toFixed(2);
  
      return (
        <circle
          key={index}
          cx={`${cxPercent}%`}
          cy={`${cyPercent}%`}
          r="20%"
          fill="url(#wifiGradient)"
          opacity="0.8"
        />
      );
    })} */}
  
    {/* Render CCTV Sectors */}
    {/* {cctvPoints.map(([y, x], index) => {
      const radius = 300; // Coverage radius in pixels (adjust as needed)
      const fov = 30; // Field of view (FoV) in degrees
      const startAngle = -105; // Starting angle relative to "north" (adjust per camera direction)
  
      const cxPercent = ((x / imageWidth) * 100).toFixed(2);
      const cyPercent = ((1 - y / imageHeight) * 100).toFixed(2);
  
      // Convert polar coordinates to SVG path
      const startX = x + radius * Math.cos((Math.PI / 180) * startAngle);
      const startY = y + radius * Math.sin((Math.PI / 180) * startAngle);
      const endX = x + radius * Math.cos((Math.PI / 180) * (startAngle + fov));
      const endY = y + radius * Math.sin((Math.PI / 180) * (startAngle + fov));
      console.log(startX,startY,endX,endY)
      const path = `M ${x},${y} L ${startX},${startY} A ${radius},${radius} 0 0,1 ${endX},${endY} Z`; */}
  {/* 
      return (
        <path
          key={`sector-${index}`}
          d={path}
          fill="rgba(0, 0, 255, 0.3)"
          stroke="blue"
          strokeWidth="1"
          transform={`translate(${cxPercent}%, ${cyPercent}%)`}
        />
      );
    })}
  </SVGOverlay> */}
  <SVGOverlay bounds={bounds} style={{ pointerEvents: "none" }}>
    <defs>
      <radialGradient id="wifiGradient" cx="50%" cy="50%" r="50%">
        <stop offset="20%" stopColor="green" stopOpacity={0.8} />
        <stop offset="50%" stopColor="yellow" stopOpacity={0.8} />
        <stop offset="85%" stopColor="orange" stopOpacity={0.75} />
        <stop offset="100%" stopColor="red" stopOpacity={0.2} />
      </radialGradient>
    </defs>
  
    {/* Optional Heatmap for WiFi */}
    {wifiPoints.map(([y, x], index) => {
      const cxPercent = ((x / imageWidth) * 100).toFixed(2);
      const cyPercent = ((1 - y / imageHeight) * 100).toFixed(2);
  
      return (
        <circle
          key={index}
          cx={`${cxPercent}%`}
          cy={`${cyPercent}%`}
          r="20%"
          fill="url(#wifiGradient)"
          opacity="0.8"
        />
      );
    })}
  
    {/* Render CCTV Sectors */}
    {cctvPoints.map(([y, x], index) => {
      const radius = 300; // Coverage radius in pixels (adjust as needed)
      const fov = 90; // Field of view (FoV) in degrees
      const startAngle = -45; // Starting angle relative to "north" (adjust per camera direction)
      
      // To flip the y-coordinates:
      const flippedY = imageHeight - y; // Flip y-coordinate to match the SVG coordinate system
  
      // Now ensure the sector's center is at the camera's position (x, y)
      const startX = x + radius * Math.cos((Math.PI / 180) * startAngle);
      const startY = flippedY + radius * Math.sin((Math.PI / 180) * startAngle);  // Adjusted for flipped y
      const endX = x + radius * Math.cos((Math.PI / 180) * (startAngle + fov));
      const endY = flippedY + radius * Math.sin((Math.PI / 180) * (startAngle + fov));  // Adjusted for flipped y
  
      const path = `M ${x},${flippedY} L ${startX},${startY} A ${radius},${radius} 0 0,1 ${endX},${endY} Z`;
  
      return (
        <path
          key={`sector-${index}`}
          d={path}
          fill="rgba(0, 0, 255, 0.3)"
          stroke="blue"
          strokeWidth="1"
          transform={`translate(0, ${flippedY})`} // Flip the sector based on the y-coordinate
        />
      );
    })}
  </SVGOverlay>
  
  
  
        </MapContainer>
      </div>
    );
  }
  
  export default App;
  
  
  