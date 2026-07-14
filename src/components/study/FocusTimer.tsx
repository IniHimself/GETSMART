import { useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Bell, BellOff, Coffee, Target } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

interface FocusTimerProps {
  onBack: () => void;
}

export default function FocusTimer({ onBack }: FocusTimerProps) {
  const { 
    startFocusTimer, 
    pauseFocusTimer, 
    resumeFocusTimer, 
    stopFocusTimer,
    getFocusTimeFormatted,
    isFocusRunning,
    focusMode,
    focusCompletedCount,
    timerState,
    requestNotificationPermissions,
    notificationPermission
  } = useStudy();

  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  const focusTimer = timerState.focusTimer;
  const timeFormatted = getFocusTimeFormatted();
  
  const totalSeconds = focusTimer 
    ? (focusTimer.mode === 'focus' ? focusDuration * 60 : breakDuration * 60)
    : focusDuration * 60;
  const remainingSeconds = focusTimer?.timeRemaining ?? (focusDuration * 60);
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  const handleStartFocus = useCallback(async () => {
    if (notificationPermission === 'default') {
      await requestNotificationPermissions();
    }
    startFocusTimer(focusDuration, breakDuration);
  }, [notificationPermission, focusDuration, breakDuration, requestNotificationPermissions, startFocusTimer]);

  const handlePauseResume = useCallback(() => {
    if (isFocusRunning) {
      pauseFocusTimer();
    } else {
      resumeFocusTimer();
    }
  }, [isFocusRunning, pauseFocusTimer, resumeFocusTimer]);

  const handleReset = useCallback(() => {
    stopFocusTimer();
  }, [stopFocusTimer]);

  const getModeColor = () => {
    if (!focusTimer) return 'var(--primary)';
    return focusTimer.mode === 'focus' ? 'var(--primary)' : 'var(--success)';
  };

  const getModeLabel = () => {
    if (!focusTimer) return 'Ready to Focus';
    return focusTimer.mode === 'focus' ? 'Focus Time' : 'Break Time';
  };

  return (
    <div className="fade-enter fade-enter-active" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      height: '100%',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <button 
        onClick={onBack} 
        style={{ 
          alignSelf: 'flex-start', 
          marginBottom: '2rem', 
          background: 'none', 
          border: 'none', 
          color: 'var(--primary)', 
          cursor: 'pointer', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.9rem',
          fontFamily: 'inherit'
        }}
      >
        ← Back to Study
      </button>

      <h2 style={{ marginTop: 0, color: 'var(--text-color)' }}>Focus Timer</h2>
      <p style={{ opacity: 0.7, color: 'var(--secondary-text-color)', marginBottom: '2rem' }}>
        {focusTimer ? getModeLabel() : 'Configure your Pomodoro timer'}
      </p>

      {/* Timer Display */}
      <div style={{ 
        position: 'relative', 
        width: '300px', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: '2rem 0'
      }}>
        <svg style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="var(--background-color-secondary)"
            strokeWidth="8"
          />
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke={getModeColor()}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 140}`}
            strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        <div style={{
          position: 'relative',
          width: '260px',
          height: '260px',
          background: 'var(--background-color-secondary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid var(--border-style)'
        }}>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: getModeColor(), fontFamily: 'monospace' }}>
            {timeFormatted}
          </div>
          <p style={{ margin: 0, opacity: 0.7, fontSize: '1rem', color: 'var(--secondary-text-color)' }}>
            {focusMode === 'focus' ? 'Focus Time' : focusMode === 'break' ? 'Break Time' : 'Ready'}
          </p>
        </div>
      </div>

      {/* Status Badges */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {focusTimer && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: focusMode === 'focus' ? 'rgba(0, 117, 255, 0.1)' : 'rgba(57, 203, 63, 0.1)',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: '500',
              color: focusMode === 'focus' ? 'var(--primary)' : 'var(--success)'
            }}>
              {focusMode === 'focus' ? <Target size={14} /> : <Coffee size={14} />}
              {focusMode === 'focus' ? 'Focusing' : 'On Break'}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'var(--background-color)',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: '500',
              color: 'var(--secondary-text-color)'
            }}>
              Completed: {focusCompletedCount}
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      {!focusTimer ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-color)' }}>
                Focus (min)
              </label>
              <input
                type="number"
                min="5"
                max="60"
                value={focusDuration}
                onChange={(e) => setFocusDuration(parseInt(e.target.value) || 25)}
                className="thea-text-input"
                style={{ textAlign: 'center' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-color)' }}>
                Break (min)
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={breakDuration}
                onChange={(e) => setBreakDuration(parseInt(e.target.value) || 5)}
                className="thea-text-input"
                style={{ textAlign: 'center' }}
              />
            </div>
          </div>

          <button
            onClick={handleStartFocus}
            className="primary-button-component btn-block"
            style={{ padding: '1rem', fontSize: '1.1rem' }}
          >
            <Play size={20} fill="currentColor" /> Start Focus
          </button>

          {notificationPermission === 'default' && (
            <p style={{ 
              textAlign: 'center', 
              fontSize: '0.8rem', 
              color: 'var(--secondary-text-color)',
              margin: '0.5rem 0 0'
            }}>
              <Bell size={12} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
              Notifications will be requested when you start
            </p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handlePauseResume}
            className="primary-button-component"
            style={{ 
              padding: '1rem 2rem',
              background: isFocusRunning ? 'var(--danger)' : 'var(--success)'
            }}
          >
            {isFocusRunning ? (
              <><Pause size={20} /> Pause</>
            ) : (
              <><Play size={20} fill="currentColor" /> Resume</>
            )}
          </button>
          <button
            onClick={handleReset}
            className="ghost-button-component"
            style={{ padding: '1rem' }}
            title="Reset Timer"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      )}

      {/* Notification Status */}
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: 'var(--secondary-text-color)'
      }}>
        {notificationPermission === 'granted' ? (
          <>
            <Bell size={14} color="var(--success)" />
            Notifications enabled
          </>
        ) : notificationPermission === 'denied' ? (
          <>
            <BellOff size={14} color="var(--danger)" />
            Notifications blocked (check browser settings)
          </>
        ) : (
          <>
            <Bell size={14} />
            Click start to enable notifications
          </>
        )}
      </div>
    </div>
  );
}
