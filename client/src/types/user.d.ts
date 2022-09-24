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

interface UserCreateDto {
    name: string;
    email: string;
    uid: string;
}

interface UserFilter {
    page: number;
    size: number;
    filter?: {
        name?: string;
        sort?: string;
        joinedStart?: string;
        joinedEnd?: string;
        isModerator?: bool;
        isBanned?: bool;
        isMuted?: bool;
    };
}
