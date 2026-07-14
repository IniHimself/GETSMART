/**
 * Timer Utilities for Study Sessions
 * Handles study session timing, persistence, and notifications
 */

export interface StudySession {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number; // in seconds
  course: string;
  topic: string;
  isActive: boolean;
}

export interface TimerState {
  session: StudySession | null;
  totalSessionTime: number; // Total time across all sessions in seconds
  dailyGoal: number; // Daily study goal in minutes
  dailyProgress: number; // Daily progress in minutes
  lastActivity: number; // Timestamp of last activity
  focusTimer?: FocusTimerSession | null; // Optional focus timer (pomodoro-style)
}

const STORAGE_KEY = 'getsmart_timer_state';
const DAILY_GOAL_DEFAULT = 120; // 2 hours default daily goal

/**
 * Load timer state from localStorage
 * @returns TimerState or default state
 */
export function loadTimerState(): TimerState {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const state = JSON.parse(stored) as TimerState;
      
      // Check if session is still valid (not expired)
      if (state.session && state.session.isActive) {
        const sessionDuration = Math.floor((Date.now() - state.session.startTime) / 1000);
        // If session has been running for more than 24 hours, consider it expired
        if (sessionDuration > 86400) {
          state.session = null;
        }
      }
      
      return state;
    } catch {
      // If parsing fails, return default
    }
  }
  
  return {
    session: null,
    totalSessionTime: 0,
    dailyGoal: DAILY_GOAL_DEFAULT,
    dailyProgress: 0,
    lastActivity: Date.now()
  };
}

/**
 * Save timer state to localStorage
 * @param state TimerState to save
 */
