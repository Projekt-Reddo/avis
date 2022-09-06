import { firebaseLogout } from "api/firebase-api";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export const useUserChangeTracking = () => {
    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Handle user change
                console.log(user);

                // If user has not verified email, then logout them
                if (!user.emailVerified) {
                    firebaseLogout();
                }
            } else {
            }
        });

        return unsubscribe;
    }, []);
};
