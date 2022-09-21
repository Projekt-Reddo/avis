import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    sendEmailVerification,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "utils/firebase/firebase-config";

export const userSignupFirebase = async ({ email, password }: UserSignup) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    return res;
};

export const userEmailVerify = async () => {
    if (auth.currentUser) await sendEmailVerification(auth.currentUser);
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

    const credential = GoogleAuthProvider.credentialFromResult(res);

    return res;

    // signInWithPopup(auth, provider)
    //     .then((result) => {
    //         // This gives you a Google Access Token. You can use it to access the Google API.
    //         const credential = GoogleAuthProvider.credentialFromResult(result);
    //         // const token = credential?.accessToken;
    //         // // The signed-in user info.
    //         // const user = result.user;

    //         Promise.resolve(result);
    //     })
    //     .catch((error) => {
    //         // Handle Errors here.
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         // The email of the user's account used.
    //         const email = error.customData.email;
    //         // The AuthCredential type that was used.
    //         const credential = GoogleAuthProvider.credentialFromError(error);
    //         // ...
    //     });
};
