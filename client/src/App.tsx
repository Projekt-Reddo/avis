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
import { useFirebaseUserChangeTracking } from "utils/firebase/firebase-hooks";
import { useUserChangeTracking } from "utils/user-tracking-hooks";

import "./theme/index.css";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import { THEME } from "utils/constants";
import { getTheme } from "store/slices/themeSlice";
import { useHubConnection } from "utils/use-hub-connection";

setupIonicReact({
    swipeBackEnabled: false,
});

const App: React.FC = () => {
    useFirebaseUserChangeTracking();
    useUserChangeTracking();
    useHubConnection();

    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme);
    useEffect(() => {
        dispatch(getTheme());
    }, []);

    useEffect(() => {
        if (theme.status === "idle") {
            switch (theme.data.value) {
                case THEME.DARK:
                    document.body.classList.add("dark");
                    break;

                default:
                    document.body.classList.remove("dark");
                    break;
            }
        }
    }, [theme]);

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
