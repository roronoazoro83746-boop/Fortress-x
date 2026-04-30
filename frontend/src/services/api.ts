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

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getAuthToken()}`,
});

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
  const response = await fetch(`${API_BASE_URL}/predict/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Fraud detection system is currently unreachable.");
  }

  return response.json();
}

export async function getDashboardMetrics() {
  const response = await fetch(`${API_BASE_URL}/metrics/`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard metrics");
  }

  return response.json();
}

export async function getPublicMetrics() {
  const response = await fetch(`${API_BASE_URL}/metrics/public`);

  if (!response.ok) {
    throw new Error("Failed to fetch public metrics");
  }

  return response.json();
}

export async function getAlerts(skip = 0, limit = 100) {
  const response = await fetch(`${API_BASE_URL}/alerts/?skip=${skip}&limit=${limit}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }

  return response.json();
}

export async function getAlertDetails(id: string) {
  const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch alert details");
  }

  return response.json();
}
