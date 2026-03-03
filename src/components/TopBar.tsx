import { useAuth } from '../rbac/AuthContext';
import { ROLES } from '../rbac/permissions';
import { Menu, Bell, LogOut, Shield, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { PageType } from '../App';

interface TopBarProps {
  currentPage: PageType;
  onToggleSidebar: () => void;
}

const PAGE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard', patients: 'Patients', doctors: 'Doctors',
  appointments: 'Appointments', departments: 'Departments', 'bed-management': 'Bed Management',
  prescriptions: 'Prescriptions', pharmacy: 'Pharmacy', billing: 'Billing',
  insurance: 'Insurance', opd: 'OPD In/Out', inventory: 'Inventory',
  'blood-bank': 'Blood Bank', pathology: 'Pathology', radiology: 'Radiology',
  ambulance: 'Ambulance', 'birth-death': 'Birth & Death', 'human-resources': 'Human Resources',
  'duty-roster': 'Duty Roster', 'qr-attendance': 'QR Attendance', 'front-office': 'Front Office',
  tpa: 'TPA Management', finance: 'Finance', messaging: 'Messaging', certificates: 'Certificates',
  'live-consultancy': 'Live Consultancy', reports: 'Reports', 'annual-calendar': 'Annual Calendar',
  'case-manager': 'Case Manager', 'rbac-admin': 'RBAC Administration',
};

export default function TopBar({ currentPage, onToggleSidebar }: TopBarProps) {
  const { currentUser, logout, auditLog } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const unreadAlerts = auditLog.filter(a => a.result === 'denied').slice(0, 5).length;

  if (!currentUser) return null;
  const role = ROLES[currentUser.roleId];

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 z-10">
      <div className="flex items-center gap-3">
        {/* <button onClick={onToggleSidebar} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          <Menu className="w-5 h-5" />
        </button> */}
        <div className="text-sm">
          <span className="text-gray-400">MediCore</span>
          <span className="text-gray-300 mx-1">/</span>
          <span className="font-medium text-gray-700">{PAGE_LABELS[currentPage] ?? currentPage}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Alerts */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <Bell className="w-4 h-4" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadAlerts}
            </span>
          )}
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(p => !p)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${role.bgColor} ${role.color}`}>
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-800 leading-none">{currentUser.name}</div>
              <div className={`text-xs font-medium ${role.color} leading-none mt-0.5`}>{role.name}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              {/* Profile header */}
              <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${role.bgColor} ${role.color} flex items-center justify-center font-bold text-xl`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{currentUser.name}</div>
                    <div className="text-xs text-gray-300">{currentUser.email}</div>
                    <div className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${role.bgColor} ${role.color}`}>{role.name}</div>
                  </div>
                </div>
              </div>

              <div className="p-3 space-y-0.5">
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Permissions:</span>
                  <span className="text-primary-600 font-bold">{ROLES[currentUser.roleId].permissions.length}</span>
                </div>
                {currentUser.department && (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Dept: {currentUser.department}</span>
                  </div>
                )}
                {currentUser.lastLogin && (
                  <div className="px-3 py-2 text-xs text-gray-400">
                    Last login: {new Date(currentUser.lastLogin).toLocaleString('en-IN')}
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => { setShowProfile(false); logout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside */}
      {showProfile && <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />}
    </header>
  );
}
