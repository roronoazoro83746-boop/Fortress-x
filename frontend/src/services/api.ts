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

/**
 * Fetch simulated metrics for the dashboard
 */
export async function getDashboardMetrics() {
  // In a real app, this would be an endpoint like /api/v1/metrics
  return {
    totalScans: 1284592,
    fraudBlocked: 42103,
    avgRiskScore: 14.2,
    activeAlerts: 8,
    riskTrend: [30, 45, 60, 25, 40, 55, 70],
    topRiskyIPs: [
      { ip: "192.168.1.45", severity: "CRITICAL" },
      { ip: "203.0.113.88", severity: "REVIEW" },
      { ip: "185.22.41.90", severity: "HIGH" },
    ]
  };
}
