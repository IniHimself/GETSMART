import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UNIVERSITIES } from '../data/courses';
import OnboardingLayout from '../components/layout/OnboardingLayout';
import { useAppGlobal } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, setProfile, isOnboarded, setOnboarded } = useAppGlobal();
  const { user } = useAuth();
  
  useEffect(() => {
    if (isOnboarded && profile.university) {
      navigate('/home');
    }
  }, [isOnboarded, profile.university, navigate]);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: profile.name || user?.displayName || '',
    email: profile.email || user?.email || '',
    university: profile.university || '',
    faculty: profile.faculty || '',
    department: profile.department || '',
    courseLevel: '100'
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectedUni = UNIVERSITIES.find(u => u.id === formData.university);
  const faculties = selectedUni?.faculties || [];
  const departments = selectedUni?.faculties.find(f => f.id === formData.faculty)?.departments || [];

  const handleFinish = () => {
    setProfile({
      name: formData.name,
      email: formData.email,
      university: formData.university,
      faculty: formData.faculty,
      department: formData.department,
      courseLevel: '100'
    });
    setOnboarded(true);
    navigate('/home');
  };

  return (
    <OnboardingLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map(num => (
          <div key={num} style={{
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: step >= num ? 'var(--primary)' : 'var(--background-color-secondary)',
            color: step >= num ? 'var(--button-text-color)' : 'var(--secondary-text-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', fontWeight: '600',
            transition: 'all 0.3s ease'
          }}>
            {num}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="fade-enter fade-enter-active">
          <h2 style={{ marginTop: 0, color: 'var(--text-color)', fontSize: '1.5rem', fontWeight: '600' }}>
            Basic Info
          </h2>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-color)', fontSize: '0.9rem' }}>
            Full Name
          </label>
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className="thea-text-input"
            style={{ marginBottom: '1rem' }}
            placeholder="Enter your full name" 
          />
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-color)', fontSize: '0.9rem' }}>
            Email
          </label>
          <input 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className="thea-text-input"
            style={{ marginBottom: '1.5rem' }}
            placeholder="you@university.edu.ng" 
            type="email" 
          />
          <button 
            className="primary-button-component btn-block"
            onClick={handleNext} 
            disabled={!formData.name || !formData.email}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="fade-enter fade-enter-active">
          <h2 style={{ marginTop: 0, color: 'var(--text-color)', fontSize: '1.5rem', fontWeight: '600' }}>
            Select University
          </h2>
          <select 
            name="university" 
            value={formData.university} 
            onChange={(e) => {
              handleChange(e);
              setFormData(prev => ({...prev, faculty: '', department: ''}));
            }} 
            className="thea-text-input"
            style={{ marginBottom: '1.5rem' }}
          >
            <option value="">Choose your university...</option>
            {UNIVERSITIES.map(uni => (
              <option key={uni.id} value={uni.id}>{uni.name}</option>
            ))}
          </select>
          <div style={{ 
            padding: '0.75rem', 
            background: 'rgba(0, 117, 255, 0.1)', 
            borderRadius: '10px', 
            fontSize: '0.8rem',
            color: 'var(--primary)',
            marginBottom: '1.5rem'
          }}>
            Currently only 100 level is supported
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="ghost-button-component" style={{ flex: 1 }} onClick={handleBack}>
              Back
            </button>
            <button 
              className="primary-button-component" 
              style={{ flex: 2 }} 
              onClick={handleNext} 
              disabled={!formData.university}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="fade-enter fade-enter-active">
          <h2 style={{ marginTop: 0, color: 'var(--text-color)', fontSize: '1.5rem', fontWeight: '600' }}>
            Academic Details
          </h2>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-color)', fontSize: '0.9rem' }}>
            Faculty
          </label>
          <select 
            name="faculty" 
            value={formData.faculty} 
            onChange={(e) => {
              handleChange(e);
              setFormData(prev => ({...prev, department: ''}));
            }} 
            className="thea-text-input"
            style={{ marginBottom: '1rem' }}
          >
            <option value="">Select Faculty...</option>
            {faculties.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-color)', fontSize: '0.9rem' }}>
            Department
          </label>
          <select 
            name="department" 
            value={formData.department} 
            onChange={handleChange} 
            className="thea-text-input"
            style={{ marginBottom: '1.5rem' }}
            disabled={!formData.faculty}
          >
            <option value="">Select Department...</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="ghost-button-component" style={{ flex: 1 }} onClick={handleBack}>
              Back
            </button>
            <button 
              className="primary-button-component" 
              style={{ flex: 2 }} 
              onClick={handleNext} 
              disabled={!formData.department}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="fade-enter fade-enter-active">
          <h2 style={{ marginTop: 0, color: 'var(--text-color)', fontSize: '1.5rem', fontWeight: '600' }}>
            Course Level
          </h2>
          <div style={{
            padding: '1.5rem',
            background: 'var(--background-color)',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '2px solid var(--primary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem'
              }}>
                1
              </div>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-color)' }}>100 Level</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text-color)' }}>First Year - All courses available</div>
              </div>
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            background: 'rgba(253, 189, 25, 0.1)',
            borderRadius: '10px',
            fontSize: '0.85rem',
            color: 'var(--gold)',
            marginBottom: '1.5rem'
          }}>
            Other levels (200-500) will be available soon. Stay tuned!
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="ghost-button-component" style={{ flex: 1 }} onClick={handleBack}>
              Back
            </button>
            <button 
              className="primary-button-component" 
              style={{ flex: 2, background: 'var(--success)' }} 
              onClick={handleFinish}
            >
              Complete Setup
            </button>
          </div>
        </div>
      )}
    </OnboardingLayout>
  );
}
