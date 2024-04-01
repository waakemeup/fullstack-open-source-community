import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/inter";
import { ThemeProvider } from "@mui/styles";
import { Provider } from "mobx-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { SWRConfig } from "swr";
import App from "./App.tsx";
import axios from "./api";
import { AuthProvider } from "./context/auth.tsx";
import { LayoutProvider } from "./context/layout.tsx";
import Themes from "./themes/index.ts";
import themes from "./themes/index.ts";

const fetcher = async (url: string) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <ThemeProvider theme={Themes.default}>
        <SWRConfig
          value={{
            fetcher,
            dedupingInterval: 5000,
          }}
        >
          <AuthProvider>
            <LayoutProvider>
              <App />
            </LayoutProvider>
          </AuthProvider>
        </SWRConfig>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// console.log(themes.default.breakpoints);
