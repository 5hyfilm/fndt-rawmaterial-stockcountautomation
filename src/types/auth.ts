// Path: src/types/auth.ts
// ✅ Consolidated Employee Types - Single Source of Truth

// =========================================
// 🔑 Core Employee Entity
// =========================================

/**
 * Unified Employee interface - Single source of truth
 * Covers all employee data needs across authentication, forms, and sessions
 */
export interface Employee {
  // Core identification
  id?: string;
  name: string; // Primary name field (was employeeName)
  branchCode: string;
  branchName: string;

  // Optional metadata
  role?: UserRole;
  department?: string;
  createdAt?: Date;
  lastLoginAt?: Date;
  timestamp?: string; // For backward compatibility
}

/**
 * Branch information interface
 */
export interface Branch {
  code: string;
  name: string;
  region?: string;
  address?: string;
  isActive?: boolean;
}

// =========================================
// 🎯 Utility Types from Employee
// =========================================

/**
 * Form data type - only required fields for authentication
 */
export type EmployeeFormData = Pick<
  Employee,
  "name" | "branchCode" | "branchName"
>;

/**
 * Legacy compatibility - maps to Employee
 * @deprecated Use Employee instead
 */
export type EmployeeInfo = Employee;

/**
 * Core employee data without optional fields
 */
export type EmployeeCore = Required<
  Pick<Employee, "name" | "branchCode" | "branchName">
>;

/**
 * Employee creation data
 */
export type EmployeeCreateData = Omit<
  Employee,
  "id" | "createdAt" | "lastLoginAt"
>;

/**
 * Employee update data
 */
export type EmployeeUpdateData = Partial<
  Pick<Employee, "name" | "branchCode" | "branchName" | "role" | "department">
>;

// =========================================
// 🛡️ Session & Authentication States
// =========================================

/**
 * User session information
 */
export interface EmployeeSession {
  employee: Employee;
  sessionId: string;
  loginTime: string;
  expiresAt?: Date;
  refreshToken?: string;
}

/**
 * Authentication state management
 */
export interface SessionState {
  isAuthenticated: boolean;
  employee: Employee | null;
  sessionId?: string;
  loginTime?: Date;
  expiresAt?: Date;
  isLoading: boolean;
}

/**
 * Login process state
 */
export interface LoginState {
  isLoading: boolean;
  error: string | null;
  attemptCount: number;
  lastAttemptAt?: Date;
  isBlocked?: boolean;
}

// =========================================
// 📝 Form Types & Validation
// =========================================

/**
 * Employee form component props
 */
export interface EmployeeFormProps {
  onSubmit: (data: EmployeeFormData) => void | Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  initialValues?: Partial<EmployeeFormData>;
  autoFocus?: boolean;
  showAdvancedOptions?: boolean;
}

/**
 * Form validation errors
 */
export interface FormValidationErrors {
  name?: string; // Updated from employeeName
  branchCode?: string;
  branchName?: string;
  general?: string;
}

/**
 * Form field validation state
 */
export interface FieldValidation {
  isValid: boolean;
  error?: string;
  touched: boolean;
}

/**
 * Complete form validation state
 */
export interface FormValidationState {
  name: FieldValidation; // Updated from employeeName
  branchCode: FieldValidation;
  branchName: FieldValidation;
  isFormValid: boolean;
}

// =========================================
// 🔐 Permissions & Authorization
// =========================================

/**
 * User role definitions
 */
export type UserRole = "admin" | "manager" | "employee" | "viewer";

/**
 * Permission flags for different actions
 */
export interface AccessPermissions {
  canAddInventory: boolean;
  canEditInventory: boolean;
  canDeleteInventory: boolean;
  canViewInventory: boolean;
  canExportData: boolean;
  canImportData: boolean;
  canClearAllData: boolean;
  canManageUsers: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
}

/**
 * Role-based permission mapping
 */
export type RolePermissions = Record<UserRole, AccessPermissions>;

