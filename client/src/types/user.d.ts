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

interface UserLoginDto {
    email: string;
    password: string;
}

interface UserCreateDto {
    name: string;
    email: string;
    uid: string;
    avatar: string | null;
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

interface UserDisplay {
    avatar: string;
    commentMutedUntil: string;
    id: string;
    isBanned: boolean;
    joinedDate: string;
    name: string;
    postMutedUntil: string;
    role: string;
    isSelected: string;
}

interface UserManageButtonLayoutDefaultProps {
    selectedUser: UserDisplay[];
}

interface UserUidList {
    uids: string[];
}
