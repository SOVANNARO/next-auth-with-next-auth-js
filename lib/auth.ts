import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  avatar: string;
}

export async function login(email: string, password: string): Promise<{ user: User; tokens: AuthResponse }> {
  try {
    const authResponse = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const { access_token, refresh_token } = authResponse.data;

    const userResponse = await axios.get<User>(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return {
      user: userResponse.data,
      tokens: { access_token, refresh_token },
    };
  } catch (error) {
    throw new Error('Invalid credentials');
  }
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh-token`, {
      refreshToken: token,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
}