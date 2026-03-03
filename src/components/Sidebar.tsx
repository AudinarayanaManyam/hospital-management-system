import { 
  LayoutDashboard, Users, Stethoscope, Calendar, Building2, Bed, 
  FileText, Pill, Receipt, Shield, Activity, Package, Droplets,
  FlaskConical, Scan, Truck, BookOpen, UserCog, Clock, QrCode,
  MonitorPlay, CreditCard, DollarSign, MessageSquare, Award, Video,
  BarChart3, CalendarDays, Briefcase, ChevronLeft, Menu, Cross, Lock
} from 'lucide-react';
import type { PageType } from '../App';
import { useAuth } from '../rbac/AuthContext';
import { ROLES } from '../rbac/permissions';

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuGroups = [
  {
    title: 'Core',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'front-office', label: 'Front Office', icon: MonitorPlay },
      { id: 'patients', label: 'Patients', icon: Users },
      { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    ]
  },
  {
    title: 'Clinical',
    items: [
      { id: 'appointments', label: 'Appointments', icon: Calendar },
      { id: 'opd', label: 'OPD In/Out', icon: Activity },
      { id: 'case-manager', label: 'Case Manager', icon: Briefcase },
      { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
      { id: 'live-consultancy', label: 'Live Consultancy', icon: Video },
    ]
  },
  {
    title: 'Hospital',
    items: [
      { id: 'departments', label: 'Departments', icon: Building2 },
      { id: 'bed-management', label: 'Bed Manager', icon: Bed },
      { id: 'ambulance', label: 'Ambulance', icon: Truck },
    ]
  },
  {
    title: 'Diagnostics',
    items: [
      { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
      { id: 'pathology', label: 'Pathology', icon: FlaskConical },
      { id: 'radiology', label: 'Radiology', icon: Scan },
      { id: 'blood-bank', label: 'Blood Bank', icon: Droplets },
    ]
  },
  {
    title: 'Finance',
    items: [
      { id: 'billing', label: 'Billing', icon: Receipt },
      { id: 'insurance', label: 'Insurance', icon: Shield },
      { id: 'tpa', label: 'TPA Management', icon: CreditCard },
      { id: 'finance', label: 'Finance', icon: DollarSign },
    ]
  },
  {
    title: 'Administration',
    items: [
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'human-resources', label: 'Human Resources', icon: UserCog },
      { id: 'duty-roster', label: 'Duty Roster', icon: Clock },
      { id: 'qr-attendance', label: 'QR Attendance', icon: QrCode },
      { id: 'annual-calendar', label: 'Annual Calendar', icon: CalendarDays },
    ]
  },
  {
    title: 'Records & Docs',
    items: [
      { id: 'birth-death', label: 'Birth & Death', icon: BookOpen },
      { id: 'certificates', label: 'Certificates', icon: Award },
      { id: 'messaging', label: 'Messaging', icon: MessageSquare },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
    ]
  },
  {
    title: 'Security',
    items: [
      { id: 'rbac-admin', label: 'RBAC Admin', icon: Lock },
    ]
  }
];

export default function Sidebar({ currentPage, onNavigate, isOpen, onToggle }: SidebarProps) {
  const { currentUser, canPage } = useAuth();
  const role = currentUser ? ROLES[currentUser.roleId] : null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onToggle} />
      )}

      <aside className={`
        fixed lg:relative z-30 h-screen flex flex-col bg-slate-900 text-white transition-all duration-300
        ${isOpen ? 'w-64' : 'w-16'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <Cross className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-sm text-white font-display">MediCore</div>
                <div className="text-xs text-slate-400">HMS + RBAC</div>
              </div>
            </div>
          )}
          <button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors">
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Role badge when expanded */}
        {/* {isOpen && role && (
          <div className="px-4 py-2 border-b border-slate-700">
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${role.bgColor} ${role.color}`}>
              <Lock className="w-3 h-3" />
              {role.name}
            </div>
          </div>
        )} */}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {menuGroups.map((group) => {
            // Filter items the user can see
            const visibleItems = group.items.filter(item =>
              item.id === 'dashboard' || canPage(item.id)
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="mb-2">
                {isOpen && (
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 py-2">
                    {group.title}
                  </div>
                )}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  const isRBAC = item.id === 'rbac-admin';
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id as PageType)}
                      title={!isOpen ? item.label : undefined}
                      className={`
                        w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150 mb-0.5
                        ${isActive
                          ? isRBAC ? 'bg-red-600 text-white' : 'bg-primary-600 text-white'
                          : isRBAC ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }
                        ${!isOpen ? 'justify-center' : ''}
                      `}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {isOpen && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {isOpen && currentUser && (
          <div className="p-3 border-t border-slate-700">
            <div className="flex items-center gap-2 px-2">
              <div className={`w-7 h-7 rounded-full ${role?.bgColor} ${role?.color} flex items-center justify-center text-xs font-bold`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
