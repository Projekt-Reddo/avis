import { firebaseLogout } from "api/firebase-api";

export function handleLogout() {
    firebaseLogout().then(() => window.location.reload());
}
