import axios from "axios";

export type RoleName = "ADMINISTRATOR" | "MANAGER" | "CHEF" | "WAITER";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ShiftStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";

export interface AuthEmployeeProfile {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  hireDate: string;
  employmentStatus: "ACTIVE" | "INACTIVE" | "TERMINATED";
}

export interface AuthUser {
  userId: number;
  username: string;
  role: {
    roleId?: number;
    roleName: RoleName;
    description?: string | null;
  };
  employee: AuthEmployeeProfile;
}

export interface EmployeeRecord extends AuthEmployeeProfile {
  user?: {
    username: string;
    role: {
      roleId: number;
      roleName: RoleName;
      description?: string | null;
    };
  } | null;
}

export interface CategoryRecord {
  categoryId: number;
  categoryName: string;
  description?: string | null;
}

export interface InventoryRecord {
  itemId: number;
  itemName: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  categoryId: number;
  category?: CategoryRecord | null;
}

export interface ScheduleRecord {
  scheduleId: number;
  employeeId: number;
  workDate: string;
  shiftStart: string;
  shiftEnd: string;
  shiftStatus: ShiftStatus;
  employee?: EmployeeRecord | null;
}

export interface LeaveRecord {
  leaveRequestId: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  employee?: EmployeeRecord | null;
}

export interface DashboardResponse {
  profile: AuthEmployeeProfile;
  role: RoleName;
  schedule: {
    today: ScheduleRecord | null;
    previous: ScheduleRecord | null;
    next: ScheduleRecord | null;
    coworkersOnDuty: ScheduleRecord[];
  };
  leaveRequests: LeaveRecord[];
  alerts: string[];
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rms_token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authKeys = {
  token: "rms_token",
  user: "rms_user",
};

export function readStoredAuth() {
  const token = localStorage.getItem(authKeys.token);
  const rawUser = localStorage.getItem(authKeys.user);

  if (!token || !rawUser) {
    return null;
  }

  try {
    return {
      token,
      user: JSON.parse(rawUser) as AuthUser,
    };
  } catch {
    return null;
  }
}

export function persistAuth(token: string, user: AuthUser) {
  localStorage.setItem(authKeys.token, token);
  localStorage.setItem(authKeys.user, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(authKeys.token);
  localStorage.removeItem(authKeys.user);
}

export default api;