import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { GoogleMapsProvider } from "@ttoss/google-maps";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleMapsProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
      <App />
    </GoogleMapsProvider>
  </React.StrictMode>
);
