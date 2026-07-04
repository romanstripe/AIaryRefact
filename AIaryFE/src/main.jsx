import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { CssBaseline } from "@mui/material";
import { queryClient } from "./util/reactQuery.js";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <BrowserRouter>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </ThemeProvider>
);
