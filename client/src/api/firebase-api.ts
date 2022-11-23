import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    sendEmailVerification,
    signInWithPopup,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "utils/firebase/firebase-config";

export const currentFirebaseUser = () => {
    const res = auth.currentUser;

    return res;
};

export const userLoginFirebase = async ({ email, password }: UserLoginDto) => {
    const res = await signInWithEmailAndPassword(auth, email, password);

    return res;
};

export const userSignupFirebase = async ({ email, password }: UserSignup) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    return res;
};

export const userEmailVerify = async () => {
    try {
        if (auth.currentUser) await sendEmailVerification(auth.currentUser);
    } catch (e) {}
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

export const loginWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const res = await signInWithPopup(auth, provider);

    return res;
};

export const resetPassword = async (email: string) => {
    const res = await sendPasswordResetEmail(auth, email);

    return res;
};
