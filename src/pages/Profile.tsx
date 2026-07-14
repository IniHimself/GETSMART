import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppGlobal } from '../context/AppContext';
import { useStudy } from '../context/StudyContext';
import { UNIVERSITIES } from '../data/courses';
import { User, Mail, GraduationCap, BookOpen, Building2, LogOut, Save, X, Clock, Brain, Trophy } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, setProfile } = useAppGlobal();
  const { timerState, cardStats } = useStudy();
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    university: profile.university,
    faculty: profile.faculty,
    department: profile.department
  });

  const selectedUni = UNIVERSITIES.find(u => u.id === formData.university);
  const faculties = selectedUni?.faculties || [];
  const departments = selectedUni?.faculties.find(f => f.id === formData.faculty)?.departments || [];

  const handleSave = () => {
    setProfile({
      ...formData,
      courseLevel: '100'
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      email: profile.email,
      university: profile.university,
      faculty: profile.faculty,
      department: profile.department
    });
    setEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isNewStudent = !profile.university || !profile.faculty || !profile.department;

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
          Profile Settings
        </h1>
        <p style={{ 
          color: 'var(--secondary-text-color)',
          fontSize: '1.125rem'
        }}>
          {isNewStudent ? 'Complete your profile to get started' : 'Manage your account and academic info'}
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '1.5rem',
        maxWidth: '900px'
      }}>
        
        {/* Profile Info Card */}
        <div className="login-content" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: user?.photoURL ? 'none' : 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={24} color="white" />
              )}
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.125rem', fontWeight: '600' }}>
                {profile.name || 'New Student'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--secondary-text-color)' }}>
                {profile.email || user?.email || 'No email set'}
              </p>
            </div>
          </div>

          {!editing ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--background-color)', borderRadius: '10px' }}>
                  <User size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text-color)' }}>Full Name</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: '500' }}>{profile.name || 'Not set'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--background-color)', borderRadius: '10px' }}>
                  <Mail size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text-color)' }}>Email</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: '500' }}>{profile.email || user?.email || 'Not set'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--background-color)', borderRadius: '10px' }}>
                  <GraduationCap size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text-color)' }}>University</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: '500' }}>{selectedUni?.name || 'Not set'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--background-color)', borderRadius: '10px' }}>
                  <Building2 size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text-color)' }}>Faculty</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: '500' }}>{faculties.find(f => f.id === profile.faculty)?.name || 'Not set'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--background-color)', borderRadius: '10px' }}>
                  <BookOpen size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text-color)' }}>Department</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: '500' }}>{departments.find(d => d.id === profile.department)?.name || 'Not set'}</div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setEditing(true)}
                className="primary-button-component btn-block"
                style={{ marginTop: '1.5rem', padding: '0.75rem' }}
              >
                Edit Academic Info
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-color)', fontSize: '0.85rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="thea-text-input"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-color)', fontSize: '0.85rem' }}>
                    University
                  </label>
                  <select
                    value={formData.university}
                    onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value, faculty: '', department: '' }))}
                    className="thea-text-input"
                  >
                    <option value="">Select University...</option>
                    {UNIVERSITIES.map(uni => (
                      <option key={uni.id} value={uni.id}>{uni.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-color)', fontSize: '0.85rem' }}>
                    Faculty
                  </label>
                  <select
                    value={formData.faculty}
                    onChange={(e) => setFormData(prev => ({ ...prev, faculty: e.target.value, department: '' }))}
                    className="thea-text-input"
                    disabled={!formData.university}
                  >
                    <option value="">Select Faculty...</option>
                    {faculties.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-color)', fontSize: '0.85rem' }}>
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="thea-text-input"
                    disabled={!formData.faculty}
                  >
                    <option value="">Select Department...</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={handleCancel} className="ghost-button-component" style={{ flex: 1, padding: '0.75rem' }}>
                  <X size={18} /> Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="primary-button-component"
                  style={{ flex: 2, padding: '0.75rem' }}
                  disabled={!formData.name || !formData.university || !formData.faculty || !formData.department}
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </>
          )}
        </div>

        {/* Study Statistics Card */}
        <div className="login-content" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trophy size={20} color="var(--button-text-color)" />
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.125rem', fontWeight: '600' }}>
              Study Statistics
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ 
              textAlign: 'center', 
              padding: '1.25rem',
              background: 'var(--background-color)',
              borderRadius: '12px'
            }}>
              <Clock size={20} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                {timerState.totalSessionTime > 0 ? Math.floor(timerState.totalSessionTime / 60) : 0}m
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text-color)', fontWeight: '500' }}>
                Total Study Time
              </div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '1.25rem',
              background: 'var(--background-color)',
              borderRadius: '12px'
            }}>
              <Brain size={20} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                {cardStats.total}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text-color)', fontWeight: '500' }}>
                Total Cards
              </div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '1.25rem',
              background: 'var(--background-color)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
                {cardStats.masteredCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text-color)', fontWeight: '500' }}>
                Cards Mastered
              </div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '1.25rem',
              background: 'var(--background-color)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--gold)' }}>
                {timerState.dailyProgress}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--secondary-text-color)', fontWeight: '500' }}>
                Daily Minutes
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-style)' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-color)', fontSize: '0.95rem', fontWeight: '600' }}>
              Account
            </h4>
            <button 
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 50, 50, 0.1)',
                border: '1px solid rgba(255, 50, 50, 0.2)',
                borderRadius: '10px',
                color: 'var(--danger)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                width: '100%',
                fontFamily: 'inherit'
              }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
