import { useState } from "react";
import { Redirect, Route } from "react-router-dom";
import {
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
} from "@ionic/react";
import {
    search,
    searchCircleOutline,
    rocket,
    rocketOutline,
    notifications,
    notificationsOutline,
    personCircle,
    personCircleOutline,
} from "ionicons/icons";

// Components
import Home from "pages/Home";
import Discover from "pages/Discover";
import Login from "pages/auth/Login";

// Style
import "theme/Tabs.css";

const Tabs: React.FC = () => {
    const [tabSelect, setTabselect] = useState("home");

    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/home" component={Home} />
                <Route exact path="/discover" component={Discover} />
                <Route exact path="/login" component={Login} />
                <Route exact path="">
                    <Redirect to="/home" />
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton
                    tab="home"
                    href="/home"
                    onClick={() => setTabselect("home")}
                    className="ionic-tab-button"
                >
                    <IonIcon
                        icon={
                            tabSelect === "home" ? search : searchCircleOutline
                        }
                    />
                    <IonLabel
                        className={
                            tabSelect === "home"
                                ? "ionic-tab-label-select"
                                : "ionic-tab-label"
                        }
                    >
                        Home
                    </IonLabel>
                </IonTabButton>

                <IonTabButton
                    tab="discover"
                    href="/discover"
                    onClick={() => setTabselect("discover")}
                    className="ionic-tab-button"
                >
                    <IonIcon
                        icon={tabSelect === "discover" ? rocket : rocketOutline}
                    />
                    <IonLabel
                        className={
                            tabSelect === "discover"
                                ? "ionic-tab-label-select"
                                : "ionic-tab-label"
                        }
                    >
                        Discover
                    </IonLabel>
                </IonTabButton>

                <IonTabButton
                    tab="notification"
                    href="/notification"
                    onClick={() => setTabselect("notification")}
                    className="ionic-tab-button"
                >
                    <IonIcon
                        icon={
                            tabSelect === "notification"
                                ? notifications
                                : notificationsOutline
                        }
                    />
                    <div
                        className="absolute h-3 w-3 font-bold flex justify-center items-center text-white rounded-full ml-4 mb-10"
                        style={{
                            backgroundColor: "#E11D48",
                            fontSize: 10,
                        }}
                    >
                        2
                    </div>
                    <IonLabel
                        className={
                            tabSelect === "notification"
                                ? "ionic-tab-label-select"
                                : "ionic-tab-label"
                        }
                    >
                        Notification
                    </IonLabel>
                </IonTabButton>

                <IonTabButton
                    tab="profile"
                    href="/login"
                    onClick={() => setTabselect("profile")}
                    className="ionic-tab-button"
                >
                    <IonIcon
                        icon={
                            tabSelect === "profile"
                                ? personCircle
                                : personCircleOutline
                        }
                    />
                    <IonLabel
                        className={
                            tabSelect === "profile"
                                ? "ionic-tab-label-select"
                                : "ionic-tab-label"
                        }
                    >
                        Me
                    </IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

export default Tabs;
