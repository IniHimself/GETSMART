import type { ReactNode } from 'react';

const OnboardingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background-color)',
      color: 'var(--text-color)',
      padding: '1rem'
    }}>
      <style>{`
        .onboarding-container {
          display: flex;
          max-width: 900px;
          width: 100%;
          min-height: 600px;
          border-radius: var(--border-radius-card);
          overflow: hidden;
          box-shadow: var(--box-shadow-xl);
        }
        .onboarding-branding {
          flex: 1;
          background: var(--nightLight);
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: var(--dawn);
        }
        .onboarding-form {
          flex: 1;
          background: var(--background-color-secondary);
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (max-width: 768px) {
          .onboarding-container {
            flex-direction: column;
            min-height: auto;
          }
          .onboarding-branding {
            display: none;
          }
          .onboarding-form {
            padding: 2rem;
          }
        }
      `}</style>
      
      <div className="onboarding-container">
        <div className="onboarding-branding">
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--brightLavender), var(--brighterLavender))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}>
            <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--night)' }}>G</span>
          </div>
          <h1 style={{ 
            margin: '0 0 0.5rem 0', 
            fontSize: '2rem', 
            fontWeight: '700',
            letterSpacing: '-0.02em'
          }}>
            GetSmart
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: '1.125rem',
            opacity: 0.9,
            maxWidth: '280px',
            lineHeight: '1.5'
          }}>
            Your personalized study companion for academic excellence
          </p>
          
          <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '240px' }}>
            {['Spaced repetition', 'Smart review', 'Progress tracking'].map((feature, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--brightLavender)'
                }} />
                <span style={{ fontSize: '0.9rem' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="onboarding-form">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              margin: '0 0 0.5rem 0', 
              color: 'var(--text-color)',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Welcome aboard
            </h2>
            <p style={{ 
              margin: 0, 
              color: 'var(--secondary-text-color)',
              fontSize: '0.9rem'
            }}>
              Let's set up your study profile
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
