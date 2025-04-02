export interface User {
    id: string;
    username: string;
    avatar_url: string | null;
    display_name: string;
    created_at: string;
}

export interface AuthUser extends User {
    authenticated: boolean;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    display_name: string;
    avatarUrl?: string;
}

export interface UpdateUserRequest {
    username: string;
    display_name: string;
    avatarUrl?: string;
}

export interface PostsResponse {
    items: Post[];
    total: number;
}

export interface Post {
    id: string;
    posted_by: string; // User.id
    content: string;
    created_at: string;
    likes: number;
    author?: User;
}

export interface PostsQueryParams {
    limit?: number;
    offset?: number;
    sort?: 'newest' | 'popular';
}

export interface CreatePostRequest {
    content: string;
}

export interface LikeAction {
    postId: string;
    userId: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    success: boolean;
    total?: number;
}
