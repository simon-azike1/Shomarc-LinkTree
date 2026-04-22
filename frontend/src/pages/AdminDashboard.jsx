import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProfile, createProfile, updateProfile, addLink, updateLink, deleteLink, reorderLinks, adminLogin } from '../services/api';

function AdminDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', bio: '', avatarUrl: '' });
  const [linkForm, setLinkForm] = useState({ title: '', url: '', icon: 'link', message: '' });
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const socialIcons = {
    whatsapp: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    instagram: 'M12 2.2c2.717 0 3.034.009 4.103.072 1.174.069 1.813.303 2.238.504.56.266.96.584 1.381 1.003.42.42.737.82 1.003 1.38.201.425.435 1.064.504 2.239.063 1.068.072 1.386.072 4.103 0 2.717-.009 3.034-.072 4.103-.069 1.174-.303 1.813-.504 2.238-.266.56-.584.96-1.003 1.381a3.64 3.64 0 0 1-1.381 1.003c-.424.201-1.064.435-2.238.504-1.068.063-1.386.072-4.103.072-2.717 0-3.034-.009-4.103-.072-1.174-.069-1.813-.303-2.238-.504a3.64 3.64 0 0 1-1.381-1.003c-.42-.42-.737-.82-1.003-1.38-.201-.425-.435-1.064-.504-2.239-.063-1.068-.072-1.386-.072-4.103 0-2.717.009-3.034.072-4.103.069-1.174.303-1.813.504-2.238.266-.56.584-.96 1.003-1.381.42-.42.82-.737 1.38-1.003.425-.201 1.064-.435 2.239-.504 1.068-.063 1.386-.072 4.103-.072M12 0H9.257C6.312 0 5.924.012 4.825.06 1.837.274.773 1.337.559 4.325.512 5.423.5 5.812.5 8.257v3.486c0 2.445.012 2.834.06 3.935.214 2.988 1.278 4.052 4.265 4.268 1.1.048 1.487.06 3.931.06 2.444 0 2.834-.012 3.935-.06 2.987-.216 4.05-1.28 4.268-4.268.048-1.1.06-1.487.06-3.935 0-2.444-.012-2.834-.06-3.931-.218-2.987-1.28-4.05-4.268-4.265C15.834.012 15.444 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16.2c-2.456 0-4.458-1.993-4.458-4.458 0-2.456 2.001-4.458 4.458-4.458 2.456 0 4.458 2.001 4.458 4.458 0 2.456-2.001 4.458-4.458 4.458zm0-7.802a3.344 3.344 0 1 0 0 6.688 3.344 3.344 0 0 0 0-6.688z',
    linkedin: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.17 1.17 0 0 0 1.17-1.17c0-.93-.77-1.68-1.72-1.68a1.17 1.17 0 0 0-1.17 1.17c0 .93.77 1.68 1.72 1.68M9 14v-4.5h2.5V14',
    facebook: 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z',
    twitter: 'M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.58-2.11-9.96-5.02-.42.72-.66 1.56-.66 2.46 0 1.68.85 3.16 2.14 4.02-.79-.02-1.53-.24-2.18-.6v.06c0 2.35 1.67 4.31 3.88 4.76-.4.1-.83.16-1.27.16-.31 0-.62-.03-.92-.08.63 1.96 2.45 3.39 4.61 3.43-1.69 1.32-3.83 2.1-6.15 2.1-.4 0-.8-.02-1.19-.07 2.19 1.4 4.78 2.22 7.57 2.22 9.07 0 14.02-7.52 14.02-14.02 0-.21 0-.43-.01-.64.96-.69 1.79-1.56 2.45-2.55z',
    youtube: 'M10 15l5.19-3L10 21v-6zm7-13v18l12-9V6l-12 9-12-9z',
    tiktok: 'M12.525.02c1.31-.02 2.42-.02 3.51-.02 2.13 0 4.06.8 5.6 2.26a8.94 8.94 0 0 1 3.44 6.48 32 32 0 0 1-16.5 1.8v-6.02a10.94 10.94 0 0 0 7.9-2.16c2.78-.54 5.04-2.2 5.8-4.6a8.9 8.9 0 0 1-3.75-6.18c-.97-.84-2.35-1.38-3.83-1.2-1.38.14-2.69.86-3.25 2.04a10.8 10.8 0 0 0-3.48-1.3c-3.04.23-5.78 2.57-5.78 5.72v1.06c.03.5.1 1 .25 1.5-.12 0-.23-.02-.36-.02-.77 0-1.48.41-1.87 1.07a10.14 10.14 0 0 0-.63 4.18c-.05.22-.05.45-.05.67v.17c0 .64.09 1.28.28 1.88a10.03 10.03 0 0 1-3.87 4.15c-1.37.6-2.9.93-4.47.84-2.6-.14-4.96-1.9-5.58-4.48-.35-1.45-.02-3 .87-4.1a8.72 8.94 8.94 0 0 1 4.03-2.3c2.1 0 3.96.88 4.87 2.3a8.94 8.94 0 0 1 2.75 5.96v1.36c-.08-.02-.16-.04-.24-.04-.83 0-1.59.32-2.16.85a6.17 6.17 0 0 0-1.35 3.24c.08.94.42 1.85.99 2.63a7.67 7.67 0 0 0 2.6 1.96c1.8.66 3.87.63 5.62-.1a7.68 7.68 0 0 0 3.5-2.16c.83-1.02 1.29-2.31 1.29-3.63v-.85a6.52 6.52 0 0 1-.9-3.18c.04-.7-.02-1.39-.18-2.05a8.09 8.09 0 0 0-2.3-3.7c-.94-.74-2.15-1.21-3.47-1.28a9.4 9.4 0 0 0-3.28.4 8.06 8.06 0 0 0-3.13 2.3c-.73.92-1.13 2.03-1.13 3.22v.42c.02.56.12 1.1.29 1.62.17-.5.43-.96.78-1.36.57-.65 1.36-1.09 2.26-1.25.72-.13 1.46-.06 2.13.2a5.5 5.5 0 0 1 1.61 1.22l.27.34c.18.22.32.46.43.72z',
    email: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
    website: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.98-2.1 5.28z',
    link: 'M3.9 12c0-1.43.88-2.83 2.09-3.71l1.8-1.79c.39-.39.39-1.02 0-1.41l-1.8-1.79a2.018 2.018 0 0 0-1.41 0l-1.8 1.79c-.39.39-.39 1.02 0 1.41l1.8 1.79A2.01 2.01 0 0 0 3.9 12zm8 0c0 1.43-.88 2.83-2.09 3.71l-1.8 1.79c-.39.39-.39 1.02 0 1.41l1.8 1.79a2.018 2.018 0 0 0 1.41 0l1.8-1.79c.39-.39.39-1.02 0-1.41l-1.8-1.79a2.01 2.01 0 0 0-2.09 0zM12 5.38c1.43 0 2.83.88 3.71 2.09l1.79 1.8c.39.39.39 1.02 0 1.41l-1.79 1.8a2.018 2.018 0 0 0-1.41 0l-1.8-1.79a2.01 2.01 0 0 0 0-2.09l1.79-1.8c.39-.39.39-1.02 0-1.41l-1.79-1.8a2.018 2.018 0 0 0-1.41 0l-1.8 1.79c-.39.39-.39 1.02 0 1.41l1.8 1.79c.61.61 1.5.98 2.09.73.17-.07.34-.11.51-.11z'
  };

  const linkBrandColors = {
    whatsapp: { bg: 'bg-green-500', text: 'text-white' },
    instagram: { bg: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400', text: 'text-white' },
    facebook: { bg: 'bg-blue-600', text: 'text-white' },
    twitter: { bg: 'bg-black', text: 'text-white' },
    youtube: { bg: 'bg-red-600', text: 'text-white' },
    tiktok: { bg: 'bg-black', text: 'text-white' },
    linkedin: { bg: 'bg-blue-700', text: 'text-white' },
    phone: { bg: 'bg-gray-600', text: 'text-white' },
    email: { bg: 'bg-gray-500', text: 'text-white' },
    website: { bg: 'bg-gray-700', text: 'text-white' },
    link: { bg: 'bg-amber-100', text: 'text-amber-600' }
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      setUserForm({ name: data.name || '', bio: data.bio || '', avatarUrl: data.avatarUrl || '' });
      setError(null);
    } catch (err) {
      setProfile(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem('admin_auth');
    if (storedAuth) setIsAdminAuthenticated(true);
    loadUser();
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(adminPassword);
      setIsAdminAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      setError(null);
    } catch (err) {
      setError('Invalid password');
    }
  };



  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createProfile(userForm);
      await loadUser();
      setError(null);
      setEditingProfile(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile(userForm);
      await loadUser();
      setEditingProfile(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await addLink(linkForm);
      await loadUser();
      setLinkForm({ title: '', url: '', icon: 'link', message: '' });
      setShowLinkForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLink = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateLink(editingLinkId, linkForm);
      await loadUser();
      setLinkForm({ title: '', url: '', icon: 'link', message: '' });
      setEditingLinkId(null);
      setShowLinkForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLink = async (linkId) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      setLoading(true);
      await deleteLink(linkId);
      await loadUser();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const sortedLinks = [...profile.links].sort((a, b) => a.order - b.order);
    const temp = sortedLinks[index].order;
    sortedLinks[index].order = sortedLinks[index - 1].order;
    sortedLinks[index - 1].order = temp;
    try {
      await reorderLinks(sortedLinks);
      setProfile({ ...profile, links: sortedLinks });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMoveDown = async (index) => {
    const sortedLinks = [...profile.links].sort((a, b) => a.order - b.order);
    if (index === sortedLinks.length - 1) return;
    const temp = sortedLinks[index].order;
    sortedLinks[index].order = sortedLinks[index + 1].order;
    sortedLinks[index + 1].order = temp;
    try {
      await reorderLinks(sortedLinks);
      setProfile({ ...profile, links: sortedLinks });
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditLink = (link) => {
    setLinkForm({ title: link.title, url: link.url, icon: link.icon || 'link', message: link.message || '' });
    setEditingLinkId(link._id);
    setShowLinkForm(true);
    setActiveTab('links');
  };

  const cancelEdit = () => {
    setLinkForm({ title: '', url: '', icon: 'link', message: '' });
    setEditingLinkId(null);
    setShowLinkForm(false);
  };

  const totalClicks = profile?.links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;

  const stats = [
    { label: 'Total Links', value: profile?.links?.length || 0, icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', bg: 'bg-amber-50', iconColor: 'text-amber-500' },
    { label: 'Total Clicks', value: totalClicks, icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5', bg: 'bg-yellow-50', iconColor: 'text-yellow-500' },
    { label: 'Profile Views', value: '—', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', bg: 'bg-orange-50', iconColor: 'text-orange-500' },
  ];

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all outline-none text-sm";

  // ─── Admin Login Screen ───────────────────────────────────────────────────────────
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400 shadow-lg shadow-amber-400/30 mb-5">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
              Sho<span className="text-amber-400">marc</span>
            </h1>
            <p className="text-gray-500 text-sm">Admin Access</p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              {error}
            </div>
          )}

          <div className="bg-white border border-gray-100 shadow-xl shadow-gray-100/50 p-8">
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className={inputClass + " pr-12"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0115.063-3.542M21 12c0 4.478-2.943 8.268-7 9.543M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-amber-400 text-gray-900 font-bold hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-400/30 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                Login
              </button>
            </form>


          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-gray-400 hover:text-amber-500 text-sm font-medium transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Login Screen ───────────────────────────────────────────────────────────
  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-50 skew-x-12 transform origin-top-right opacity-60"></div>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-100 opacity-50"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-yellow-100 opacity-40"></div>

        <div className="w-full max-w-sm relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-400 shadow-lg shadow-amber-400/30 mb-5">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
              Sho<span className="text-amber-400">marc</span>
            </h1>
            <p className="text-gray-500 text-sm">Enter your name to get started</p>
          </div>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="bg-white border border-gray-100 shadow-xl shadow-gray-100/50 p-8">
            <form onSubmit={handleCreateUser} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all outline-none text-sm focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-amber-400 text-gray-900 font-bold hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-400/30 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Profile
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-gray-400 hover:text-amber-500 text-sm font-medium transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Dashboard ──────────────────────────────────────────────────────────────
  const navItems = [
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'links', label: 'Links', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all lg:hidden shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-100 transition-all duration-300 shadow-sm ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'} lg:relative flex-shrink-0`}>
        <div className="flex flex-col h-full p-5">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-1">
            <div className="w-10 h-10 bg-amber-400 flex items-center justify-center shadow-md shadow-amber-400/30 flex-shrink-0 overflow-hidden">
              <img src="/shomarc_logo.png" alt="Logo" className="w-7 h-7 object-contain"
                   onError={(e) => { e.target.style.display='none'; }} />
            </div>
            {sidebarOpen && (
              <span className="text-gray-900 font-black text-xl tracking-tight">
                Sho<span className="text-amber-400">marc</span>
              </span>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 transition-all duration-200 text-sm font-semibold ${
                  activeTab === item.id
                    ? 'bg-amber-400 text-gray-900 shadow-md shadow-amber-400/30'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Bottom links */}
          <div className="pt-5 border-t border-gray-100 space-y-1">
            <Link
              to={`/`}
              target="_blank"
              className="flex items-center gap-3 px-3 py-3 text-gray-500 hover:bg-amber-50 hover:text-amber-600 transition-all text-sm font-medium"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {sidebarOpen && <span>View Page</span>}
            </Link>
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-3 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all text-sm font-medium"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {sidebarOpen && <span>Home</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        {loading && profile && (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent animate-spin"></div>
          </div>
        )}
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-3">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <header className="mb-8 pt-14 lg:pt-0">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {activeTab === 'profile' && 'Profile Settings'}
              {activeTab === 'links' && 'Manage Links'}
              {activeTab === 'analytics' && 'Analytics'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === 'profile' && 'Customize your public profile information'}
              {activeTab === 'links' && 'Add, edit, and organize your links'}
              {activeTab === 'analytics' && 'Track your link performance'}
            </p>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-100 p-5 hover:shadow-md hover:border-amber-200 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-10 h-10 ${stat.bg} mb-3`}>
                  <svg className={`w-5 h-5 ${stat.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <p className="text-2xl font-black text-gray-900 mb-0.5">{stat.value}</p>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ─── Profile Tab ─── */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-gray-100 p-6 lg:p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                <div className="relative">
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.name} className="w-16 h-16 object-cover ring-4 ring-amber-100" />
                  ) : (
                    <div className="w-16 h-16 bg-amber-400 flex items-center justify-center ring-4 ring-amber-100">
                      <span className="text-2xl text-white font-black">
                        {(profile?.name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{profile?.name || 'Your Name'}</h2>
                </div>
              </div>

              {editingProfile ? (
                <form onSubmit={handleUpdateUser} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Display Name</label>
                      <input type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} className={inputClass} placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Avatar URL</label>
                      <input type="url" value={userForm.avatarUrl} onChange={(e) => setUserForm({ ...userForm, avatarUrl: e.target.value })} className={inputClass} placeholder="https://example.com/avatar.jpg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Bio</label>
                    <textarea value={userForm.bio} onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })} rows={4} className={inputClass + ' resize-none'} placeholder="Tell visitors about yourself..." />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading} className="px-6 py-2.5 bg-amber-400 text-gray-900 font-bold hover:bg-amber-500 disabled:opacity-50 transition-all text-sm uppercase tracking-wider flex items-center gap-2">
                      {loading ? <><div className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 animate-spin"></div> Saving...</> : <>Save Changes</>}
                    </button>
                    <button type="button" onClick={() => { setEditingProfile(false); setUserForm({ name: profile?.name || '', bio: profile?.bio || '', avatarUrl: profile?.avatarUrl || '' }); }} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 font-bold hover:border-gray-300 transition-all text-sm uppercase tracking-wider">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Display Name</p>
                      <p className="text-gray-900 font-medium text-sm">{profile?.name || 'Not set'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Bio</p>
                      <p className="text-gray-900 font-medium text-sm">{profile?.bio || 'Not set'}</p>
                    </div>
                  </div>
                  <button onClick={() => setEditingProfile(true)} className="px-6 py-2.5 bg-amber-400 text-gray-900 font-bold hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-400/30 transition-all text-sm uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── Links Tab ─── */}
          {activeTab === 'links' && profile && (
            <div className="space-y-5">
              <div className="bg-white border border-gray-100 p-6 lg:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Your Links</h2>
                  <button
                    onClick={() => { setShowLinkForm(true); setLinkForm({ title: '', url: '', icon: 'link', message: '' }); setEditingLinkId(null); }}
                    className="px-4 py-2 bg-amber-400 text-gray-900 font-bold hover:bg-amber-500 hover:shadow-md hover:shadow-amber-400/30 transition-all text-xs uppercase tracking-wider flex items-center gap-1.5"
                    disabled={showLinkForm}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {profile.links?.length > 0 ? 'Add Link' : 'Add First Link'}
                  </button>
                </div>

                {showLinkForm && (
                  <div className="mb-6 p-5 bg-amber-50 border-2 border-amber-200 space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      {editingLinkId ? '✏️ Edit Link' : '+ New Link'}
                    </h3>
                    <form onSubmit={editingLinkId ? handleUpdateLink : handleAddLink}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Title</label>
                          <input type="text" value={linkForm.title} onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })} required className={inputClass} placeholder="My Website" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">{linkForm.icon === 'whatsapp' ? 'Phone Number' : linkForm.icon === 'phone' ? 'Phone Number' : 'URL'}</label>
                          <input type={linkForm.icon === 'whatsapp' || linkForm.icon === 'phone' ? 'tel' : 'url'} value={linkForm.url} onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })} required className={inputClass} placeholder={linkForm.icon === 'whatsapp' ? '+1234567890' : linkForm.icon === 'phone' ? '+1234567890' : 'https://example.com'} />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Icon</label>
                          <select value={linkForm.icon} onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value })} className={inputClass}>
                            <option value="link">Link</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="twitter">Twitter</option>
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="phone">Phone</option>
                            <option value="email">Email</option>
                            <option value="website">Website</option>
                          </select>
                        </div>
                        {linkForm.icon === 'whatsapp' && (
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Pre-filled Message (optional)</label>
                            <input type="text" value={linkForm.message || ''} onChange={(e) => setLinkForm({ ...linkForm, message: e.target.value })} className={inputClass} placeholder="Hello! I'd like to connect." />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" disabled={loading} className="px-5 py-2.5 bg-amber-400 text-gray-900 font-bold hover:bg-amber-500 disabled:opacity-50 transition-all text-xs uppercase tracking-wider">
                          {editingLinkId ? 'Update' : 'Add Link'}
                        </button>
                        <button type="button" onClick={cancelEdit} className="px-5 py-2.5 border-2 border-gray-200 text-gray-600 font-bold hover:border-gray-300 transition-all text-xs uppercase tracking-wider">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <motion.div 
                  className="flex flex-col gap-2"
                  initial="hidden"
                  animate="visible"
                >
                  {[...profile.links].sort((a, b) => a.order - b.order).map((link, index) => (
                    <motion.div 
                      key={link._id} 
                      className="group flex items-center gap-3 py-3 px-4 hover:bg-gray-50 transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="p-1 text-gray-300 hover:text-amber-500 disabled:opacity-30 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button onClick={() => handleMoveDown(index)} disabled={index === profile.links.length - 1} className="p-1 text-gray-300 hover:text-amber-500 disabled:opacity-30 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>

                      <div className={`w-9 h-9 ${linkBrandColors[link.icon]?.bg || linkBrandColors.link.bg} flex items-center justify-center flex-shrink-0`}>
                        <svg className={`w-4 h-4 ${linkBrandColors[link.icon]?.text || linkBrandColors.link.text}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d={socialIcons[link.icon] || socialIcons.link} />
                        </svg>
                      </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{link.title}</p>
                          <p className="text-xs text-gray-400 truncate">{link.url}</p>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100">
                          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
                          </svg>
                          <span className="text-amber-700 text-xs font-bold">{link.clicks}</span>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEditLink(link)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => handleDeleteLink(link._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Empty state info - the main button handles this now */}
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4">
                <p className="text-amber-800 text-sm font-medium">
                  🔗 Your public page:{' '}
                  <Link to={`/`} target="_blank" className="font-bold underline hover:no-underline text-amber-600">
                    {typeof window !== 'undefined' && window.location.origin}
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* ─── Analytics Tab ─── */}
          {activeTab === 'analytics' && profile && (
            <div className="bg-white border border-gray-100 p-6 lg:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Link Performance</h2>
              {profile.links.length > 0 ? (
                <div className="space-y-4">
                  {[...profile.links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).map((link) => {
                    const percentage = totalClicks > 0 ? ((link.clicks || 0) / totalClicks) * 100 : 0;
                    return (
                      <div key={link._id} className="p-4 bg-gray-50 border border-gray-100 hover:border-amber-200 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-semibold text-gray-900 text-sm truncate flex-1 mr-4">{link.title}</p>
                          <span className="text-amber-600 font-black text-sm">{link.clicks} clicks</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all duration-700" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <p className="text-gray-400 text-xs mt-1.5">{percentage.toFixed(1)}% of total clicks</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-14 h-14 mx-auto mb-4 bg-amber-50 flex items-center justify-center border-2 border-dashed border-amber-200">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">No analytics yet. Add links to see performance.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;