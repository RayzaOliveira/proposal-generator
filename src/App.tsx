// import "./App.css";
import { useGoogleMaps, useMap } from "@ttoss/google-maps";
import React from "react";

function App() {
  const { ref, map } = useMap();
  const { status } = useGoogleMaps();

  React.useEffect(() => {
    if (status === "ready" && map) {
      map.setCenter({
        lat: -26.8912311,
        lng: -49.0974349,
      });

      map.setZoom(20);
      map.setMapTypeId("satellite");
    }
  }, [status]);

  return (
    <>
      <div ref={ref} style={{ height: 640, width: 860 }} />
    </>
  );
}

export default App;
