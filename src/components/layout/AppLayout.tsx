import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Calendar, BookOpen, User, Bell, Clock } from 'lucide-react';
import { useAppGlobal } from '../../context/AppContext';
import { useStudy } from '../../context/StudyContext';

const SidebarItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `base-button-component ${isActive ? 'primary-button-component' : 'ghost-button-component'} btn-block`
    }
    style={{ justifyContent: 'flex-start', marginBottom: '0.5rem' }}
  >
    {icon}
    <span className="hide-on-mobile">{label}</span>
  </NavLink>
);

export default function AppLayout() {
  const navigate = useNavigate();
  const { unreadCount } = useAppGlobal();
  const { timerState, getCurrentDuration, formatDuration } = useStudy();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background-color)' }}>
      <style>{`
        .app-sidebar {
          width: 240px;
          padding: 1.5rem 1rem;
          background: var(--background-color-secondary);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          z-index: 50;
          border-right: 1px solid rgba(0,0,0,0.1);
        }
        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          height: 100vh;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .app-sidebar {
            width: 100%;
            height: auto;
            min-height: 64px;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            flex-direction: row;
            border-right: none;
            border-top: 1px solid rgba(0,0,0,0.1);
            padding: 0.375rem 0.5rem;
            padding-bottom: calc(0.375rem + env(safe-area-inset-bottom, 0px));
            justify-content: space-around;
            align-items: center;
            z-index: 1000;
            background: var(--background-color-secondary);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
          .hide-on-mobile { display: none !important; }
          .main-content { 
            padding: 1rem !important; 
            padding-bottom: calc(80px + env(safe-area-inset-bottom, 0px)) !important; 
          }
          .sidebar-brand { display: none !important; }
          .nav-links-container { 
            display: flex; 
            width: 100%; 
            justify-content: space-around;
            align-items: center;
          }
          .nav-links-container a { 
            margin-bottom: 0 !important; 
            padding: 0.5rem !important; 
            justify-content: center;
            border-radius: 12px !important;
            min-width: 48px;
            min-height: 48px;
          }
          .nav-links-container a span {
            display: none;
          }
          .timer-pill-mobile {
            display: flex !important;
            position: fixed;
            bottom: 72px;
            left: 50%;
            transform: translateX(-50%);
            padding: 0.5rem 1rem;
            background: var(--primary);
            color: white;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 600;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: bounceIn 0.3s ease;
          }
        }
        @media (min-width: 769px) {
          .timer-pill-mobile { display: none !important; }
        }
      `}</style>
      
      <div className="app-sidebar">
        <div 
          className="sidebar-brand" 
          style={{ marginBottom: '2rem', cursor: 'pointer', textAlign: 'center' }} 
          onClick={() => navigate('/home')}
        >
          <h2 style={{ 
            color: 'var(--primary)', 
            margin: 0, 
            fontSize: '1.75rem', 
            fontWeight: '700',
            letterSpacing: '-0.02em'
          }}>
            GetSmart
          </h2>
        </div>
        
        <div className="nav-links-container">
          <SidebarItem to="/home" icon={<Home size={20} />} label="Home" />
          <SidebarItem to="/schedule" icon={<Calendar size={20} />} label="Planner" />
          <SidebarItem to="/study" icon={<BookOpen size={20} />} label="Study" />
          
          <NavLink
            to="/announcements"
            className={({ isActive }) =>
              `base-button-component ${isActive ? 'primary-button-component' : 'ghost-button-component'} btn-block`
            }
            style={{ justifyContent: 'flex-start', marginBottom: '0.5rem', position: 'relative' }}
          >
            <div style={{ position: 'relative' }}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute', top: -5, right: -5, width: 10, height: 10,
                  backgroundColor: 'var(--danger)', borderRadius: '50%',
                  border: '2px solid var(--background-color-secondary)'
                }} />
              )}
            </div>
            <span className="hide-on-mobile">Announcements</span>
          </NavLink>

          <div style={{ flex: 1 }} className="hide-on-mobile" />
          
          {timerState.session?.isActive && (
            <div className="hide-on-mobile" style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: 'var(--primary)',
              color: 'var(--button-text-color)',
              borderRadius: '50px',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              <Clock size={16} />
              {formatDuration(getCurrentDuration())}
            </div>
          )}
          
          <SidebarItem to="/profile" icon={<User size={20} />} label="Profile" />
        </div>
      </div>

      {/* Mobile timer pill */}
      {timerState.session?.isActive && (
        <div className="timer-pill-mobile" onClick={() => navigate('/study')}>
          <Clock size={14} style={{ marginRight: '0.375rem' }} />
          {formatDuration(getCurrentDuration())}
        </div>
      )}

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
