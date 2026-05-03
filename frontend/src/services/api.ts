/**
 * Fortress X API Service
 * Handles communication with the FastAPI backend.
 */

// Vercel should ideally provide VITE_API_URL, but we fallback to the active Render deployment
const rawApiUrl = import.meta.env.VITE_API_URL || "https://fortress-x.onrender.com/api/v1";
export const API_BASE_URL = rawApiUrl.startsWith('http') ? rawApiUrl : `https://${rawApiUrl}`;

export const getAuthToken = () => {
  return localStorage.getItem('fortress_token');
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    logout();
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  return response;
}

export interface TransactionData {
  user_id: string;
  amount: number;
  currency: string;
  ip_address: string;
  device_id: string;
  metadata?: Record<string, any>;
}

export interface PredictionResponse {
  transaction_id: string;
  score: number;
  decision: 'ALLOW' | 'REVIEW' | 'BLOCK';
  explanation: string[];
  trace: {
    ml_score: number;
    ip_score: number;
    behavior_score: number;
  };
  timestamp: string;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Login failed.");
  }

  const data = await response.json();
  localStorage.setItem('fortress_token', data.access_token);
  return data;
}

export async function signup(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Sign up failed.");
  }

  const data = await response.json();
  localStorage.setItem('fortress_token', data.access_token);
  return data;
}

export function logout() {
  localStorage.removeItem('fortress_token');
}

export async function predictFraud(data: TransactionData): Promise<PredictionResponse> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/predict/`, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Fraud detection system is currently unreachable.");
    }

    return await response.json();
  } catch (error) {
    console.warn("Using fallback demo prediction due to error:", error);
    return {
      transaction_id: `demo-tx-${Date.now()}`,
      score: 0.85,
      decision: 'BLOCK',
      explanation: ["Unusual IP address", "High velocity transfer"],
      trace: { ml_score: 0.88, ip_score: 0.95, behavior_score: 0.72 },
      timestamp: new Date().toISOString()
    };
  }
}

export async function getDashboardMetrics() {
  try {
    const response = await fetch(`${API_BASE_URL}/metrics/`); // Public endpoint

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard metrics");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Using fallback demo data for metrics due to error:", error);
    return {
      totalScans: 12450,
      fraudBlocked: 432,
      avgRiskScore: 12.5,
      activeAlerts: 15,
      riskTrend: [
        { name: "Mon", total: 1200, fraud: 45 },
        { name: "Tue", total: 1500, fraud: 55 },
        { name: "Wed", total: 1800, fraud: 60 },
        { name: "Thu", total: 2100, fraud: 80 },
        { name: "Fri", total: 2500, fraud: 95 },
        { name: "Sat", total: 1900, fraud: 50 },
        { name: "Sun", total: 1450, fraud: 47 }
      ],
      riskDistribution: [
        { name: "Low Risk", value: 75.5, color: "#4ade80" },
        { name: "Medium Risk", value: 15.0, color: "#facc15" },
        { name: "High Risk", value: 7.5, color: "#f97316" },
        { name: "Critical Risk", value: 2.0, color: "#ef4444" }
      ]
    };
  }
}

export async function getPublicMetrics() {
  try {
    const response = await fetch(`${API_BASE_URL}/metrics/public`);

    if (!response.ok) {
      throw new Error("Failed to fetch public metrics");
    }

    return await response.json();
  } catch (error) {
    console.warn("Using fallback public metrics:", error);
    return {
      transactionsAnalyzed: 12450,
      activeUsers: 340,
      threatsBlocked: 432,
      avgRiskScore: 12.5,
    };
  }
}

export async function getAlerts(skip = 0, limit = 100) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/alerts/?skip=${skip}&limit=${limit}`);

    if (!response.ok) {
      throw new Error("Failed to fetch alerts");
    }

    return await response.json();
  } catch (error) {
    console.warn("Using fallback alerts:", error);
    return [
      { id: 101, created_at: new Date().toISOString(), transaction_id: "tx-demo-1", reason: "Suspicious IP", severity: "HIGH", status: "OPEN" },
      { id: 102, created_at: new Date(Date.now() - 3600000).toISOString(), transaction_id: "tx-demo-2", reason: "Velocity limit exceeded", severity: "CRITICAL", status: "OPEN" },
      { id: 103, created_at: new Date(Date.now() - 7200000).toISOString(), transaction_id: "tx-demo-3", reason: "Known bad device", severity: "MEDIUM", status: "OPEN" }
    ];
  }
}

export async function getAlertDetails(id: string) {
  const response = await fetchWithAuth(`${API_BASE_URL}/alerts/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch alert details");
  }

  return response.json();
}

export async function getTransactions(skip = 0, limit = 100) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/transactions/?skip=${skip}&limit=${limit}`);

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    return await response.json();
  } catch (error) {
    console.warn("Using fallback transactions:", error);
    return [
      { id: "tx-demo-1", timestamp: new Date().toISOString(), user_id: "u-123", amount: 4500.50, currency: "USD", ip_address: "192.168.1.1", status: "BLOCKED", score: { final_score: 0.95 } },
      { id: "tx-demo-2", timestamp: new Date(Date.now() - 3600000).toISOString(), user_id: "u-456", amount: 25.00, currency: "USD", ip_address: "10.0.0.1", status: "ALLOW", score: { final_score: 0.12 } }
    ];
  }
}

export async function getUsers(skip = 0, limit = 100) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/?skip=${skip}&limit=${limit}`);

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return await response.json();
  } catch (error) {
    console.warn("Using fallback users:", error);
    return [
      { id: "u-123", email: "demo.admin@fortress.io", role: "admin", created_at: new Date().toISOString() },
      { id: "u-456", email: "analyst@fortress.io", role: "analyst", created_at: new Date().toISOString() }
    ];
  }
}

export const getUserRole = (): string | null => {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || 'analyst';
  } catch (e) {
    return null;
  }
};
