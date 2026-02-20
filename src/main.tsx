import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./stores";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import App from "./App.tsx";

import "./index.scss";

window.addEventListener("load", () => {
  import("./App.scss");
});

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");
    await worker.start();
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <BrowserRouter>
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <App />
            </GoogleOAuthProvider>
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    </StrictMode>,
  );
});
