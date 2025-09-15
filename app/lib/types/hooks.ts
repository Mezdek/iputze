export interface SignInInput {
    email: string;
    password: string;
}

export interface SignUpInput {
    name: string;
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface SignInResponse {
    user: User;
    accessToken: string;
}