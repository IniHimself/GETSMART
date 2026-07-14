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
          border-right: 1px solid var(--color-border, rgba(0,0,0,0.1));
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
            height: 70px;
            position: fixed;
            bottom: 0;
            left: 0;
            flex-direction: row;
            border-right: none;
            border-top: 1px solid var(--color-border, rgba(0,0,0,0.1));
            padding: 0 0.5rem;
            justify-content: space-around;
            align-items: center;
            z-index: 1000;
          }
          .hide-on-mobile { display: none; }
          .main-content { padding-bottom: 90px; }
          .sidebar-brand { display: none; }
          .nav-links-container { 
            display: flex; 
            width: 100%; 
            justify-content: space-between;
          }
          .nav-links-container a { 
            margin-bottom: 0; 
            padding: 0.75rem; 
            justify-content: center;
          }
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

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
