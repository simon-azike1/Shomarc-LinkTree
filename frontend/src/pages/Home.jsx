import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { getProfile, redirectLink } from '../services/api';

const socialIcons = {
  whatsapp: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10 10 10-4.48 10-10 10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  instagram: 'M12 2.2c2.717 0 3.034.009 4.103.072 1.174.069 1.813.303 2.238.504.56.266.96.584 1.381 1.003.42.42.737.82 1.003 1.38.201.425.435 1.064.504 2.239.063 1.068.072 1.386.072 4.103 0 2.717-.009 3.034-.072 4.103-.069 1.174-.303 1.813-.504 2.238-.266.56-.584.96-1.003 1.381a3.64 3.64 0 0 1-1.381 1.003c-.424.201-1.064.435-2.238.504-1.068.063-1.386.072-4.103.072-2.717 0-3.034-.009-4.103-.072-1.174-.069-1.813-.303-2.238-.504a3.64 3.64 0 0 1-1.381-1.003c-.42-.42-.737-.82-1.003-1.38-.201-.425-.435-1.064-.504-2.239-.063-1.068-.072-1.386-.072-4.103 0-2.717.009-3.034.072-4.103.069-1.174.303-1.813.504-2.238.266-.56.584-.96 1.003-1.381.42-.42.82-.737 1.38-1.003.425-.201 1.064-.435 2.239-.504 1.068-.063 1.386-.072 4.103-.072M12 0H9.257C6.312 0 5.924.012 4.825.06 1.837.274.773 1.337.559 4.325.512 5.423.5 5.812.5 8.257v3.486c0 2.445.012 2.834.06 3.935.214 2.988 1.278 4.052 4.265 4.268 1.1.048 1.487.06 3.931.06 2.444 0 2.834-.012 3.935-.06 2.987-.216 4.05-1.28 4.268-4.268.048-1.1.06-1.487.06-3.935 0-2.444-.012-2.834-.06-3.931-.218-2.987-1.28-4.05-4.268-4.265C15.834.012 15.444 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16.2c-2.456 0-4.458-1.993-4.458-4.458 0-2.456 2.001-4.458 4.458-4.458 2.456 0 4.458 2.001 4.458 4.458 0 2.456-2.001 4.458-4.458 4.458zm0-7.802a3.344 3.344 0 1 0 0 6.688 3.344 3.344 0 0 0 0-6.688z',
  linkedin: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.17 1.17 0 0 0 1.17-1.17c0-.93-.77-1.68-1.72-1.68a1.17 1.17 0 0 0-1.17 1.17c0 .93.77 1.68 1.72 1.68M9 14v-4.5h2.5V14',
  facebook: 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z',
  twitter: 'M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.58-2.11-9.96-5.02-.42.72-.66 1.56-.66 2.46 0 1.68.85 3.16 2.14 4.02-.79-.02-1.53-.24-2.18-.6v.06c0 2.35 1.67 4.31 3.88 4.76-.4.1-.83.16-1.27.16-.31 0-.62-.03-.92-.08.63 1.96 2.45 3.39 4.61 3.43-1.69 1.32-3.83 2.1-6.15 2.1-.4 0-.8-.02-1.19-.07 2.19 1.4 4.78 2.22 7.57 2.22 9.07 0 14.02-7.52 14.02-14.02 0-.21 0-.43-.01-.64.96-.69 1.79-1.56 2.45-2.55z',
  youtube: 'M10 15l5.19-3L10 21v-6zm7-13v18l12-9V6l-12 9-12-9z',
  tiktok: 'M12.525.02c1.31-.02 2.42-.02 3.51-.02 2.13 0 4.06.8 5.6 2.26a8.94 8.94 0 0 1 3.44 6.48 32 32 0 0 1-16.5 1.8v-6.02a10.94 10.94 0 0 0 7.9-2.16c2.78-.54 5.04-2.2 5.8-4.6a8.9 8.9 0 0 1-3.75-6.18c-.97-.84-2.35-1.38-3.83-1.2-1.38.14-2.69.86-3.25 2.04a10.8 10.8 0 0 0-3.48-1.3c-3.04.23-5.78 2.57-5.78 5.72v1.06c.03.5.1 1 .25 1.5-.12 0-.23-.02-.36-.02-.77 0-1.48.41-1.87 1.07a10.14 10.14 0 0 0-.63 4.18c-.05.22-.05.45-.05.67v.17c0 .64.09 1.28.28 1.88a10.03 10.03 0 0 1-3.87 4.15c-1.37.6-2.9.93-4.47.84-2.6-.14-4.96-1.9-5.58-4.48-.35-1.45-.02-3 .87-4.1a8.72 8.72 0 0 1 4.03-2.3c2.1 0 3.96.88 4.87 2.3a8.94 8.94 0 0 1 2.75 5.96v1.36c-.08-.02-.16-.04-.24-.04-.83 0-1.59.32-2.16.85a6.17 6.17 0 0 0-1.35 3.24c.08.94.42 1.85.99 2.63a7.67 7.67 0 0 0 2.6 1.96c1.8.66 3.87.63 5.62-.1a7.68 7.68 0 0 0 3.5-2.16c.83-1.02 1.29-2.31 1.29-3.63v-.85a6.52 6.52 0 0 1-.9-3.18c.04-.7-.02-1.39-.18-2.05a8.09 8.09 0 0 0-2.3-3.7c-.94-.74-2.15-1.21-3.47-1.28a9.4 9.4 0 0 0-3.28.4 8.06 8.06 0 0 0-3.13 2.3c-.73.92-1.13 2.03-1.13 3.22v.42c.02.56.12 1.1.29 1.62.17-.5.43-.96.78-1.36.57-.65 1.36-1.09 2.26-1.25.72-.13 1.46-.06 2.13.2a5.5 5.5 0 0 1 1.61 1.22l.27.34c.18.22.32.46.43.72z',
  email: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  phone: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  website: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.98-2.1 5.28z',
  link: 'M3.9 12c0-1.43.88-2.83 2.09-3.71l1.8-1.79c.39-.39.39-1.02 0-1.41l-1.8-1.79a2.018 2.018 0 0 0-1.41 0l-1.8 1.79c-.39.39-.39 1.02 0 1.41l1.8 1.79A2.01 2.01 0 0 0 3.9 12zm8 0c0 1.43-.88 2.83-2.09 3.71l-1.8 1.79c-.39.39-.39 1.02 0 1.41l1.8 1.79a2.018 2.018 0 0 0 1.41 0l1.8-1.79c.39-.39.39-1.02 0-1.41l-1.8-1.79a2.01 2.01 0 0 0-2.09 0zM12 5.38c1.43 0 2.83.88 3.71 2.09l1.79 1.8c.39.39.39 1.02 0 1.41l-1.79 1.8a2.018 2.018 0 0 0-1.41 0l-1.8-1.79a2.01 2.01 0 0 0 0-2.09l1.79-1.8c.39-.39.39-1.02 0-1.41l-1.79-1.8a2.018 2.018 0 0 0-1.41 0l-1.8 1.79c-.39.39-.39 1.02 0 1.41l1.8 1.79c.61.61 1.5.98 2.09.73.17-.07.34-.11.51-.11z'
};

