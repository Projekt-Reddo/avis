interface User {
    username: string;
    email: string;
    role: string;
}

interface UserInitialState extends InitialStateForApi {
    data: User | null;
}
