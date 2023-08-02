import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PrimeReactProvider } from "primereact/api";

import "./index.css";
// 鍏ㄥ眬鏍峰紡
import "quill/dist/quill.bubble.css";
import "primeicons/primeicons.css";
// 涓婚鏍峰紡
// import "primereact/resources/themes/lara-dark-indigo/theme.css";
// import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme

ReactDOM.createRoot(document.getElementById("root")).render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
);
