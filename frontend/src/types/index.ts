// ---------------------------------------------------------------------------
// Shared API response envelope
// ---------------------------------------------------------------------------
export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  error: {
    status_code: number;
    detail: Record<string, unknown> | string;
  };
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export interface TokenPair {
  access: string;
  refresh: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Prescriptions
// ---------------------------------------------------------------------------
export interface Prescription {
  id: string;
  user: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Medicines
// ---------------------------------------------------------------------------
export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Drug Interactions
// ---------------------------------------------------------------------------
export interface DrugInteraction {
  id: string;
  medicine_a: string;
  medicine_b: string;
  severity: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Reminders
// ---------------------------------------------------------------------------
export interface Reminder {
  id: string;
  user: string;
  message: string;
  scheduled_at: string;
  is_sent: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// AI Assistant
// ---------------------------------------------------------------------------
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
}
