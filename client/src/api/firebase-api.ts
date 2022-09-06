import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "utils/firebase-config";

export const userSignupFirebase = async ({ email, password }: UserSignup) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    return res;
};

export const getCurrentUserAccessToken = async () => {
    const token = await auth.currentUser?.getIdToken();

    return token;
};

export const firebaseLogout = async () => {
    try {
        await auth.signOut();
    } catch (e) {
        console.error(e);
    }
};
