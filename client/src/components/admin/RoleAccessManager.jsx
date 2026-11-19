import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  Building2,
  FlaskConical,
  Package,
  User,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Filter
} from 'lucide-react';

export default function RoleAccessManager({ token }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [notice, setNotice] = useState('');

  // Role promotion modal / form state
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('DEALER');
  const [companyName, setCompanyName] = useState('');
  const [tier, setTier] = useState('Gold Tier Partner');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        localStorage.setItem('goodbee_cloud_users', JSON.stringify(data.users || []));
      } else {
        // Fallback to local
        const local = JSON.parse(localStorage.getItem('goodbee_cloud_users') || '[]');
        if (local.length > 0) setUsers(local);
      }
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('goodbee_cloud_users') || '[]');
      if (local.length > 0) setUsers(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUpdatingId(selectedUser.id);
    try {
      const res = await fetch(`/api/v1/admin/users/${selectedUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          role: newRole,
          companyName: companyName || selectedUser.companyName,
          tier: newRole === 'DEALER' ? tier : undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        setNotice(`Successfully elevated ${selectedUser.name} to ${newRole}!`);
        // Update local list state
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole, companyName, tier } : u))
        );
        setSelectedUser(null);
      } else {
        const err = await res.json();
        setNotice(err.error || 'Failed to update user role.');
      }
    } catch (err) {
      // Local fallback simulation
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, role: newRole, companyName, tier } : u))
      );
      setNotice(`Updated role for ${selectedUser.name} locally.`);
      setSelectedUser(null);
    } finally {
      setUpdatingId(null);
      setTimeout(() => setNotice(''), 4000);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.companyName?.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'Store Administrator',
          color: 'bg-purple-100 text-purple-900 border-purple-200',
          icon: Shield
        };
      case 'PRODUCER':
        return {
          label: 'Botanical Vendor / Lab',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          icon: FlaskConical
        };
      case 'DEALER':
        return {
          label: 'Wholesaler / Stockist',
          color: 'bg-blue-100 text-blue-900 border-blue-200',
          icon: Package
        };
      case 'MEDIA_MANAGER':
        return {
          label: 'Media & Stock Lead',
          color: 'bg-violet-100 text-violet-900 border-violet-200',
          icon: Sparkles
        };
      case 'DELIVERY_PARTNER':
        return {
          label: 'Delivery Partner',
          color: 'bg-sky-100 text-sky-900 border-sky-200',
          icon: Package
        };
      default:
        return {
          label: 'Customer Account',
          color: 'bg-amber-100 text-amber-900 border-amber-200',
          icon: User
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Stats Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-50 text-[#5B0868]">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-serif font-bold text-gray-900">
                User Access & Role Promotion Tower
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Live role management powered by PostgreSQL. All new registrations default to{' '}
              <strong className="text-amber-800">Customer Account</strong>. Only Admins can promote users to Vendors or Wholesalers.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchUsers}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#5B0868] bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors self-start cursor-pointer"
          >
            Refresh Cloud Users ({users.length})
          </button>
        </div>

        {notice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or company..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {['ALL', 'CUSTOMER', 'DEALER', 'PRODUCER', 'MEDIA_MANAGER', 'ADMIN'].map((rf) => (
            <button
              key={rf}
              type="button"
              onClick={() => setRoleFilter(rf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === rf
                  ? 'bg-[#5B0868] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {rf === 'ALL' ? 'All Roles' : rf === 'CUSTOMER' ? 'Customers' : rf === 'DEALER' ? 'Wholesalers' : rf === 'PRODUCER' ? 'Vendors' : rf === 'MEDIA_MANAGER' ? 'Media Leads' : 'Admins'}
            </button>
          ))}
        </div>
      </div>

      {/* Users List Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Customer / User</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-4">Organization / Tier</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const roleBadge = getRoleBadge(u.role);
                  const Icon = roleBadge.icon;
                  return (
                    <tr key={u.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-900">{u.name}</div>
                        <div className="text-[11px] text-gray-500 font-mono">{u.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${roleBadge.color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{roleBadge.label}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {u.companyName ? (
                          <div>
                            <div className="font-medium text-gray-800">{u.companyName}</div>
                            {u.tier && <div className="text-[10px] text-purple-700 font-bold">{u.tier}</div>}
                          </div>
                        ) : (
                          <span className="text-gray-400 font-mono">Retail Individual</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-gray-600">
                        {u.phone || <span className="text-gray-400">Not provided</span>}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {u.role === 'ADMIN' ? (
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Superuser Protected</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setNewRole(u.role === 'CUSTOMER' ? 'DEALER' : 'CUSTOMER');
                              setCompanyName(u.companyName || '');
                              setTier(u.tier || 'Gold Tier Partner');
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-[#5B0868] bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Change Role</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Assignment Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-gray-100 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#2A0845] via-[#5B0868] to-[#9B1B62] text-white p-5">
              <h3 className="font-serif font-bold text-lg">Elevate / Modify Access Role</h3>
              <p className="text-xs text-purple-100/80 mt-1">
                Updating role permissions for: <strong>{selectedUser.name}</strong> ({selectedUser.email})
              </p>
            </div>

            <form onSubmit={handleUpdateRole} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                >
                  <option value="CUSTOMER">Customer Account (Default)</option>
                  <option value="DEALER">Wholesaler / Stockist (B2B Bulk Desk)</option>
                  <option value="PRODUCER">Vendor / Supplier (Botanical Apiaries & Labs)</option>
                  <option value="MEDIA_MANAGER">Media Manager (Stock, Photos & Storefront CMS)</option>
                  <option value="DELIVERY_PARTNER">Delivery Partner (Order Logistics & Fleet)</option>
                </select>
              </div>

              {newRole === 'DEALER' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Company / Firm Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Western Ghats Wellness Distributors LLP"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Wholesale Partner Tier</label>
                    <select
                      value={tier}
                      onChange={(e) => setTier(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                    >
                      <option value="Silver Tier Stockist">Silver Tier Stockist (15% Margin)</option>
                      <option value="Gold Tier Partner">Gold Tier Partner (22% Margin)</option>
                      <option value="Platinum Apex Partner">Platinum Apex Partner (25% Margin)</option>
                    </select>
                  </div>
                </>
              )}

              {newRole === 'PRODUCER' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Lab / Bio-Farm Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Wayanad Botanical Distilleries Pvt Ltd"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#5B0868]"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingId !== null}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#5B0868] to-[#9B1B62] rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {updatingId ? 'Synchronizing with Neon DB...' : 'Save Role Elevation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
