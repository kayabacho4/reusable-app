import axios, { AxiosInstance } from 'axios';
import { 
    User, 
    AuthUser, 
    LoginRequest, 
    RegisterRequest, 
    Post, 
    PostsQueryParams, 
    ApiResponse, 
    PostsResponse,
    UpdateUserRequest
} from '../types/types';

class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async register(userData: RegisterRequest): Promise<ApiResponse<AuthUser>> {
        try {
            const response = await this.axiosInstance.post<AuthUser>('/users/', userData);
            return {data: response.data, success: true};
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Registration failed',
            };
        }
    }

    async login(credentials: LoginRequest): Promise<ApiResponse<AuthUser>> {
        try {
            const response = await this.axiosInstance.post<AuthUser>('/login', credentials);
            return {data: response.data, success: true};
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed',
            };
        }
    }

    async getUserById(userId: string): Promise<ApiResponse<User>> {
        try {
            const response = await this.axiosInstance.get<ApiResponse<User>>(`/users/${userId}`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'User not found',
            };
        }
    }

    async updateUserById(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
        try {
            const response = await this.axiosInstance.post<User>(`/users/${userId}/update`, userData);
            return {data: response.data, success: true};
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'User not found',
            };
        }
    }

    async createPost(content: string, user_id: string): Promise<ApiResponse<Post>> {
        try {
            const response = await this.axiosInstance.post<Post>('/posts/', 
                { content, user_id }
            );
            return {data: response.data, success: true};
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Post creation failed',
            };
        }
    }

    async getPosts(params: PostsQueryParams = {}): Promise<ApiResponse<PostsResponse>> {
        try {
            const response = await this.axiosInstance.get<PostsResponse>('/posts/', {
                params: {
                    limit: params.limit || 10,
                    skip: params.offset || 0,
                    sort_by: params.sort || 'newest'
                }
            });
            return {data: response.data, success: true};
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to fetch posts',
                total: 0,
            };
        }
    }
    async deletePost(post_id: string): Promise<ApiResponse<Boolean>> {
        try {
            const response = await this.axiosInstance.delete<Boolean>('/posts/' + post_id + '/', {
                params: {
                    post_id: post_id
                }
            });
            return {data: response.data, success: true};
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to fetch posts',
                total: 0,
            };
        }
    }

    async getUserPosts(userId: string): Promise<ApiResponse<Post[]>> {
        try {
            const response = await this.axiosInstance.get<ApiResponse<Post[]>>(`/users/${userId}/posts`);
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Failed to fetch user posts',
            };
        }
    }

    async likePost(postId: string, userId: string): Promise<ApiResponse<void>> {
        try {
            const response = await this.axiosInstance.post<ApiResponse<void>>(`/posts/${postId}/like`, 
                { user_id: userId }
            );
            return response.data;
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Like action failed',
            };
        }
    }
}

export const apiService = new ApiService();
export default apiService;