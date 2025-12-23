import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import TypingHeading from './TypingHeading';
import Navbar from './Navbar';
import { navigateTo } from '../utils/navigation';

const AccountPage: React.FC = () => {
  const { user, loading, logout, logoutAll, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone || '');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#282930] flex items-center justify-center">
        <div className="text-[#E3FFCC] text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
  navigateTo('/login');
  return null;
}

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    try {
      await updateProfile({ name: editName, phone: editPhone || undefined });
      setIsEditing(false);
    } catch (error: any) {
      setSaveError(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleLogoutAll = async () => {
    await logoutAll();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
      <>
      <Navbar />
    <div className="min-h-screen bg-[#282930] text-[#777C90] py-16 px-5 sm:px-6 lg:px-8">
        <div className="bg-[#F0F0F0] rounded-3xl shadow-2xl  mt-5 p-8 md:p-16">
        <div className="text-center"></div>
      <div className="max-w-6xl mx-auto">
        <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-mono text-[#142F32] text-center mb-8 min-h-[50px] flex items-center justify-center">
          <TypingHeading text={`<${user?.name || 'User'}Account />`} />
        </div>
        <div className="w-28 h-1 bg-[#142F32] mx-auto rounded-full"></div>
        </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {/* Profile Overview */}
          <div className="bg-[rgba(247,247,247,0.10)] rounded-lg p-6 shadow-xl border border-[rgba(227,255,204,0.2)] hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-4 text-xl">
              <svg className="w-6 h-6 text-[#E3FFCC] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <TypingHeading text="<ProfileOverview />" />
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#777C90]">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 block w-full bg-[#282930] border border-[#E3FFCC] rounded-md px-3 py-2 text-[#E3FFCC] focus:outline-none focus:ring-2 focus:ring-[#E3FFCC]"
                  />
                ) : (
                  <p className="mt-1 text-lg text-[#E3FFCC]">{user.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#777C90]">Email</label>
                <p className="mt-1 text-lg text-[#E3FFCC]">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#777C90]">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="mt-1 block w-full bg-[#282930] border border-[#E3FFCC] rounded-md px-3 py-2 text-[#E3FFCC] focus:outline-none focus:ring-2 focus:ring-[#E3FFCC]"
                  />
                ) : (
                  <p className="mt-1 text-lg text-[#E3FFCC]">{user.phone || 'Not set'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#777C90]">Email Verification Status</label>
                <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                  {user.email_verified_at ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    {saveError && <p className="text-red-400 text-sm mb-2">{saveError}</p>}
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-[#E3FFCC] text-[#142F32] px-4 py-2 rounded-md font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-600 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#E3FFCC] text-[#142F32] px-4 py-2 rounded-md font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Account Metadata */}
          <div className="bg-[rgba(247,247,247,0.10)] rounded-lg p-6 shadow-xl border border-[rgba(227,255,204,0.2)] hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-4 text-xl">
              <svg className="w-6 h-6 text-[#E3FFCC] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <TypingHeading text="<AccountMetadata />" />
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#777C90]">Account Created</label>
                <p className="mt-1 text-lg text-[#E3FFCC]">{formatDate(user.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#777C90]">Last Updated</label>
                <p className="mt-1 text-lg text-[#E3FFCC]">{formatDate(user.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-[rgba(247,247,247,0.10)] rounded-lg p-6 shadow-xl border border-[rgba(227,255,204,0.2)] hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-4 text-xl">
              <svg className="w-6 h-6 text-[#E3FFCC] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <TypingHeading text="<Security />" />
            </div>
            <div className="mt-4 space-y-4">
              <Link to="/forgot-password" className="bg-[#E3FFCC] text-[#142F32] px-4 py-2 rounded-md font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-block">
                Change Password
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[rgba(247,247,247,0.10)] rounded-lg p-6 shadow-xl border border-red-500 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center mb-4 text-xl text-red-400">
              <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <TypingHeading text="<DangerZone />" />
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm text-[#777C90] mb-2">Logout from all devices. This will invalidate all sessions.</p>
                <button
                  onClick={handleLogoutAll}
                  className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Logout from All Devices
                </button>
              </div>
              <div>
                <p className="text-sm text-[#777C90] mb-2">This action will log you out of your current session.</p>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountPage;