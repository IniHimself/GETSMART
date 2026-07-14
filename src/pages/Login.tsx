import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithGoogle, signIn, forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      navigate('/home');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password.');
      } else {
        setError(err.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }
    setResetLoading(true);
    setError('');
    setSuccess('');
    try {
      await forgotPassword(resetEmail);
      setSuccess('Password reset email sent! Check your inbox.');
      setTimeout(() => {
        setShowForgot(false);
        setSuccess('');
        setResetEmail('');
      }, 3000);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else {
        setError(err.message || 'Failed to send reset email');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--background-color)',
      padding: '1rem'
    }}>
      <style>{`
        .login-container {
          display: flex;
          max-width: 900px;
          width: 100%;
          min-height: 580px;
          border-radius: var(--border-radius-card);
          overflow: hidden;
          box-shadow: var(--box-shadow-xl);
        }
        .login-branding {
          flex: 1.2;
          background: linear-gradient(135deg, var(--nightLight) 0%, var(--darkLavender) 100%);
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: var(--dawn);
          position: relative;
          overflow: hidden;
        }
        .login-branding::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(203,140,227,0.15) 0%, transparent 70%);
          animation: pulse 8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .login-form-panel {
          flex: 1;
          background: var(--background-color-secondary);
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          min-height: 48px;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          background-color: white;
          border: 2px solid var(--border-style);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          font-weight: 500;
          color: var(--text-color);
          width: 100%;
        }
        .social-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: var(--secondary-text-color);
          font-size: 0.8rem;
          margin: 1.5rem 0;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #a1a3a5;
        }
        .divider::before { margin-right: 0.5em; }
        .divider::after { margin-left: 0.5em; }
        @media (max-width: 768px) {
          .login-branding { display: none; }
          .login-form-panel { padding: 2rem; }
        }
      `}</style>

      <div className="login-container">
        {/* Branding Panel */}
        <div className="login-branding">
          <div style={{ position: 'relative', zIndex: 1 }}>
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
              <BookOpen size={36} color="var(--night)" />
            </div>
            <h1 style={{ 
              margin: '0 0 0.5rem 0', 
              fontSize: '2.25rem', 
              fontWeight: '700',
              letterSpacing: '-0.02em'
            }}>
              GetSmart
            </h1>
            <p style={{ 
              margin: '0 0 2rem 0', 
              fontSize: '1.125rem',
              opacity: 0.9,
              maxWidth: '280px',
              lineHeight: '1.6'
            }}>
              Your intelligent study companion for academic excellence
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '260px' }}>
              {[
                'AI-Powered Smart Study',
                'Spaced Repetition & Active Recall',
                'Real Nigerian University Content'
              ].map((feature, i) => (
                <div key={i} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  fontSize: '0.875rem'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--brightLavender)',
                    flexShrink: 0
                  }} />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="login-form-panel">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              margin: '0 0 0.5rem 0', 
              color: 'var(--text-color)',
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              {showForgot ? 'Reset Password' : 'Welcome back'}
            </h2>
            <p style={{ 
              margin: 0, 
              color: 'var(--secondary-text-color)',
              fontSize: '0.9rem'
            }}>
              {showForgot ? 'Enter your email to reset your password' : 'Sign in to continue your study journey'}
            </p>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(255, 50, 50, 0.1)',
              border: '1px solid var(--danger)',
              borderRadius: '10px',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid var(--success)',
              borderRadius: '10px',
              color: 'var(--success)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              {success}
            </div>
          )}

          {showForgot ? (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-color)', fontSize: '0.85rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary-text-color)' }} />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@university.edu.ng"
                  className="thea-text-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="primary-button-component btn-block"
                style={{ padding: '0.875rem' }}
              >
                {resetLoading ? 'Sending...' : 'Send Reset Email'}
                {!resetLoading && <KeyRound size={18} />}
              </button>

              <button
                type="button"
                onClick={() => { setShowForgot(false); setError(''); setSuccess(''); }}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '1rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit'
                }}
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <>
              {/* Google Sign In */}
              <button 
                onClick={handleGoogleLogin} 
                disabled={loading}
                className="social-btn"
                style={{ marginBottom: '0.5rem' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="divider">or</div>

              {/* Email Form */}
              <form onSubmit={handleEmailLogin}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-color)', fontSize: '0.85rem' }}>
                  Email
                </label>
                <div style={{ position: 'relative', marginBottom: '1rem' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary-text-color)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu.ng"
                    className="thea-text-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>

                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-color)', fontSize: '0.85rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary-text-color)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="thea-text-input"
                    style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--secondary-text-color)',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { setShowForgot(true); setResetEmail(email); setError(''); setSuccess(''); }}
                  style={{
                    display: 'block',
                    marginBottom: '1.5rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontFamily: 'inherit',
                    padding: 0
                  }}
                >
                  Forgot password?
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="primary-button-component btn-block"
                  style={{ padding: '0.875rem' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <p style={{ 
                textAlign: 'center', 
                marginTop: '1.5rem',
                fontSize: '0.85rem',
                color: 'var(--secondary-text-color)'
              }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>
                  Sign Up
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