const brandColors = {
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
  link: { bg: 'bg-amber-400', text: 'text-gray-900' }
};

function Home() {
  const [profile, setProfile] = useState({ name: 'Shomarc', bio: '', avatarUrl: '', links: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLinkClick = (link) => {
    const icon = (link.icon || '').toLowerCase().trim();
    if (icon === 'whatsapp') {
      const phone = link.url.replace(/[^0-9]/g, '');
      const msg = link.message ? encodeURIComponent(link.message) : '';
      const waUrl = msg 
        ? `https://wa.me/${phone}?text=${msg}`
        : `https://wa.me/${phone}`;
      window.open(waUrl, '_blank');
    } else if (icon === 'email') {
      // Extract email from Gmail URLs or use URL as-is
      let email = link.url.trim()
      // Handle Gmail compose URLs
      const gmailMatch = email.match(/[?&]to=([^&]+)/)
      if (gmailMatch) {
        email = decodeURIComponent(gmailMatch[1])
      } else if (email.startsWith('mailto:')) {
        // Extract email from mailto: URLs
        email = email.substring(7).split('?')[0]
      } else if (email.startsWith('http')) {
        // Try to extract from other URL formats
        const mailtoMatch = email.match(/mailto:([^?]+)/)
        if (mailtoMatch) {
          email = mailtoMatch[1]
        }
      }
      const subject = encodeURIComponent(link.title || '')
      const body = link.message ? encodeURIComponent(link.message) : ''
      const mailtoUrl = `mailto:${email}${subject ? `?subject=${subject}` : ''}${body ? (subject ? '&' : '?') + `body=${body}` : ''}`
      window.open(mailtoUrl, '_blank')
      return
    } else {
      window.open(redirectLink(link._id), '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  const sortedLinks = [...(profile.links || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-amber-50 to-white"></div>
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-amber-100 opacity-40 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute top-24 left-0 w-48 h-48 rounded-full bg-yellow-50 opacity-60 -translate-x-1/2"></div>

      <motion.div 
            className="relative z-10 py-12 px-4"
            initial="hidden"
            animate="visible"
          >
          <div className="max-w-sm mx-auto">
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative inline-block mb-5">
                {profile?.avatarUrl ? (
                  <motion.img 
                    src={profile.avatarUrl} 
                    alt={profile.name} 
                    className="w-28 h-28 mx-auto object-cover shadow-2xl ring-4 ring-amber-100"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />
                ) : (
                  <motion.div 
                    className="w-28 h-28 mx-auto bg-amber-400 flex items-center justify-center shadow-2xl ring-4 ring-amber-100"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <span className="text-5xl text-white font-black">{profile?.name?.charAt(0) || 'S'}</span>
                  </motion.div>
                )}
              </div>

              <h1 className="text-2xl font-black text-gray-900">{profile?.name || 'Shomarc'}</h1>
              {profile?.bio && <p className="text-gray-500 text-sm mt-2">{profile.bio}</p>}
            </motion.div>

          <motion.div 
            className="flex flex-col gap-2"
            initial="hidden"
            animate="visible"
          >
            {sortedLinks.map((link, index) => {
              const colors = brandColors[link.icon] || brandColors.link;
              return (
              <motion.button
                key={link._id}
                onClick={() => handleLinkClick(link)}
                className="flex items-center gap-3 py-3 px-4 text-gray-900 font-medium hover:opacity-80 transition-all duration-200 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-9 h-9 ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <svg className={`w-5 h-5 ${colors.text}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d={socialIcons[link.icon] || socialIcons.link} />
                  </svg>
                </div>
                <span className="flex-1 text-left">{link.title}</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            );
            })}
          </motion.div>

          {sortedLinks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No links yet</p>
              <Link to="/admin" className="text-amber-500 text-sm mt-2 block">Add links in admin</Link>
            </div>
          )}

          <motion.footer 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
          </motion.footer>
        </div>
        </motion.div>
    </div>
  );
}

export default Home;