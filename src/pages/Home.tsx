import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, CheckCircle, Clock, Target, Sparkles } from 'lucide-react';
import { useAppGlobal } from '../context/AppContext';
import { useStudy } from '../context/StudyContext';

export default function Home() {
  const navigate = useNavigate();
  const { profile } = useAppGlobal();
  const { timerState, cardStats, todaysCards, getCurrentDuration, formatDuration } = useStudy();

  const isNewStudent = !profile.university || !profile.faculty || !profile.department;
  const currentDuration = getCurrentDuration();
  const progressPercent = Math.min(100, (timerState.dailyProgress / timerState.dailyGoal) * 100);

  if (isNewStudent) {
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
            Welcome to GetSmart
          </h1>
          <p style={{ 
            color: 'var(--secondary-text-color)',
            fontSize: '1.125rem'
          }}>
            Complete your profile to start your study journey
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          maxWidth: '800px'
        }}>
          {/* Getting Started Card */}
          <div className="login-content" style={{ padding: '2rem', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={24} color="white" />
              </div>
              <div>
                <h2 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.25rem', fontWeight: '600' }}>
                  Get Started in 3 Steps
                </h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--secondary-text-color)' }}>
                  Set up your profile to unlock all features
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { step: 1, title: 'Select Your University', desc: 'Choose between Redeemer\'s University or Vision University', done: !!profile.university },
                { step: 2, title: 'Choose Faculty & Department', desc: 'Pick your specific academic path', done: !!profile.faculty && !!profile.department },
                { step: 3, title: 'Start Studying', desc: 'Access AI-powered study tools and course materials', done: false }
              ].map(({ step, title, desc, done }) => (
                <div key={step} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  background: done ? 'rgba(57, 203, 63, 0.05)' : 'var(--background-color)',
                  border: `1px solid ${done ? 'var(--success)' : 'var(--border-style)'}`,
                  borderRadius: '12px',
                  opacity: done ? 0.7 : 1
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: done ? 'var(--success)' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    flexShrink: 0
                  }}>
                    {done ? '✓' : step}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '0.95rem' }}>{title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text-color)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate('/profile')}
              className="primary-button-component btn-block"
              style={{ marginTop: '1.5rem', padding: '1rem 2rem', fontSize: '1rem' }}
            >
              Complete Your Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          Dashboard
        </h1>
        <p style={{ 
          color: 'var(--secondary-text-color)',
          fontSize: '1.125rem'
        }}>
          Welcome back, {profile.name || 'Student'}. Here's your study overview.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '1.5rem'
      }}>
        
        {/* Quick Start Card */}
        <div className="login-content" style={{ padding: '2rem' }}>
          <h2 style={{ 
            margin: '0 0 0.5rem 0', 
            color: 'var(--text-color)',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            Quick Study
          </h2>
          <p style={{ 
            color: 'var(--secondary-text-color)',
            marginBottom: '1.5rem'
          }}>
            Jump into your next study session
          </p>
          <p style={{ 
            fontSize: '0.875rem', 
            marginBottom: '1.5rem', 
            color: 'var(--secondary-text-color)'
          }}>
            {todaysCards.length > 0 ? `${todaysCards.length} cards ready for review` : 'Start studying to build your card deck'}
          </p>
          <button 
            onClick={() => navigate('/study')}
            className="primary-button-component btn-block"
            style={{ padding: '1rem 2rem', fontSize: '1rem' }}
          >
            <Play fill="currentColor" size={20} /> Start Study Session
          </button>
        </div>

        {/* Progress Strategy Widget */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
          color: 'var(--button-text-color)',
          padding: '2rem',
          borderRadius: 'var(--border-radius-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0, 117, 255, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>Daily Study Goal</h3>
          </div>
          <p style={{ margin: '0 0 1.5rem 0', opacity: 0.9, fontSize: '1.125rem' }}>
            {timerState.dailyProgress} / {timerState.dailyGoal} minutes
          </p>
          
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.2)', 
            height: '12px', 
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${progressPercent}%`, 
              height: '100%', 
              background: 'white', 
              borderRadius: '6px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          {progressPercent >= 100 && (
            <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', fontWeight: '500' }}>
              Goal achieved! Great work!
            </p>
          )}
        </div>

        {/* Card Statistics Widget */}
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
              <BookOpen size={20} color="var(--button-text-color)" />
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.25rem', fontWeight: '600' }}>
              Card Mastery
            </h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ 
              textAlign: 'center', 
              padding: '1rem',
              background: 'var(--background-color)',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                {cardStats.total}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text-color)', fontWeight: '500' }}>
                Total Cards
              </div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '1rem',
              background: 'var(--background-color)',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--success)' }}>
                {cardStats.masteredCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text-color)', fontWeight: '500' }}>
                Mastered
              </div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '1rem',
              background: 'var(--background-color)',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--brighterBlue)' }}>
                {cardStats.learningCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text-color)', fontWeight: '500' }}>
                Learning
              </div>
            </div>
            <div style={{ 
              textAlign: 'center', 
              padding: '1rem',
              background: 'var(--background-color)',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--gold)' }}>
                {cardStats.reviewCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text-color)', fontWeight: '500' }}>
                Review
              </div>
            </div>
          </div>
          
          {cardStats.dueToday > 0 && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'var(--background-color)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <CheckCircle size={20} color="var(--success)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: '500' }}>
                {cardStats.dueToday} cards due today
              </span>
            </div>
          )}
        </div>

        {/* Active Session Timer */}
        {timerState.session?.isActive && (
          <div className="login-content" style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={20} color="var(--button-text-color)" />
              </div>
              <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.25rem', fontWeight: '600' }}>
                Active Session
              </h3>
            </div>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: 'var(--primary)',
              letterSpacing: '-0.02em'
            }}>
              {formatDuration(currentDuration)}
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--secondary-text-color)' }}>
              {timerState.session.course} - {timerState.session.topic}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
