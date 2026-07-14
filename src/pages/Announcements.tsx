import { useState } from 'react';
import { useAppGlobal } from '../context/AppContext';
import { Bell, GraduationCap, Globe } from 'lucide-react';

export default function Announcements() {
  const { announcements, markAnnouncementRead, profile } = useAppGlobal();
  const [filter, setFilter] = useState<'all' | 'system' | 'university'>('all');

  const filteredAnnouncements = announcements.filter(a => {
    if (filter === 'system') return a.type === 'system';
    if (filter === 'university') return a.type === 'university';
    return true;
  });

  return (
    <div className="fade-enter fade-enter-active">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          marginTop: 0, 
          color: 'var(--text-color)',
          fontSize: '2rem',
          fontWeight: '700',
          letterSpacing: '-0.02em'
        }}>
          Announcements
        </h1>
        <p style={{ 
          color: 'var(--secondary-text-color)',
          fontSize: '1.125rem'
        }}>
          {profile.university ? `Updates for your university and the platform` : 'Platform updates and news'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        background: 'var(--background-color-secondary)',
        padding: '0.375rem',
        borderRadius: '12px',
        width: 'fit-content'
      }}>
        {[
          { key: 'all', label: 'All', icon: Bell },
          { key: 'system', label: 'System', icon: Globe },
          { key: 'university', label: 'University', icon: GraduationCap }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: filter === key ? 'var(--primary)' : 'transparent',
              color: filter === key ? 'white' : 'var(--secondary-text-color)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '500',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease'
            }}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
        {filteredAnnouncements.length === 0 && (
          <div className="login-content" style={{ padding: '3rem', textAlign: 'center' }}>
            <Bell size={48} color="var(--secondary-text-color)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-color)' }}>No announcements</h3>
            <p style={{ margin: 0, color: 'var(--secondary-text-color)', fontSize: '0.9rem' }}>
              {filter === 'university' && !profile.university 
                ? 'Complete your profile to see university-specific announcements'
                : 'There are no announcements to display'}
            </p>
          </div>
        )}
        {filteredAnnouncements.map(a => (
          <div key={a.id} className="login-content" style={{ 
            padding: '1.5rem', 
            borderLeft: a.unread ? '4px solid var(--primary)' : '4px solid transparent',
            cursor: a.unread ? 'pointer' : 'default',
            transition: 'all 0.2s ease'
          }} onClick={() => a.unread && markAnnouncementRead(a.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1rem', fontWeight: '600' }}>{a.title}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  background: a.type === 'system' ? 'rgba(0,117,255,0.1)' : 'rgba(57,203,63,0.1)',
                  color: a.type === 'system' ? 'var(--primary)' : 'var(--success)',
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '999px',
                  fontWeight: '600'
                }}>
                  {a.type === 'system' ? 'System' : 'University'}
                </span>
                <span style={{ 
                  opacity: 0.6, 
                  fontSize: '0.8rem', 
                  color: 'var(--secondary-text-color)'
                }}>
                  {a.source}
                </span>
              </div>
            </div>
            {a.unread && (
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '500' }}>
                New - Click to mark read
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
