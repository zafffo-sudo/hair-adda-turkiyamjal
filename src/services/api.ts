import {
  User,
  CustomerDashboardData,
  OwnerDashboardData,
  LeaderboardEntry,
  MonthlyPrize,
  Purchase,
} from '../types';

const TOKEN_KEY = 'dukan_auth_token_v1';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data as T;
}

export const api = {
  async login(mobile: string, password: string, role?: string): Promise<{ token: string; user: User }> {
    const data = await request<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password, role }),
    });
    setStoredToken(data.token);
    return data;
  },

  async ownerLogin(password: string): Promise<{ token: string; user: User }> {
    const data = await request<{ token: string; user: User }>('/api/auth/owner-login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    setStoredToken(data.token);
    return data;
  },

  async register(name: string, mobile: string, password: string): Promise<{ token: string; user: User }> {
    const data = await request<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, mobile, password }),
    });
    setStoredToken(data.token);
    return data;
  },

  async getMe(): Promise<User> {
    return request<User>('/api/auth/me');
  },

  logout() {
    removeStoredToken();
  },

  async getCustomerDashboard(): Promise<CustomerDashboardData> {
    return request<CustomerDashboardData>('/api/customer/dashboard');
  },

  async getOwnerDashboard(): Promise<OwnerDashboardData> {
    return request<OwnerDashboardData>('/api/owner/dashboard');
  },

  async lookupCustomer(query: string): Promise<{
    customer: User;
    totalLifetimeSpend: number;
    currentMonthSpend: number;
    totalCoins: number;
    purchases: Purchase[];
    prizes: MonthlyPrize[];
  }> {
    return request(`/api/owner/customer-lookup?query=${encodeURIComponent(query)}`);
  },

  async addPurchase(data: {
    customerId: string;
    billNumber: string;
    amount: number;
    items?: string;
    date?: string;
  }): Promise<{ success: boolean; purchase: Purchase; message: string }> {
    return request('/api/owner/purchases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getLeaderboard(month?: string): Promise<{
    monthKey: string;
    monthLabel: string;
    availableMonths: Array<{ key: string; label: string; isCurrent: boolean }>;
    entries: LeaderboardEntry[];
    monthPrize: MonthlyPrize | null;
  }> {
    const q = month ? `?month=${encodeURIComponent(month)}` : '';
    return request(`/api/leaderboard${q}`);
  },

  async finalizeMonth(monthKey: string): Promise<{ success: boolean; prize: MonthlyPrize; message: string }> {
    return request('/api/owner/finalize-month', {
      method: 'POST',
      body: JSON.stringify({ monthKey }),
    });
  },

  async getPrizes(): Promise<MonthlyPrize[]> {
    return request<MonthlyPrize[]>('/api/prizes');
  },

  async claimPrize(data: {
    claimCodeOrQr: string;
    claimedBillNumber?: string;
  }): Promise<{ success: boolean; prize: MonthlyPrize; message: string }> {
    return request('/api/prizes/claim', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async verifyCustomer(
    customerId: string,
    status: 'pending' | 'verified' | 'rejected'
  ): Promise<{ success: boolean; customer: User; message: string }> {
    return request('/api/owner/verify-customer', {
      method: 'POST',
      body: JSON.stringify({ customerId, status }),
    });
  },
};
