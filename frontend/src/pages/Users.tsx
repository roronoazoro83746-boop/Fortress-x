import React, { useEffect, useState } from 'react';
import { getUsers, getUserRole } from '../services/api';
import { ShieldAlert, UserPlus, Mail, Calendar, Shield } from 'lucide-react';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const role = getUserRole();

  useEffect(() => {
    if (role !== 'admin') {
      setError("You do not have permission to view the user management dashboard.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [role]);

  if (loading) {
    return <div className="p-8 text-white min-h-screen bg-[#070514]">Loading system users...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-white min-h-screen bg-[#070514] flex items-center justify-center">
        <div className="bg-[#110e1f] border border-red-500/30 p-8 rounded-2xl max-w-md text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-[#070514] text-white font-sans">
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
          User Management
        </h2>
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Analyst
        </button>
      </header>

      <div className="bg-[#110e1f] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-black/30 text-gray-400 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">System Role</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400">
                        {user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-500" /> {user.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      user.role === 'admin' 
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm text-green-400">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-white transition-colors">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