export function saveTimerState(state: TimerState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Start a new study session
 * @param course Course being studied
 * @param topic Topic being studied
 * @returns Updated TimerState
 */
export function startSession(course: string, topic: string): TimerState {
  let state = loadTimerState();
  
  // End any existing session first
  if (state.session && state.session.isActive) {
    state = endSession();
  }
  
  const newSession: StudySession = {
    id: `session_${Date.now()}`,
    startTime: Date.now(),
    endTime: null,
    duration: 0,
    course,
    topic,
    isActive: true
  };
  
  const newState: TimerState = {
    ...state,
    session: newSession,
    lastActivity: Date.now()
  };
  
  saveTimerState(newState);
  return newState;
}

/**
 * End the current study session
 * @returns Updated TimerState
 */
export function endSession(): TimerState {
  const state = loadTimerState();
  
  if (!state.session || !state.session.isActive) {
    return state;
  }
  
  const endTime = Date.now();
  const duration = Math.floor((endTime - state.session.startTime) / 1000);
  
  // Update daily progress
  const today = new Date().toDateString();
  const sessionDate = new Date(state.session.startTime).toDateString();
  
  let newDailyProgress = state.dailyProgress;
  if (sessionDate === today) {
    newDailyProgress += Math.floor(duration / 60); // Convert to minutes
  }
  
  const newState: TimerState = {
    ...state,
    session: {
      ...state.session,
      endTime,
      duration,
      isActive: false
    },
    totalSessionTime: state.totalSessionTime + duration,
    dailyProgress: newDailyProgress,
    lastActivity: endTime
  };
  
  saveTimerState(newState);
  return newState;
}

/**
 * Pause the current study session
 * @returns Updated TimerState
 */
export function pauseSession(): TimerState {
  const state = loadTimerState();
  
  if (!state.session || !state.session.isActive) {
    return state;
  }
  
  const pauseTime = Date.now();
  const durationSoFar = Math.floor((pauseTime - state.session.startTime) / 1000);
  
  const newState: TimerState = {
    ...state,
    session: {
      ...state.session,
      endTime: pauseTime,
      duration: durationSoFar,
      isActive: false
    },
    lastActivity: pauseTime
  };
  
  saveTimerState(newState);
  return newState;
}

/**
 * Resume a paused study session
 * @returns Updated TimerState
 */
export function resumeSession(): TimerState {
  const state = loadTimerState();
  
  if (!state.session || state.session.isActive) {
    return state;
  }
  
  // Only resume if session was paused (has endTime but isActive is false)
  if (state.session.endTime) {
    const newState: TimerState = {
      ...state,
      session: {
        ...state.session,
        startTime: Date.now() - (state.session.duration * 1000),
        endTime: null,
        isActive: true
      },
      lastActivity: Date.now()
    };
    
    saveTimerState(newState);
    return newState;
  }
  
  return state;
}

/**
 * Get current session duration in seconds
 * @returns Duration in seconds or 0 if no active session
 */
export function getCurrentSessionDuration(): number {
  const state = loadTimerState();
  
  if (!state.session || !state.session.isActive) {
    return 0;
  }
  
  return Math.floor((Date.now() - state.session.startTime) / 1000);
}

/**
 * Get formatted time string from seconds
 * @param seconds Seconds to format
 * @returns Formatted string (HH:MM:SS or MM:SS)
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get formatted short time string (for badges, etc.)
 * @param seconds Seconds to format
 * @returns Formatted string (MMm or HHh MMm)
 */
export function formatShortTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Reset daily progress (call at midnight or when starting a new day)
 * @returns Updated TimerState
 */
export function resetDailyProgress(): TimerState {
  const currentState = loadTimerState();
  
  const newState: TimerState = {
    ...currentState,
    dailyProgress: 0,
    lastActivity: Date.now()
  };
  
  saveTimerState(newState);
  return newState;
}

/**
 * Set daily study goal
 * @param minutes Goal in minutes
 * @returns Updated TimerState
 */
export function setDailyGoal(minutes: number): TimerState {
  const state = loadTimerState();
  
  const newState: TimerState = {
    ...state,
    dailyGoal: minutes
  };
  
  saveTimerState(newState);
  return newState;
}

/**
 * Get timer statistics
 * @returns Timer statistics
 */
export function getTimerStatistics(): {
  totalTime: string;
  dailyProgress: number;
  dailyGoal: number;
  progressPercent: number;
  isActive: boolean;
  currentSessionDuration: string;
} {
  const state = loadTimerState();
  const currentDuration = getCurrentSessionDuration();
  
  return {
    totalTime: formatShortTime(state.totalSessionTime),
    dailyProgress: state.dailyProgress,
    dailyGoal: state.dailyGoal,
    progressPercent: Math.min(100, (state.dailyProgress / state.dailyGoal) * 100),
    isActive: state.session?.isActive ?? false,
    currentSessionDuration: formatTime(currentDuration)
  };
}

/**
 * Check if timer notification should be shown (for persistent timer display)
 * @param lastNotification Time of last notification
 * @param interval Notification interval in seconds
 * @returns Whether to show notification
 */
export function shouldShowNotification(lastNotification: number, interval: number = 300): boolean {
  return Date.now() - lastNotification >= interval * 1000;
}

// ============================================
// Focus Timer (Pomodoro-style) Functions
// ============================================

export interface FocusTimerSession {
  duration: number; // total focus duration in seconds
  timeRemaining: number; // seconds remaining
  isRunning: boolean;
  completedFocus: number; // number of completed focus sessions
  completedBreaks: number;
  mode: 'focus' | 'break' | 'idle';
  breakDuration: number; // break duration in seconds
}

/**
 * Start a focus timer (pomodoro)
 * @param durationMinutes Focus duration in minutes (default: 25)
 * @param breakDurationMinutes Break duration in minutes (default: 5)
 * @returns Updated TimerState with focus timer started
 */
export function startFocusTimer(
  durationMinutes: number = 25,
  breakDurationMinutes: number = 5
): TimerState {
  const state = loadTimerState();
  const durationSeconds = durationMinutes * 60;
  
  const newState: TimerState = {
    ...state,
    focusTimer: {
      duration: durationSeconds,
      timeRemaining: durationSeconds,
      isRunning: true,
      completedFocus: 0,
      completedBreaks: 0,
      mode: 'focus',
      breakDuration: breakDurationMinutes * 60
    }
  };
  
  saveTimerState(newState);
  return newState;
}

/**
 * Pause the focus timer
 * @returns Updated TimerState
 */
export function pauseFocusTimer(): TimerState {
  const state = loadTimerState();
  
  if (!state.focusTimer) return state;
  
  const newState: TimerState = {
    ...state,
    focusTimer: {
      ...state.focusTimer,
      isRunning: false
    }
  };
  
  saveTimerState(newState);
  return newState;
}

/**
 * Resume the focus timer
 * @returns Updated TimerState
 */
export function resumeFocusTimer(): TimerState {
  const state = loadTimerState();
  
  if (!state.focusTimer) return state;
  
  const newState: TimerState = {
    ...state,
    focusTimer: {
      ...state.focusTimer,
      isRunning: true
    }
  };
  
  saveTimerState(newState);
  return newState;
}

/**
 * Stop and clear the focus timer
 * @returns Updated TimerState
 */
export function stopFocusTimer(): TimerState {
  const state = loadTimerState();
  
  const newState: TimerState = {
    ...state,
    focusTimer: null
  };
  
  saveTimerState(newState);
  return newState;
}

/**
 * Update the focus timer (call every second)
 * @returns Updated TimerState
 */
export function tickFocusTimer(): TimerState {
  const state = loadTimerState();
  
  if (!state.focusTimer || !state.focusTimer.isRunning) {
    return state;
  }
  
  let newTimeRemaining = state.focusTimer.timeRemaining - 1;
  let newMode = state.focusTimer.mode;
  let completedFocus = state.focusTimer.completedFocus;
  let completedBreaks = state.focusTimer.completedBreaks;
  
  // Timer completed
  if (newTimeRemaining <= 0) {
    if (newMode === 'focus') {
      // Switch to break
      completedFocus += 1;
      newMode = 'break';
      newTimeRemaining = state.focusTimer.breakDuration;
    } else {
      // Switch back to focus
      completedBreaks += 1;
      newMode = 'focus';
      newTimeRemaining = state.focusTimer.duration;
    }
  }
  
  const newState: TimerState = {
    ...state,
    focusTimer: {
      ...state.focusTimer,
      timeRemaining: newTimeRemaining,
      mode: newMode,
      completedFocus,
      completedBreaks
    }
  };
  
  saveTimerState(newState);
  return newState;
}
