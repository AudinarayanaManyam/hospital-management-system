import { useState } from 'react';
import { useAuth } from './AuthContext';
import { ROLES } from './permissions';
import { USERS } from './users';
import { Cross, Eye, EyeOff, AlertCircle, Shield, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate network
    const result = login(email.trim(), password);
    setLoading(false);
    if (!result.ok) setError(result.error ?? 'Login failed');
  };

  const quickLogin = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    setShowAccounts(false);
  };

  // Group demo accounts
  const demoAccounts = [
    { email: 'superadmin@medicore.in', password: 'Admin@123', name: 'Super Admin', role: 'super_admin' },
    { email: 'admin@medicore.in', password: 'HospAdmin@1', name: 'Hospital Admin', role: 'hospital_admin' },
    { email: 'arun@medicore.in', password: 'Doctor@123', name: 'Dr. Arun Mehta', role: 'doctor' },
    { email: 'ramesh@medicore.in', password: 'Nurse@123', name: 'Ramesh Verma', role: 'nurse' },
    { email: 'deepa@medicore.in', password: 'Pharma@123', name: 'Deepa Menon', role: 'pharmacist' },
    { email: 'fatima@medicore.in', password: 'Recept@123', name: 'Fatima Begum', role: 'receptionist' },
    { email: 'arjun@medicore.in', password: 'Lab@12345', name: 'Arjun Singh', role: 'lab_technician' },
    { email: 'billing@medicore.in', password: 'Billing@123', name: 'Priya Finance', role: 'billing_staff' },
    { email: 'hr@medicore.in', password: 'HRMgr@123', name: 'Sanjay HR', role: 'hr_manager' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="w-full max-w-4xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

          {/* Left: Branding */}
          <div className="text-white hidden lg:block">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center">
                <Cross className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">MediCore HMS</div>
                <div className="text-primary-300 text-sm">Hospital Management System</div>
              </div>
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Secure Access<br />
              <span className="text-primary-300">Role-Based Control</span>
            </h1>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Enterprise-grade RBAC ensuring every staff member accesses only what they're authorized for. Audit-logged, secure, and compliant.
            </p>
            <div className="space-y-3">
              {[
                { icon: Shield, label: '13 Predefined Roles', desc: 'From Super Admin to Ambulance Staff' },
                { icon: Lock, label: 'Permission-Based Access', desc: '28 modules with granular control' },
                { icon: AlertCircle, label: 'Complete Audit Trail', desc: 'Every action logged with timestamp' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-9 h-9 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{label}</div>
                    <div className="text-xs text-slate-400">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center gap-2 mb-1 lg:hidden">
              <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center">
                <Cross className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">MediCore HMS</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your credentials to access the system</p>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  {/* <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
                  <input
                    className="input pl-9"
                    type="email"
                    placeholder="you@medicore.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  {/* <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
                  <input
                    className="input pl-9 pr-10"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                ) : (
                  <><Shield className="w-4 h-4" />Sign In Securely</>
                )}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-4">
              <button
                onClick={() => setShowAccounts(!showAccounts)}
                className="w-full text-center text-sm text-primary-600 hover:text-primary-800 font-medium py-2 border border-dashed border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
              >
                {showAccounts ? 'Hide' : 'Show'} Demo Accounts 🔑
              </button>
              {showAccounts && (
                <div className="mt-3 space-y-1.5 max-h-72 overflow-y-auto">
                  {demoAccounts.map(acc => {
                    const role = ROLES[acc.role];
                    return (
                      <button
                        key={acc.email}
                        onClick={() => quickLogin(acc.email, acc.password)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors text-left"
                      >
                        <div className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${role.bgColor} ${role.color}`}>
                          {role.name}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">{acc.name}</div>
                          <div className="text-xs text-gray-400 truncate">{acc.email}</div>
                        </div>
                        <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">{acc.password}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Protected by MediCore RBAC v1.0 · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
