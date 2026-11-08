import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "../styles/globals.css";

function renderApp() {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Tunggu Office.onReady jika berada di lingkungan Office Add-in,
// atau langsung render jika dibuka di browser biasa.
if (typeof Office !== "undefined" && typeof Office.onReady === "function") {
  Office.onReady(() => {
    renderApp();
  });
} else {
  renderApp();
}

