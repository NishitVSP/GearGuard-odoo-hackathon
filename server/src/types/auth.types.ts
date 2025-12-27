// src/types/auth.types.ts

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    role?: 'user' | 'technician' | 'manager' | 'admin';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    avatar_url?: string;
    is_active: boolean;
    created_at: Date;
}
