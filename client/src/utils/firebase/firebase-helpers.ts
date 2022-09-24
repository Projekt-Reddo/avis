export const mapAuthCodeToMessage = (authCode: string) => {
    switch (authCode) {
        case "auth/invalid-password":
            return "Password provided is not corrected!";

        case "auth/invalid-email":
            return "Email provided is invalid!";

        case "auth/email-already-exists":
            return "Email already exists!";

        case "auth/email-already-in-use":
            return "Email alredy in use!";

        case "auth/user-not-found":
            return "User not found!";

        case "auth/wrong-password":
            return "Wrong credential!";

        // Many more authCode mapping here...

        default:
            return "Some errors happen, please try again later...";
    }
};
