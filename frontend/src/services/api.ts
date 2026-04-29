/**
 * Fortress X API Service
 * Handles communication with the FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const API_KEY = import.meta.env.VITE_API_KEY || "fortress-secret";

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

export async function predictFraud(data: TransactionData): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
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
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard metrics");
  }

  return response.json();
}

export async function getAlerts(skip = 0, limit = 100) {
  const response = await fetch(`${API_BASE_URL}/alerts/?skip=${skip}&limit=${limit}`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }

  return response.json();
}

export async function getAlertDetails(id: string) {
  const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch alert details");
  }

  return response.json();
}
