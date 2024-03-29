import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import { IonApp } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { QueryClientProvider, QueryClient } from "react-query";

// Initialize firebase
import "utils/firebase/firebase-config";

import { Provider } from "react-redux";
import store from "./store";
import ToastManager from "components/Toast/ToastManager";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <Provider store={store}>
        <QueryClientProvider client={new QueryClient()}>
            <IonApp>
                <IonReactRouter>
                    <App />
                </IonReactRouter>
            </IonApp>
        </QueryClientProvider>

        <ToastManager />
    </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
