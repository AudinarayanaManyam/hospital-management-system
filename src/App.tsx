import { useState } from 'react';
import { AuthProvider, useAuth } from './rbac/AuthContext';
import LoginPage from './rbac/LoginPage';
import AccessDenied from './rbac/AccessDenied';
import RBACAdmin from './rbac/RBACAdmin';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Departments from './pages/Departments';
import BedManagement from './pages/BedManagement';
import Prescriptions from './pages/Prescriptions';
import Pharmacy from './pages/Pharmacy';
import Billing from './pages/Billing';
import Insurance from './pages/Insurance';
import OPD from './pages/OPD';
import Inventory from './pages/Inventory';
import BloodBank from './pages/BloodBank';
import Pathology from './pages/Pathology';
import Radiology from './pages/Radiology';
import Ambulance from './pages/Ambulance';
import BirthDeath from './pages/BirthDeath';
import HumanResources from './pages/HumanResources';
import DutyRoster from './pages/DutyRoster';
import QRAttendance from './pages/QRAttendance';
import FrontOffice from './pages/FrontOffice';
import TPA from './pages/TPA';
import Finance from './pages/Finance';
import Messaging from './pages/Messaging';
import Certificates from './pages/Certificates';
import LiveConsultancy from './pages/LiveConsultancy';
import Reports from './pages/Reports';
import AnnualCalendar from './pages/AnnualCalendar';
import CaseManager from './pages/CaseManager';
import Subscription from './pages/Subscription';
import PatientDashboard from './pages/PatientDashboard';
import PatientAppointment from './pages/PatientAppointment';
import PrescriptionPatient from './pages/PrescriptionPatient';
import BillingPayment from './pages/BillingPayment';
import MedicalRecords from './pages/MedicalRecords';
export type PageType =
  | 'dashboard' | 'patients' | 'doctors' | 'appointments' | 'departments'
  | 'bed-management' | 'prescriptions' | 'pharmacy' | 'billing' | 'insurance'
  | 'opd' | 'inventory' | 'blood-bank' | 'pathology' | 'radiology'
  | 'ambulance' | 'birth-death' | 'human-resources' | 'duty-roster'
  | 'qr-attendance' | 'front-office' | 'tpa' | 'finance' | 'messaging'
  | 'certificates' | 'live-consultancy' | 'reports' | 'annual-calendar'
  | 'case-manager' | 'rbac-admin' | 'subscription' | 'medical-records' | 'lab-reports' | 'telemedicine' | 'support';
import LabReports from './pages/LabReports';
import Telemedicine from './pages/Telemedicine';
import Support from './pages/Support';


function ProtectedPage({ page, onNavigate }: { page: PageType; onNavigate: (p: PageType) => void }) {
  const { canPage, addAudit, currentUser } = useAuth();

  // If patient, always show PatientDashboard for dashboard page
  if (currentUser?.roleId === 'patient') {
    if (page === 'dashboard') {
      return <PatientDashboard />;
    }
    if (page === 'appointments') {
      // Show PatientAppointment page for patients
      return <PatientAppointment />;
    }
    if (page === 'prescriptions') {
      // Show PrescriptionPatient page for patients
      return <PrescriptionPatient />;
    }
    if (page === 'billing') {
      // Show BillingPayment page for patients
      return <BillingPayment />;
    }
    if (page === 'medical-records') {
      // Show MedicalRecords page for patients
      return <MedicalRecords />;
    }
    if (page === 'lab-reports') {
      // Show LabReports page for patients
      return <LabReports />;
    }
    if (page === 'telemedicine') {
      // Show Telemedicine page for patients
      return <Telemedicine />;
    }
    if (page === 'support') {
      // Show Support page for patients
      return <Support />;
    }
  }

  if (page === 'dashboard') return <Dashboard onNavigate={onNavigate} />;

  if (!canPage(page)) {
    addAudit({ action: 'ACCESS_DENIED', resource: page, detail: `Unauthorized access attempt to ${page}`, result: 'denied' });
    return <AccessDenied resource={page.replace(/-/g, ' ')} onBack={() => onNavigate('dashboard')} />;
  }

  switch (page) {
    case 'patients':          return <Patients />;
    case 'doctors':           return <Doctors />;
    case 'appointments':      return <Appointments />;
    case 'departments':       return <Departments />;
    case 'bed-management':    return <BedManagement />;
    case 'prescriptions':     return <Prescriptions />;
    case 'pharmacy':          return <Pharmacy />;
    case 'billing':           return <Billing />;
    case 'insurance':         return <Insurance />;
    case 'opd':               return <OPD />;
    case 'inventory':         return <Inventory />;
    case 'blood-bank':        return <BloodBank />;
    case 'pathology':         return <Pathology />;
    case 'radiology':         return <Radiology />;
    case 'ambulance':         return <Ambulance />;
    case 'birth-death':       return <BirthDeath />;
    case 'human-resources':   return <HumanResources />;
    case 'duty-roster':       return <DutyRoster />;
    case 'qr-attendance':     return <QRAttendance />;
    case 'front-office':      return <FrontOffice />;
    case 'tpa':               return <TPA />;
    case 'finance':           return <Finance />;
    case 'subscription':      return <Subscription />;
    case 'messaging':         return <Messaging />;
    case 'certificates':      return <Certificates />;
    case 'live-consultancy':  return <LiveConsultancy />;
    case 'reports':           return <Reports />;
    case 'annual-calendar':   return <AnnualCalendar />;
    case 'case-manager':      return <CaseManager />;
    case 'rbac-admin':        return <RBACAdmin />;
    default:                  return <Dashboard onNavigate={onNavigate} />;
  }
}

function AppShell() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) return <LoginPage />;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(p => !p)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentPage={currentPage} onToggleSidebar={() => setSidebarOpen(p => !p)} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 animate-fade-in">
            <ProtectedPage page={currentPage} onNavigate={setCurrentPage} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
