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

export interface RegisterPayload {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface Profile {
  age: number | null;
  blood_group: string;
  height_cm: number | null;
  weight_kg: number | null;
  conditions: string[];
  allergies: string[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Prescriptions
// ---------------------------------------------------------------------------
export interface PrescriptionMedicine {
  id: string;
  name: string;
  salt: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  confidence: number | null;
}

export type PrescriptionStatus = "processing" | "ready";
export type PrescriptionSource = "scan" | "camera" | "pdf" | "manual";

export interface Prescription {
  id: string;
  doctor_name: string;
  speciality: string;
  clinic: string;
  prescribed_on: string | null;
  status: PrescriptionStatus;
  source: PrescriptionSource;
  notes: string;
  medicines: PrescriptionMedicine[];
  created_at: string;
  updated_at: string;
}

export interface PrescriptionOcrDraft {
  ocr_available: boolean;
  raw_text: string;
  doctor_name: string;
  speciality: string;
  clinic: string;
  prescribed_on: string | null;
  medicines: PrescriptionMedicine[];
}

// ---------------------------------------------------------------------------
// Medicines
// ---------------------------------------------------------------------------
export interface GenericAlternative {
  id: string;
  name: string;
  manufacturer: string;
  price: string | null;
  save_percent: number | null;
}

export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  smiles?: string;
  manufacturer: string;
  form: string;
  strength: string;
  category: string;
  rx_required: boolean;
  in_stock: boolean;
  price: string | null;
  how_it_works: string;
  uses: string[];
  side_effects: string[];
  warnings: string[];
  alternatives?: GenericAlternative[];
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
  medicine_a_name?: string;
  medicine_b_name?: string;
  severity: string;
  title?: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ModelPrediction {
  medicine_a: string;
  medicine_b: string;
  medicine_a_name: string;
  medicine_b_name: string;
  probability: number;
  severity: string;
}

export interface InteractionCheckResponse {
  count: number;
  by_severity: Record<string, number>;
  interactions: DrugInteraction[];
  model_available: boolean;
  model_predictions: ModelPrediction[];
}

// ---------------------------------------------------------------------------
// Reminders
// ---------------------------------------------------------------------------
export type ReminderBucketValue = "morning" | "afternoon" | "evening" | "night";

export interface Reminder {
  id: string;
  medicine_name: string;
  dosage: string;
  scheduled_time: string;
  bucket: ReminderBucketValue;
  instruction: string;
  is_taken: boolean;
  taken_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReminderTodayBucket {
  bucket: ReminderBucketValue;
  label: string;
  taken: number;
  total: number;
  reminders: Reminder[];
}

export interface ReminderTodayResponse {
  progress: { taken: number; total: number; percent: number };
  buckets: ReminderTodayBucket[];
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export interface DashboardStats {
  active_medicines: number;
  doses_taken_today: number;
  doses_total_today: number;
  adherence_percent: number;
  prescriptions_count: number;
  recent_prescriptions: Prescription[];
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
