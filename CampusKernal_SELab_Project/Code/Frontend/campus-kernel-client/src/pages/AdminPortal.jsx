import { useEffect, useMemo, useState } from 'react';
import { Shield, Search, Trash2, RefreshCw } from 'lucide-react';
import api from '../services/api';

export default function AdminPortal() {
  const [users, setUsers] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    setError('');

    try {
      const [meRes, usersRes, duplicatesRes] = await Promise.all([
        api.get('/me'),
        api.get('/admin/users'),
        api.get('/admin/duplicates'),
      ]);

      setCurrentUser(meRes.data.user);
      setUsers(usersRes.data);
      setDuplicates(duplicatesRes.data);
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) => (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    ));
  }, [searchQuery, users]);

  const handleRoleChange = async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      setUsers((prev) => prev.map((user) => user.id === userId ? response.data.user : user));
    } catch (updateError) {
      alert(updateError?.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user and related records?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setDuplicates((prev) => prev.map((group) => ({
        ...group,
        users: group.users.filter((user) => user._id !== userId),
        count: group.users.filter((user) => user._id !== userId).length,
      })).filter((group) => group.count > 1));
    } catch (deleteError) {
      alert(deleteError?.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto pt-10 text-sm text-slate-500">Loading admin portal...</div>;
  }

  if (currentUser?.role !== 'admin') {
    return <div className="max-w-7xl mx-auto pt-10 text-sm text-red-500">Admin access required.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 pr-4 font-sans text-slate-800 dark:text-slate-200 space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded mb-4 border border-slate-200 dark:border-slate-700">
              <Shield size={16} className="text-red-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Admin Controls</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Portal</h1>
            <p className="text-slate-500 mt-2">Manage users, roles, and duplicate-email cleanup visibility.</p>
          </div>

          <button
            onClick={loadAdminData}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center gap-4 mb-4">
          <h2 className="text-xl font-bold">Duplicate Emails</h2>
        </div>
        {duplicates.length === 0 ? (
          <p className="text-sm text-slate-500">No duplicate emails found in the current dataset.</p>
        ) : (
          <div className="space-y-4">
            {duplicates.map((group) => (
              <div key={group.email} className="border border-amber-200 dark:border-amber-900/40 rounded-lg p-4 bg-amber-50/60 dark:bg-amber-950/20">
                <div className="text-sm font-bold text-amber-700 dark:text-amber-300">{group.email} ({group.count})</div>
                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  {group.users.map((user) => `${user.name} (${user._id})`).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold">Users</h2>
          <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-md border border-slate-200 dark:border-slate-700 flex items-center">
            <div className="px-3 text-slate-400"><Search size={16} /></div>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search users..."
              className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Created</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800/70">
                  <td className="py-3 pr-4 font-semibold">{user.name}</td>
                  <td className="py-3 pr-4">{user.email}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={user.role}
                      onChange={(event) => handleRoleChange(user.id, event.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded px-2 py-1"
                      disabled={user.id === currentUser.id}
                    >
                      <option value="student">student</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3 pr-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={user.id === currentUser.id}
                      className="inline-flex items-center gap-2 text-red-600 disabled:text-slate-400"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
