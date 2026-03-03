import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from './users';
import { USERS } from './users';
import { ROLES, type Permission, type Resource, type Action, type RoleId } from './permissions';

// ─── Audit Log ──────────────────────────────
export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  detail: string;
  result: 'success' | 'denied' | 'info';
  ip: string;
}

// ─── Context Types ───────────────────────────
interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  can: (resource: Resource, action: Action) => boolean;
  canPage: (page: string) => boolean;
  hasRole: (roleId: RoleId) => boolean;
  auditLog: AuditEntry[];
  addAudit: (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'userId' | 'userName' | 'ip'>) => void;
  // User management (super_admin only)
  users: User[];
  updateUserRole: (userId: string, roleId: RoleId) => void;
  toggleUserActive: (userId: string) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'failedAttempts'>) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MAX_FAILED = 5;
const LOCKOUT_MINUTES = 15;

const INITIAL_AUDIT: AuditEntry[] = [
  { id: 'A001', timestamp: '2024-03-15T07:58:00', userId: 'U001', userName: 'Super Administrator', action: 'LOGIN', resource: 'system', detail: 'Successful login', result: 'success', ip: '192.168.1.100' },
  { id: 'A002', timestamp: '2024-03-15T08:05:00', userId: 'U002', userName: 'Dr. Arun Mehta', action: 'VIEW', resource: 'patients', detail: 'Viewed patient P001', result: 'success', ip: '192.168.1.101' },
  { id: 'A003', timestamp: '2024-03-15T08:10:00', userId: 'U006', userName: 'Fatima Begum', action: 'ACCESS_DENIED', resource: 'finance', detail: 'Unauthorized access attempt', result: 'denied', ip: '192.168.1.105' },
  { id: 'A004', timestamp: '2024-03-15T08:15:00', userId: 'U005', userName: 'Deepa Menon', action: 'EDIT', resource: 'prescriptions', detail: 'Dispensed prescription RX001', result: 'success', ip: '192.168.1.104' },
  { id: 'A005', timestamp: '2024-03-15T08:30:00', userId: 'U010', userName: 'Admin Ops', action: 'CREATE', resource: 'patients', detail: 'Registered new patient', result: 'success', ip: '192.168.1.110' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(USERS);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(INITIAL_AUDIT);

  const addAudit = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp' | 'userId' | 'userName' | 'ip'>) => {
    setAuditLog(prev => [{
      ...entry,
      id: `A${String(Date.now()).slice(-6)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id ?? 'unknown',
      userName: currentUser?.name ?? 'Unknown',
      ip: `192.168.1.${Math.floor(Math.random() * 200) + 50}`,
    }, ...prev]);
  }, [currentUser]);

  const login = useCallback((email: string, password: string): { ok: boolean; error?: string } => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { ok: false, error: 'Invalid email or password.' };
    }
    if (!user.isActive) {
      return { ok: false, error: 'Account is deactivated. Contact administrator.' };
    }
    // Check lockout
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const mins = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000);
      return { ok: false, error: `Account locked. Try again in ${mins} minute(s).` };
    }
    if (user.password !== password) {
      const attempts = user.failedAttempts + 1;
      const locked = attempts >= MAX_FAILED;
      setUsers(prev => prev.map(u => u.id === user.id ? {
        ...u,
        failedAttempts: attempts,
        lockedUntil: locked ? new Date(Date.now() + LOCKOUT_MINUTES * 60000).toISOString() : undefined,
      } : u));
      if (locked) return { ok: false, error: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.` };
      return { ok: false, error: `Invalid password. ${MAX_FAILED - attempts} attempt(s) remaining.` };
    }

    // Success
    const updatedUser = { ...user, failedAttempts: 0, lockedUntil: undefined, lastLogin: new Date().toISOString() };
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    setCurrentUser(updatedUser);

    setAuditLog(prev => [{
      id: `A${String(Date.now()).slice(-6)}`,
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      action: 'LOGIN',
      resource: 'system',
      detail: `Successful login as ${ROLES[user.roleId].name}`,
      result: 'success',
      ip: `192.168.1.${Math.floor(Math.random() * 200) + 50}`,
    }, ...prev]);

    return { ok: true };
  }, [users]);

  const logout = useCallback(() => {
    if (currentUser) {
      addAudit({ action: 'LOGOUT', resource: 'system', detail: 'User logged out', result: 'info' });
    }
    setCurrentUser(null);
  }, [currentUser, addAudit]);

  const can = useCallback((resource: Resource, action: Action): boolean => {
    if (!currentUser) return false;
    const role = ROLES[currentUser.roleId];
    if (!role) return false;
    return role.permissions.includes(`${resource}:${action}`);
  }, [currentUser]);

  // Map page IDs to resources (they're the same in this app)
  const canPage = useCallback((page: string): boolean => {
    if (!currentUser) return false;
    if (page === 'dashboard') return true;
    const role = ROLES[currentUser.roleId];
    return role.permissions.some(p => p.startsWith(`${page}:`));
  }, [currentUser]);

  const hasRole = useCallback((roleId: RoleId): boolean => {
    return currentUser?.roleId === roleId;
  }, [currentUser]);

  // User management
  const updateUserRole = useCallback((userId: string, roleId: RoleId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, roleId } : u));
    addAudit({ action: 'ROLE_CHANGE', resource: 'rbac-admin', detail: `Changed role of user ${userId} to ${roleId}`, result: 'success' });
  }, [addAudit]);

  const toggleUserActive = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
    addAudit({ action: 'USER_STATUS', resource: 'rbac-admin', detail: `Toggled active status for user ${userId}`, result: 'success' });
  }, [addAudit]);

  const addUser = useCallback((user: Omit<User, 'id' | 'createdAt' | 'failedAttempts'>) => {
    const newUser: User = {
      ...user,
      id: `U${String(Date.now()).slice(-3)}`,
      createdAt: new Date().toISOString(),
      failedAttempts: 0,
    };
    setUsers(prev => [...prev, newUser]);
    addAudit({ action: 'CREATE_USER', resource: 'rbac-admin', detail: `Created user ${newUser.name}`, result: 'success' });
  }, [addAudit]);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    addAudit({ action: 'DELETE_USER', resource: 'rbac-admin', detail: `Deleted user ${userId}`, result: 'success' });
  }, [addAudit]);

  return (
    <AuthContext.Provider value={{
      currentUser, isAuthenticated: !!currentUser,
      login, logout, can, canPage, hasRole,
      auditLog, addAudit,
      users, updateUserRole, toggleUserActive, addUser, deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
