/**
 * LifeOS AI — API client with authentication support.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lifeos_token");
}

function setToken(token: string): void {
  localStorage.setItem("lifeos_token", token);
}

function removeToken(): void {
  localStorage.removeItem("lifeos_token");
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((customHeaders as Record<string, string>) || {}),
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(response.status, response.statusText, data);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// --- Auth ---

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export const auth = {
  async register(email: string, password: string, name: string): Promise<UserResponse> {
    return request<UserResponse>("/auth/register", {
      method: "POST",
      body: { email, password, name },
    });
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await request<LoginResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setToken(data.access_token);
    return data;
  },

  logout(): void {
    removeToken();
  },

  isAuthenticated(): boolean {
    return !!getToken();
  },

  async me(): Promise<UserResponse> {
    return request<UserResponse>("/auth/me");
  },
};

// --- Goals ---

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: string;
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

export const goals = {
  async list(): Promise<Goal[]> {
    return request<Goal[]>("/goals");
  },

  async create(data: { title: string; description?: string; target_date?: string }): Promise<Goal> {
    return request<Goal>("/goals", { method: "POST", body: data });
  },

  async update(id: string, data: Partial<Goal>): Promise<Goal> {
    return request<Goal>(`/goals/${id}`, { method: "PUT", body: data });
  },

  async remove(id: string): Promise<void> {
    return request<void>(`/goals/${id}`, { method: "DELETE" });
  },
};

// --- Tasks ---

export interface Task {
  id: string;
  goal_id: string | null;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string | null;
  estimated_hours: number | null;
  created_at: string;
  updated_at: string;
}

export const tasks = {
  async list(goalId?: string): Promise<Task[]> {
    const query = goalId ? `?goal_id=${goalId}` : "";
    return request<Task[]>(`/tasks${query}`);
  },

  async create(data: {
    title: string;
    description?: string;
    goal_id?: string;
    priority?: string;
    deadline?: string;
    estimated_hours?: number;
  }): Promise<Task> {
    return request<Task>("/tasks", { method: "POST", body: data });
  },

  async update(id: string, data: Partial<Task>): Promise<Task> {
    return request<Task>(`/tasks/${id}`, { method: "PUT", body: data });
  },

  async remove(id: string): Promise<void> {
    return request<void>(`/tasks/${id}`, { method: "DELETE" });
  },
};

// --- Insights ---

export interface Insight {
  id: string;
  type: string;
  severity: string;
  title: string;
  explanation: string;
  evidence: string[];
  recommended_action: string;
  status: string;
  created_at: string;
}

export const insights = {
  async list(): Promise<Insight[]> {
    return request<Insight[]>("/insights");
  },

  async generate(): Promise<Insight[]> {
    return request<Insight[]>("/insights/generate", { method: "POST" });
  },

  async dismiss(id: string): Promise<void> {
    return request<void>(`/insights/${id}/dismiss`, { method: "POST" });
  },

  async snooze(id: string): Promise<void> {
    return request<void>(`/insights/${id}/snooze`, { method: "POST" });
  },

  async markUseful(id: string, useful: boolean): Promise<void> {
    return request<void>(`/insights/${id}/feedback`, {
      method: "POST",
      body: { useful },
    });
  },
};

// --- Privacy ---

export interface PrivacySource {
  name: string;
  connected: boolean;
  data_stored: string;
  data_sent_to_ai: string;
}

export const privacy = {
  async sources(): Promise<PrivacySource[]> {
    return request<PrivacySource[]>("/privacy/sources");
  },

  async exportData(): Promise<Blob> {
    const token = getToken();
    const response = await fetch(`${API_URL}/privacy/export`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.blob();
  },

  async deleteAccount(): Promise<void> {
    return request<void>("/privacy/account", { method: "DELETE" });
  },
};

// --- Health ---

export const health = {
  async check(): Promise<{ status: string; service: string; version: string }> {
    return request("/health");
  },
};

export { ApiError, getToken, setToken, removeToken };
