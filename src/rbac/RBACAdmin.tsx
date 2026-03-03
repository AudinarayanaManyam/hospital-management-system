import { useState } from 'react';
import { useAuth } from './AuthContext';
import { ROLES, type RoleId, type Resource, type Action } from './permissions';
import {
  Shield, Users, Key, FileText, Plus, Trash2, Edit2,
  CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, Eye
} from 'lucide-react';

type Tab = 'users' | 'roles' | 'permissions' | 'audit';

const ALL_RESOURCES: Resource[] = [
  'dashboard','patients','doctors','appointments','departments','bed-management',
  'prescriptions','pharmacy','billing','insurance','opd','inventory','blood-bank',
  'pathology','radiology','ambulance','birth-death','human-resources','duty-roster',
  'qr-attendance','front-office','tpa','finance','messaging','certificates',
  'live-consultancy','reports','annual-calendar','case-manager','rbac-admin'
];
const ALL_ACTIONS: Action[] = ['view','create','edit','delete','approve','export'];

export default function RBACAdmin() {
  const { users, currentUser, updateUserRole, toggleUserActive, deleteUser, addUser, auditLog, can } = useAuth();
  const [tab, setTab] = useState<Tab>('users');
  const [selectedRole, setSelectedRole] = useState<RoleId>('doctor');
  const [expandedRole, setExpandedRole] = useState<RoleId | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', roleId: 'nurse' as RoleId, department: '', phone: '', isActive: true });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const canManage = can('rbac-admin', 'edit');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary-600" /> RBAC Administration
          </h1>
          <p className="text-sm text-gray-500 mt-1">Role-Based Access Control — manage users, roles & permissions</p>
        </div>
        {canManage && (
          <button onClick={() => setShowAddUser(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Add User
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div className="text-2xl font-bold text-blue-600">{users.length}</div><div className="text-sm text-gray-500">Total Users</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</div><div className="text-sm text-gray-500">Active</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-purple-600">{Object.keys(ROLES).length}</div><div className="text-sm text-gray-500">Roles Defined</div></div>
        <div className="stat-card"><div className="text-2xl font-bold text-orange-600">{auditLog.length}</div><div className="text-sm text-gray-500">Audit Events</div></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {([
          { id: 'users', label: 'Users', icon: Users },
          { id: 'roles', label: 'Roles', icon: Shield },
          { id: 'permissions', label: 'Permission Matrix', icon: Key },
          { id: 'audit', label: 'Audit Log', icon: FileText },
        ] as { id: Tab; label: string; icon: typeof Users }[]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-white shadow text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* ── USERS TAB ── */}
      {tab === 'users' && (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">User</th>
                <th className="table-header">Email</th>
                <th className="table-header">Role</th>
                <th className="table-header">Department</th>
                <th className="table-header">Last Login</th>
                <th className="table-header">Status</th>
                {canManage && <th className="table-header">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const role = ROLES[u.roleId];
                const isEditing = editingUserId === u.id;
                return (
                  <tr key={u.id} className={`hover:bg-gray-50 ${u.id === currentUser?.id ? 'bg-primary-50/40' : ''}`}>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${role.bgColor} ${role.color} flex items-center justify-center font-bold text-sm`}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{u.name}</div>
                          {u.id === currentUser?.id && <div className="text-xs text-primary-500">You</div>}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-xs font-mono">{u.email}</td>
                    <td className="table-cell">
                      {isEditing && canManage ? (
                        <select
                          className="input text-xs py-1"
                          value={u.roleId}
                          onChange={e => { updateUserRole(u.id, e.target.value as RoleId); setEditingUserId(null); }}
                        >
                          {Object.values(ROLES).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                      ) : (
                        <span className={`badge ${role.bgColor} ${role.color}`}>{role.name}</span>
                      )}
                    </td>
                    <td className="table-cell">{u.department || '—'}</td>
                    <td className="table-cell text-xs text-gray-400">
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : 'Never'}
                    </td>
                    <td className="table-cell">
                      <span className={u.isActive ? 'badge-green' : 'badge-red'}>{u.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    {canManage && (
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingUserId(isEditing ? null : u.id)}
                            title="Edit role"
                            className="p-1.5 rounded hover:bg-blue-50 text-blue-500"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {u.id !== currentUser?.id && (
                            <>
                              <button
                                onClick={() => toggleUserActive(u.id)}
                                title={u.isActive ? 'Deactivate' : 'Activate'}
                                className={`p-1.5 rounded ${u.isActive ? 'hover:bg-yellow-50 text-yellow-500' : 'hover:bg-green-50 text-green-500'}`}
                              >
                                {u.isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                              </button>
                              {!ROLES[u.roleId].isSystemRole && (
                                <button
                                  onClick={() => { if (confirm(`Delete user ${u.name}?`)) deleteUser(u.id); }}
                                  className="p-1.5 rounded hover:bg-red-50 text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ROLES TAB ── */}
      {tab === 'roles' && (
        <div className="space-y-3">
          {Object.values(ROLES).map(role => (
            <div key={role.id} className="card">
              <button
                className="w-full flex items-center justify-between"
                onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${role.bgColor} ${role.color}`}>
                    {role.name}
                  </div>
                  {role.isSystemRole && (
                    <span className="badge-gray text-xs">System</span>
                  )}
                  <span className="text-sm text-gray-500">{role.description}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{role.permissions.length} permissions</span>
                  <span className="text-xs text-gray-400">{users.filter(u => u.roleId === role.id).length} users</span>
                  {expandedRole === role.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
              </button>
              {expandedRole === role.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-3">Permissions by Resource</div>
                  <div className="space-y-2">
                    {ALL_RESOURCES.filter(r => role.permissions.some(p => p.startsWith(`${r}:`))).map(resource => {
                      const granted = ALL_ACTIONS.filter(a => role.permissions.includes(`${resource}:${a}`));
                      return (
                        <div key={resource} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-36 capitalize">{resource.replace(/-/g, ' ')}</span>
                          <div className="flex gap-1 flex-wrap">
                            {ALL_ACTIONS.map(a => (
                              <span key={a} className={`text-xs px-2 py-0.5 rounded font-medium ${granted.includes(a) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-300'}`}>
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    Users with this role:
                    {users.filter(u => u.roleId === role.id).map(u => (
                      <span key={u.id} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{u.name}</span>
                    ))}
                    {users.filter(u => u.roleId === role.id).length === 0 && <span>None</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── PERMISSION MATRIX TAB ── */}
      {tab === 'permissions' && (
        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            <label className="label mb-0">View matrix for role:</label>
            <select className="input w-48" value={selectedRole} onChange={e => setSelectedRole(e.target.value as RoleId)}>
              {Object.values(ROLES).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${ROLES[selectedRole].bgColor} ${ROLES[selectedRole].color}`}>
              {ROLES[selectedRole].permissions.length} total permissions
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="table-header w-44">Resource</th>
                  {ALL_ACTIONS.map(a => (
                    <th key={a} className="table-header text-center capitalize">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_RESOURCES.map(resource => {
                  const role = ROLES[selectedRole];
                  const rowHasAny = ALL_ACTIONS.some(a => role.permissions.includes(`${resource}:${a}`));
                  return (
                    <tr key={resource} className={`${rowHasAny ? '' : 'opacity-40'} hover:bg-gray-50`}>
                      <td className="table-cell capitalize font-medium">{resource.replace(/-/g, ' ')}</td>
                      {ALL_ACTIONS.map(a => {
                        const has = role.permissions.includes(`${resource}:${a}`);
                        return (
                          <td key={a} className="table-cell text-center">
                            {has
                              ? <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                              : <span className="w-4 h-4 block mx-auto text-gray-200">—</span>
                            }
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── AUDIT LOG TAB ── */}
      {tab === 'audit' && (
        <div className="card overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">System Audit Log</h2>
            <span className="text-xs text-gray-400">{auditLog.length} events recorded</span>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Timestamp</th>
                <th className="table-header">User</th>
                <th className="table-header">Action</th>
                <th className="table-header">Resource</th>
                <th className="table-header">Detail</th>
                <th className="table-header">Result</th>
                <th className="table-header">IP</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.slice(0, 100).map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="table-cell font-mono text-xs text-gray-500">
                    {new Date(entry.timestamp).toLocaleString('en-IN', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit', second:'2-digit' })}
                  </td>
                  <td className="table-cell text-sm font-medium">{entry.userName}</td>
                  <td className="table-cell">
                    <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">{entry.action}</span>
                  </td>
                  <td className="table-cell capitalize text-sm">{entry.resource.replace(/-/g, ' ')}</td>
                  <td className="table-cell text-xs text-gray-600 max-w-xs truncate">{entry.detail}</td>
                  <td className="table-cell">
                    <span className={entry.result === 'success' ? 'badge-green' : entry.result === 'denied' ? 'badge-red' : 'badge-blue'}>
                      {entry.result}
                    </span>
                  </td>
                  <td className="table-cell font-mono text-xs text-gray-400">{entry.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && canManage && (
        <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
          <div className="modal p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Add New User</h3>
            <div className="space-y-3">
              <div><label className="label">Full Name</label><input className="input" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label className="label">Email</label><input className="input" type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} /></div>
              <div><label className="label">Password</label><input className="input" type="password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} /></div>
              <div><label className="label">Role</label>
                <select className="input" value={newUser.roleId} onChange={e => setNewUser(p => ({ ...p, roleId: e.target.value as RoleId }))}>
                  {Object.values(ROLES).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <div><label className="label">Department</label><input className="input" value={newUser.department} onChange={e => setNewUser(p => ({ ...p, department: e.target.value }))} /></div>
              <div><label className="label">Phone</label><input className="input" value={newUser.phone} onChange={e => setNewUser(p => ({ ...p, phone: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="btn-primary" onClick={() => { addUser(newUser); setShowAddUser(false); setNewUser({ name:'',email:'',password:'',roleId:'nurse',department:'',phone:'',isActive:true }); }}>
                <Plus className="w-4 h-4" /> Create User
              </button>
              <button className="btn-secondary" onClick={() => setShowAddUser(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
