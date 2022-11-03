import { IonRouterOutlet, setupIonicReact } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/global.css";

import MainRoute from "./routes";
import Nav from "components/shared/Nav";
import TabsNav from "components/shared/TabsNav";
import ToastManager from "components/Toast/ToastManager";
import { useFirebaseUserChangeTracking } from "utils/firebase/firebase-hooks";
import { useUserChangeTracking } from "utils/user-tracking-hooks";

import "./theme/index.css";
import { useHubConnection } from "utils/use-hub-connection";

setupIonicReact({
    swipeBackEnabled: false,
});

const App: React.FC = () => {
    useFirebaseUserChangeTracking();
    useUserChangeTracking();

    useHubConnection();

    return (
        <>
            <Nav />

            <IonRouterOutlet>
                <MainRoute />
            </IonRouterOutlet>

            <TabsNav />
        </>
    );
};

export default App;
