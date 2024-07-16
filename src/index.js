import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { TabContextProvider } from "./context/tab-context";
import { ErrorContextProvider } from "./context/error-context";
import { AlertContextProvider } from "./context/alert-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <TabContextProvider>
            <ErrorContextProvider>
                <AlertContextProvider>
                    <App />
                </AlertContextProvider>
            </ErrorContextProvider>
        </TabContextProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