// =========================================
// 🎯 Context & Hook Types
// =========================================

/**
 * Authentication context value
 */
export interface AuthContextValue {
  session: SessionState;
  employee: Employee | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  permissions: AccessPermissions;

  login: (data: EmployeeFormData) => Promise<boolean>;
  logout: () => void;
  updateEmployeeInfo: (data: Partial<Employee>) => Promise<boolean>;
  clearError: () => void;

  isSessionValid: () => boolean;
  getTimeRemaining: () => number;
  formatTimeRemaining: () => string;
  hasPermission: (permission: keyof AccessPermissions) => boolean;
}

/**
 * useEmployeeAuth hook return type
 */
export interface UseEmployeeAuthReturn extends AuthContextValue {
  employeeName: string; // Alias for employee.name
  branchCode: string;
  branchName: string;
  sessionInfo: SessionInfo | null;
  checkExistingSession: () => void;
  clearAllLocalStorage: () => boolean;
}

// =========================================
// 📊 Utility & Helper Types
// =========================================

/**
 * Session information for export/reporting
 */
export interface SessionInfo {
  employeeName: string; // Keep for backward compatibility
  branchCode: string;
  branchName: string;
  sessionId: string;
  loginTime: string;
  sessionDuration: number;
  timeRemaining: number;
}

/**
 * Login view component props
 */
export interface LoginViewProps {
  onSubmit: (employeeInfo: Employee) => Promise<void>; // Updated to Employee
  isLoading?: boolean;
  error?: string | null;
  initialValues?: Partial<EmployeeFormData>;
  autoFocus?: boolean;
  showAdvancedOptions?: boolean;
}

// =========================================
// 🔄 Migration Helpers
// =========================================

/**
 * Legacy EmployeeInfo structure for migration
 */
export interface LegacyEmployeeInfo {
  employeeName: string;
  branchCode: string;
  branchName: string;
  timestamp: string;
}

/**
 * Convert legacy EmployeeInfo to Employee
 */
export const employeeInfoToEmployee = (info: LegacyEmployeeInfo): Employee => ({
  name: info.employeeName,
  branchCode: info.branchCode,
  branchName: info.branchName,
  timestamp: info.timestamp,
});

/**
 * Convert Employee to legacy EmployeeInfo format
 */
export const employeeToEmployeeInfo = (
  employee: Employee
): LegacyEmployeeInfo => ({
  employeeName: employee.name,
  branchCode: employee.branchCode,
  branchName: employee.branchName,
  timestamp: employee.timestamp || new Date().toISOString(),
});

// =========================================
// 🎯 Default Configurations
// =========================================

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  admin: {
    canAddInventory: true,
    canEditInventory: true,
    canDeleteInventory: true,
    canViewInventory: true,
    canExportData: true,
    canImportData: true,
    canClearAllData: true,
    canManageUsers: true,
    canViewReports: true,
    canManageSettings: true,
  },
  manager: {
    canAddInventory: true,
    canEditInventory: true,
    canDeleteInventory: true,
    canViewInventory: true,
    canExportData: true,
    canImportData: true,
    canClearAllData: false,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
  },
  employee: {
    canAddInventory: true,
    canEditInventory: true,
    canDeleteInventory: false,
    canViewInventory: true,
    canExportData: true,
    canImportData: false,
    canClearAllData: false,
    canManageUsers: false,
    canViewReports: false,
    canManageSettings: false,
  },
  viewer: {
    canAddInventory: false,
    canEditInventory: false,
    canDeleteInventory: false,
    canViewInventory: true,
    canExportData: false,
    canImportData: false,
    canClearAllData: false,
    canManageUsers: false,
    canViewReports: false,
    canManageSettings: false,
  },
};

export const INITIAL_FORM_VALIDATION: FormValidationState = {
  name: { isValid: false, touched: false }, // Updated from employeeName
  branchCode: { isValid: false, touched: false },
  branchName: { isValid: false, touched: false },
  isFormValid: false,
};
