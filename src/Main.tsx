import { JazzReactProvider } from "jazz-tools/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { JazzInspector } from "jazz-tools/inspector";
import { apiKey } from "./apiKey.ts";
import { ToastProvider } from "./contexts/ToastContext.tsx";
import { JazzAccount } from "./schema.ts";

// This identifies the app in the passkey auth
export const APPLICATION_NAME = "feedic";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <JazzReactProvider
        sync={{ peer: `wss://cloud.jazz.tools/?key=${apiKey}` }}
        AccountSchema={JazzAccount}
      >
        <ToastProvider>
          <App />

          <JazzInspector />
        </ToastProvider>
      </JazzReactProvider>
    </BrowserRouter>
  </StrictMode>
);
