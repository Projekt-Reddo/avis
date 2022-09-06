interface User {
    name: string;
    email: string;
    role: string;
}

interface UserInitialState extends InitialStateForApi {
    data: User | null;
}

interface UserSignup {
    name: string;
    email: string;
    password: string;
}
