import { firebaseLogout, userEmailVerify } from "api/firebase-api";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export const useFirebaseUserChangeTracking = () => {
    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Handle user change

                // If user has not verified email, then logout them
                if (!user.emailVerified) {
                    await userEmailVerify();

                    await firebaseLogout();
                }
            }
        });

        return unsubscribe;
    }, []);
};
