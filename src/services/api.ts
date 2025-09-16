// API service for backend integration
import devMockService from './devMock';

const API_BASE_URL = 'http://localhost:3000';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    publicKey: string;
  };
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface RegisterResponse {
  message: string;
  publicKey: string;
}

interface APIError {
  error: string;
}

class ApiService {
  private getAuthHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/wallet/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as APIError).error || 'Login failed');
    }

    // Se o backend não retornar dados do usuário, buscar via wallet endpoint
    if (!data.user && data.token) {
      try {
        const walletData = await this.getWallet(credentials.email, data.token);
        const user = {
          id: walletData.user?.id || '1',
          email: credentials.email,
          name: data.user?.name || credentials.email.split('@')[0],
          publicKey: walletData.publicKey
        };
        return {
          ...data,
          user
        } as LoginResponse;
      } catch (error) {
        // Se falhar, criar um usuário básico
        const user = {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          publicKey: 'TEMP_PUBLIC_KEY'
        };
        return {
          ...data,
          user
        } as LoginResponse;
      }
    }

    return data as LoginResponse;
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/wallet/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as APIError).error || 'Registration failed');
    }

    return data as RegisterResponse;
  }

  async getWallet(email: string, token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/${email}`, {
        method: 'GET',
        headers: this.getAuthHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as APIError).error || 'Failed to fetch wallet');
      }

      return data;
    } catch (error) {
      // Use mock data in development when backend is not available
      if (devMockService.shouldUseMock(error)) {
        console.warn('Backend not available, using mock wallet data');
        return devMockService.getMockWallet();
      }
      throw error;
    }
  }

  async getDashboard(userId: string, token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as APIError).error || 'Failed to fetch dashboard data');
      }

      return data;
    } catch (error) {
      // Use mock data in development when backend is not available
      if (devMockService.shouldUseMock(error)) {
        console.warn('Backend not available, using mock data for dashboard');
        return devMockService.getMockDashboard();
      }
      throw error;
    }
  }

  async getCampaigns(userId: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/advertisements/${userId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as APIError).error || 'Failed to fetch campaigns');
    }

    return data;
  }

  async createCampaign(formData: FormData, token: string) {
    const response = await fetch(`${API_BASE_URL}/advertisements`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as APIError).error || 'Failed to create campaign');
    }

    return data;
  }

  async transfer(transferData: { fromEmail: string; toPublicKey: string; amount: number }, token: string) {
    const response = await fetch(`${API_BASE_URL}/transfer`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(transferData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error((data as APIError).error || 'Transfer failed');
    }

    return data;
  }

  async getUserProfile(userId: string, token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(token),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error((data as APIError).error || 'Failed to fetch user profile');
      }

      return data;
    } catch (error) {
      // Use mock data in development when backend is not available
      if (devMockService.shouldUseMock(error)) {
        console.warn('Backend not available, using mock profile data');
        return devMockService.getMockProfile();
      }
      throw error;
    }
  }
}

export const apiService = new ApiService();
export type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse };
