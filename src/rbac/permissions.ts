// ─────────────────────────────────────────────
//  RBAC: Permission & Resource Definitions
// ─────────────────────────────────────────────

export type Action = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

export type Resource =
  | 'dashboard'
  | 'patients'
  | 'doctors'
  | 'appointments'
  | 'departments'
  | 'bed-management'
  | 'prescriptions'
  | 'pharmacy'
  | 'billing'
  | 'insurance'
  | 'opd'
  | 'inventory'
  | 'blood-bank'
  | 'pathology'
  | 'radiology'
  | 'ambulance'
  | 'birth-death'
  | 'human-resources'
  | 'duty-roster'
  | 'qr-attendance'
  | 'front-office'
  | 'tpa'
  | 'finance'
  | 'messaging'
  | 'certificates'
  | 'live-consultancy'
  | 'reports'
  | 'annual-calendar'
  | 'case-manager'
  | 'rbac-admin';   // only super-admin can manage roles

export type Permission = `${Resource}:${Action}`;

// Helper to build permission strings cleanly
export const perm = (resource: Resource, action: Action): Permission =>
  `${resource}:${action}`;

// All possible actions per resource
const ALL_ACTIONS: Action[] = ['view', 'create', 'edit', 'delete', 'approve', 'export'];
const READ_ONLY: Action[] = ['view'];
const READ_WRITE: Action[] = ['view', 'create', 'edit'];
const READ_WRITE_DELETE: Action[] = ['view', 'create', 'edit', 'delete'];

const resourcePerms = (resource: Resource, actions: Action[]): Permission[] =>
  actions.map(a => perm(resource, a));

// ─────────────────────────────────────────────
//  ROLE DEFINITIONS
// ─────────────────────────────────────────────

export type RoleId =
  | 'super_admin'
  | 'hospital_admin'
  | 'doctor'
  | 'nurse'
  | 'pharmacist'
  | 'receptionist'
  | 'lab_technician'
  | 'billing_staff'
  | 'hr_manager'
  | 'radiologist'
  | 'case_manager_role'
  | 'ambulance_staff'
  | 'tpa_executive';

export interface Role {
  id: RoleId;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  permissions: Permission[];
  isSystemRole: boolean; // system roles can't be deleted
}

export const ROLES: Record<RoleId, Role> = {
  super_admin: {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full unrestricted access to all modules including RBAC management',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    isSystemRole: true,
    permissions: [
      // All resources, all actions
      ...(['dashboard','patients','doctors','appointments','departments','bed-management',
           'prescriptions','pharmacy','billing','insurance','opd','inventory','blood-bank',
           'pathology','radiology','ambulance','birth-death','human-resources','duty-roster',
           'qr-attendance','front-office','tpa','finance','messaging','certificates',
           'live-consultancy','reports','annual-calendar','case-manager','rbac-admin'] as Resource[])
        .flatMap(r => resourcePerms(r, ALL_ACTIONS))
    ],
  },

  hospital_admin: {
    id: 'hospital_admin',
    name: 'Hospital Admin',
    description: 'Administrative access to all hospital operations except RBAC management',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    isSystemRole: true,
    permissions: [
      ...resourcePerms('dashboard', ALL_ACTIONS),
      ...resourcePerms('patients', ALL_ACTIONS),
      ...resourcePerms('doctors', ALL_ACTIONS),
      ...resourcePerms('appointments', ALL_ACTIONS),
      ...resourcePerms('departments', ALL_ACTIONS),
      ...resourcePerms('bed-management', ALL_ACTIONS),
      ...resourcePerms('prescriptions', READ_ONLY),
      ...resourcePerms('pharmacy', ALL_ACTIONS),
      ...resourcePerms('billing', ALL_ACTIONS),
      ...resourcePerms('insurance', ALL_ACTIONS),
      ...resourcePerms('opd', ALL_ACTIONS),
      ...resourcePerms('inventory', ALL_ACTIONS),
      ...resourcePerms('blood-bank', ALL_ACTIONS),
      ...resourcePerms('pathology', ALL_ACTIONS),
      ...resourcePerms('radiology', ALL_ACTIONS),
      ...resourcePerms('ambulance', ALL_ACTIONS),
      ...resourcePerms('birth-death', ALL_ACTIONS),
      ...resourcePerms('human-resources', ALL_ACTIONS),
      ...resourcePerms('duty-roster', ALL_ACTIONS),
      ...resourcePerms('qr-attendance', ALL_ACTIONS),
      ...resourcePerms('front-office', ALL_ACTIONS),
      ...resourcePerms('tpa', ALL_ACTIONS),
      ...resourcePerms('finance', ALL_ACTIONS),
      ...resourcePerms('messaging', ALL_ACTIONS),
      ...resourcePerms('certificates', ALL_ACTIONS),
      ...resourcePerms('live-consultancy', ALL_ACTIONS),
      ...resourcePerms('reports', ALL_ACTIONS),
      ...resourcePerms('annual-calendar', ALL_ACTIONS),
      ...resourcePerms('case-manager', ALL_ACTIONS),
    ],
  },

  doctor: {
    id: 'doctor',
    name: 'Doctor',
    description: 'Clinical access: patients, prescriptions, lab, consultancy, appointments',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    isSystemRole: true,
    permissions: [
      ...resourcePerms('dashboard', READ_ONLY),
      ...resourcePerms('patients', READ_WRITE),
      ...resourcePerms('appointments', READ_WRITE),
      ...resourcePerms('prescriptions', READ_WRITE_DELETE),
      ...resourcePerms('pathology', READ_WRITE),
      ...resourcePerms('radiology', READ_WRITE),
      ...resourcePerms('opd', READ_WRITE),
      ...resourcePerms('case-manager', READ_WRITE),
      ...resourcePerms('live-consultancy', READ_WRITE),
      ...resourcePerms('blood-bank', READ_ONLY),
      ...resourcePerms('messaging', READ_WRITE),
      ...resourcePerms('bed-management', READ_ONLY),
      ...resourcePerms('departments', READ_ONLY),
      ...resourcePerms('certificates', ['view', 'create']),
      ...resourcePerms('birth-death', ['view', 'create']),
      ...resourcePerms('annual-calendar', READ_ONLY),
    ],
  },

  nurse: {
    id: 'nurse',
    name: 'Nurse',
    description: 'Patient care, bed management, prescriptions view, duty roster',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    isSystemRole: true,
    permissions: [
      ...resourcePerms('dashboard', READ_ONLY),
      ...resourcePerms('patients', READ_WRITE),
      ...resourcePerms('bed-management', READ_WRITE),
      ...resourcePerms('prescriptions', READ_ONLY),
      ...resourcePerms('appointments', READ_ONLY),
      ...resourcePerms('opd', READ_WRITE),
      ...resourcePerms('blood-bank', READ_ONLY),
      ...resourcePerms('messaging', READ_WRITE),
      ...resourcePerms('duty-roster', READ_ONLY),
      ...resourcePerms('qr-attendance', ['view', 'create']),
      ...resourcePerms('annual-calendar', READ_ONLY),
      ...resourcePerms('inventory', READ_ONLY),
    ],
  },

  pharmacist: {
    id: 'pharmacist',
    name: 'Pharmacist',
    description: 'Pharmacy, prescriptions dispensing, inventory management',
    color: 'text-teal-700',
    bgColor: 'bg-teal-100',
    isSystemRole: true,
    permissions: [
      ...resourcePerms('dashboard', READ_ONLY),
      ...resourcePerms('pharmacy', ALL_ACTIONS),
      ...resourcePerms('prescriptions', ['view', 'edit', 'approve']),
      ...resourcePerms('inventory', READ_WRITE_DELETE),
      ...resourcePerms('patients', READ_ONLY),
      ...resourcePerms('messaging', READ_WRITE),
      ...resourcePerms('reports', ['view', 'export']),
    ],
  },

  receptionist: {
    id: 'receptionist',
    name: 'Receptionist',
    description: 'Front office, patient registration, appointments, OPD check-in',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    isSystemRole: true,
    permissions: [
      ...resourcePerms('dashboard', READ_ONLY),
      ...resourcePerms('front-office', READ_WRITE),
      ...resourcePerms('patients', ['view', 'create', 'edit']),
      ...resourcePerms('appointments', READ_WRITE_DELETE),
      ...resourcePerms('opd', READ_WRITE),
      ...resourcePerms('doctors', READ_ONLY),
      ...resourcePerms('departments', READ_ONLY),
      ...resourcePerms('ambulance', READ_ONLY),
      ...resourcePerms('messaging', READ_WRITE),
      ...resourcePerms('annual-calendar', READ_ONLY),
      ...resourcePerms('billing', ['view', 'create']),
    ],
  },

  lab_technician: {
    id: 'lab_technician',
    name: 'Lab Technician',
    description: 'Pathology lab management, test results, blood bank',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    isSystemRole: true,
    permissions: [
      ...resourcePerms('dashboard', READ_ONLY),
      ...resourcePerms('pathology', READ_WRITE_DELETE),
      ...resourcePerms('blood-bank', READ_WRITE),
      ...resourcePerms('patients', READ_ONLY),
      ...resourcePerms('inventory', READ_ONLY),
      ...resourcePerms('messaging', READ_WRITE),
      ...resourcePerms('reports', ['view', 'export']),
    ],
  },

  billing_staff: {
    id: 'billing_staff',
    name: 'Billing Staff',
    description: 'Billing, insurance claims, TPA processing, finance view',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    isSystemRole: true,
    permissions: [
      ...resourcePerms('dashboard', READ_ONLY),
      ...resourcePerms('billing', READ_WRITE_DELETE),
      ...resourcePerms('insurance', READ_WRITE),
      ...resourcePerms('tpa', READ_WRITE),
      ...resourcePerms('finance', READ_ONLY),
      ...resourcePerms('patients', READ_ONLY),
      ...resourcePerms('messaging', READ_WRITE),
      ...resourcePerms('reports', ['view', 'export']),
    ],
  },

  hr_manager: {
    id: 'hr_manager',
    name: 'HR Manager',
    description: 'Staff management, duty roster, attendance, annual calendar',
    color: 'text-pink-700',
    bgColor: 'bg-pink-100',
    isSystemRole: true,
    permissions: [
      ...resourcePerms('dashboard', READ_ONLY),
      ...resourcePerms('human-resources', ALL_ACTIONS),
      ...resourcePerms('duty-roster', ALL_ACTIONS),
      ...resourcePerms('qr-attendance', ALL_ACTIONS),
      ...resourcePerms('annual-calendar', ALL_ACTIONS),
      ...resourcePerms('messaging', READ_WRITE),
      ...resourcePerms('reports', ['view', 'export']),
      ...resourcePerms('finance', READ_ONLY),
    ],
  },

  radiologist: {
    id: 'radiologist',
    name: 'Radiologist',
    description: 'Radiology scans, pathology view, patient records view',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-100',
    isSystemRole: true,
    permissions: [
      ...resourcePerms('dashboard', READ_ONLY),
      ...resourcePerms('radiology', READ_WRITE_DELETE),
      ...resourcePerms('pathology', READ_ONLY),
      ...resourcePerms('patients', READ_ONLY),
      ...resourcePerms('messaging', READ_WRITE),
      ...resourcePerms('reports', ['view', 'export']),
    ],
  },

  case_manager_role: {
    id: 'case_manager_role',
    name: 'Case Manager',
    description: 'Complex case tracking, patient coordination, cross-department view',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    isSystemRole: false,
    permissions: [
      ...resourcePerms('dashboard', READ_ONLY),
      ...resourcePerms('case-manager', READ_WRITE_DELETE),
      ...resourcePerms('patients', READ_WRITE),
      ...resourcePerms('appointments', READ_WRITE),
      ...resourcePerms('prescriptions', READ_ONLY),
      ...resourcePerms('pathology', READ_ONLY),
      ...resourcePerms('radiology', READ_ONLY),
      ...resourcePerms('messaging', READ_WRITE),
      ...resourcePerms('departments', READ_ONLY),
      ...resourcePerms('doctors', READ_ONLY),
      ...resourcePerms('bed-management', READ_ONLY),
    ],
  },

  ambulance_staff: {
    id: 'ambulance_staff',
    name: 'Ambulance Staff',
    description: 'Ambulance fleet management, emergency coordination',
    color: 'text-rose-700',
    bgColor: 'bg-rose-100',
    isSystemRole: false,
    permissions: [
      ...resourcePerms('dashboard', READ_ONLY),
      ...resourcePerms('ambulance', READ_WRITE),
      ...resourcePerms('patients', READ_ONLY),
      ...resourcePerms('messaging', READ_WRITE),
      ...resourcePerms('duty-roster', READ_ONLY),
    ],
  },

  tpa_executive: {
    id: 'tpa_executive',
    name: 'TPA Executive',
    description: 'TPA claims processing, insurance coordination, billing view',
    color: 'text-violet-700',
    bgColor: 'bg-violet-100',
    isSystemRole: false,
    permissions: [
      ...resourcePerms('dashboard', READ_ONLY),
      ...resourcePerms('tpa', READ_WRITE_DELETE),
      ...resourcePerms('insurance', READ_WRITE),
      ...resourcePerms('billing', READ_ONLY),
      ...resourcePerms('patients', READ_ONLY),
      ...resourcePerms('messaging', READ_WRITE),
      ...resourcePerms('reports', ['view', 'export']),
    ],
  },
};
