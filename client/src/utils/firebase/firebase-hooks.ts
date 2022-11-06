import { firebaseLogout, userEmailVerify } from "api/firebase-api";
import { addNewToast } from "components/Toast";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { firstCheckin } from "store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";

export const useFirebaseUserChangeTracking = () => {
    const authState = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // Handle user change
            if (authState.status === "init") {
                dispatch(firstCheckin());
            }

            if (user) {
                // If user has not verified email, then logout them
                if (!user.emailVerified) {
                    await userEmailVerify();

                    await firebaseLogout();
                }

                const tokenResult = await user.getIdTokenResult(true);

                if (
                    tokenResult.claims.status &&
                    tokenResult.claims.status.IsBanned
                ) {
                    addNewToast({
                        variant: "danger",
                        message: "You have been banned from the system!",
                    });

                    await firebaseLogout();
                }
            }
        });

        return unsubscribe;
    }, []);
};
