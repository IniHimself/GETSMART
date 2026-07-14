import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Card } from '../utils/sm2';
import {
  loadTimerState,
  saveTimerState,
  startSession,
  endSession,
  pauseSession,
  resumeSession,
  getCurrentSessionDuration,
  formatTime,
  setDailyGoal,
  startFocusTimer as startFocusTimerUtil,
  pauseFocusTimer as pauseFocusTimerUtil,
  resumeFocusTimer as resumeFocusTimerUtil,
  stopFocusTimer as stopFocusTimerUtil,
  tickFocusTimer,
  type TimerState
} from '../utils/timer';
import {
  getTodaysCards,
  getCardStatistics,
  updateCardSchedule,
  createNewCard
} from '../utils/sm2';
import {
  requestAllPermissions,
  showBrowserNotification,
  showTimerAlert,
  showMilestoneNotification,
  showWarningNotification,
  vibrate,
  requestWakeLock,
  releaseWakeLock,
  reacquireWakeLock,
  cleanupNotifications,
  getNotificationPermission,
  type NotificationPermission
} from '../utils/notifications';

interface StudyContextType {
  // Timer state
  timerState: TimerState;
  startStudySession: (course: string, topic: string) => void;
  endStudySession: () => void;
  pauseStudySession: () => void;
  resumeStudySession: () => void;
  setDailyStudyGoal: (minutes: number) => void;
  getCurrentDuration: () => number;
  formatDuration: (seconds: number) => string;
  
  // Focus timer (pomodoro)
  startFocusTimer: (durationMinutes?: number, breakMinutes?: number) => void;
  pauseFocusTimer: () => void;
  resumeFocusTimer: () => void;
  stopFocusTimer: () => void;
  getFocusTimeFormatted: () => string;
  isFocusRunning: boolean;
  focusMode: 'focus' | 'break' | 'idle';
  focusCompletedCount: number;
  
  // Cards and scheduling
  cards: Card[];
  todaysCards: Card[];
  cardStats: ReturnType<typeof getCardStatistics>;
  addCard: (cardData: Omit<Card, 'schedule' | 'mastery'>) => void;
  updateCard: (cardId: string, score: number) => void;
  refreshTodaysCards: () => void;
  
  // Notifications
  notificationPermission: NotificationPermission;
  requestNotificationPermissions: () => void;
  showNotification: (title: string, message: string) => void;
  showTimerCompleteAlert: () => void;
  showMilestoneAlert: (message: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const CARD_STORAGE_KEY = 'getsmart_cards';

export const StudyProvider = ({ children }: { children: React.ReactNode }) => {
  // Load initial state
  const [timerState, setTimerState] = useState<TimerState>(loadTimerState());
  const [cards, setCards] = useState<Card[]>([]);
  const [todaysCards, setTodaysCards] = useState<Card[]>([]);
  const [cardStats, setCardStats] = useState(getCardStatistics([]));
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    getNotificationPermission()
  );
  
  // Focus timer interval ref
  const focusTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Last notification time ref (for milestone warnings)
  const lastMilestoneNotificationRef = useRef<number>(Date.now());

  // Load cards from localStorage on mount
  useEffect(() => {
    const storedCards = localStorage.getItem(CARD_STORAGE_KEY);
    if (storedCards) {
      try {
        const parsedCards = JSON.parse(storedCards) as Card[];
        setCards(parsedCards);
        setTodaysCards(getTodaysCards(parsedCards));
        setCardStats(getCardStatistics(parsedCards));
      } catch {
        // If parsing fails, start with empty array
        setCards([]);
      }
    }
  }, []);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(cards));
    setTodaysCards(getTodaysCards(cards));
    setCardStats(getCardStatistics(cards));
  }, [cards]);

  // Sync timer state with localStorage
  useEffect(() => {
    saveTimerState(timerState);
  }, [timerState]);

  // Timer functions
  const startStudySession = useCallback((course: string, topic: string) => {
    setTimerState(startSession(course, topic));
    // Request wake lock when starting a session
    requestWakeLock();
  }, []);

  const endStudySession = useCallback(() => {
    setTimerState(endSession());
    releaseWakeLock();
  }, []);

  const pauseStudySession = useCallback(() => {
    setTimerState(pauseSession());
  }, []);

  const resumeStudySession = useCallback(() => {
    setTimerState(resumeSession());
    reacquireWakeLock();
  }, []);

  const setDailyStudyGoal = useCallback((minutes: number) => {
    setTimerState(setDailyGoal(minutes));
  }, []);

  const getCurrentDuration = useCallback(() => {
    return getCurrentSessionDuration();
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    return formatTime(seconds);
  }, []);

  // Focus timer functions
  const startFocusTimer = useCallback((durationMinutes: number = 25, breakMinutes: number = 5) => {
    setTimerState(startFocusTimerUtil(durationMinutes, breakMinutes));
    requestWakeLock();
  }, []);

  const pauseFocusTimer = useCallback(() => {
    setTimerState(pauseFocusTimerUtil());
  }, []);

  const resumeFocusTimer = useCallback(() => {
    setTimerState(resumeFocusTimerUtil());
    reacquireWakeLock();
  }, []);

  const stopFocusTimer = useCallback(() => {
    setTimerState(stopFocusTimerUtil());
    if (focusTimerRef.current) {
      clearInterval(focusTimerRef.current);
      focusTimerRef.current = null;
    }
    releaseWakeLock();
  }, []);

  // Focus timer tick effect
  useEffect(() => {
    if (timerState.focusTimer?.isRunning) {
      focusTimerRef.current = setInterval(() => {
        const newState = tickFocusTimer();
        setTimerState(newState);
        
        // Check if mode changed (timer completed)
        if (timerState.focusTimer) {
          const oldMode = timerState.focusTimer.mode;
          const newMode = newState.focusTimer?.mode;
          
          if (oldMode === 'focus' && newMode === 'break') {
            // Focus session completed
            showTimerAlert('Focus Session Complete!', 'Great work! Time for a break. 🎯');
            vibrate([200, 100, 200, 100, 400]);
          } else if (oldMode === 'break' && newMode === 'focus') {
            // Break completed
            showTimerAlert('Break Over!', 'Ready for another focus session? 💪');
            vibrate([100, 50, 100]);
          }
        }
      }, 1000);
    } else {
      if (focusTimerRef.current) {
        clearInterval(focusTimerRef.current);
        focusTimerRef.current = null;
      }
    }
    
    return () => {
      if (focusTimerRef.current) {
        clearInterval(focusTimerRef.current);
        focusTimerRef.current = null;
      }
    };
  }, [timerState.focusTimer?.isRunning, timerState.focusTimer?.mode]);

  // Cleanup wake lock on unmount
  useEffect(() => {
    return () => {
      cleanupNotifications();
    };
  }, []);

  // Card functions
  const addCard = useCallback((cardData: Omit<Card, 'schedule' | 'mastery'>) => {
    const newCard = createNewCard(cardData);
    setCards(prev => [...prev, newCard]);
  }, []);

  const updateCard = useCallback((cardId: string, score: number) => {
    setCards(prev => {
      const cardIndex = prev.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return prev;
      
      const updatedCard = updateCardSchedule(prev[cardIndex], score);
      const newCards = [...prev];
      newCards[cardIndex] = updatedCard;
      return newCards;
    });
  }, []);

  const refreshTodaysCards = useCallback(() => {
    setTodaysCards(getTodaysCards(cards));
  }, [cards]);

  // Notification functions
  const requestNotificationPermissions = useCallback(async () => {
    const result = await requestAllPermissions();
    setNotificationPermission(result.notifications);
  }, []);

  const showNotification = useCallback((title: string, message: string) => {
    showBrowserNotification(title, message);
  }, []);

  const showTimerCompleteAlert = useCallback(() => {
    showTimerAlert('Study Session Complete!', 'Excellent work! You\'ve finished your session. 🎉');
    vibrate([200, 100, 200, 100, 400]);
  }, []);

  const showMilestoneAlert = useCallback((message: string) => {
    showMilestoneNotification(message);
    vibrate([100, 50, 100]);
  }, []);

  // Periodic milestone notifications (every 30 minutes)
  useEffect(() => {
    if (timerState.session?.isActive) {
      const checkMilestone = setInterval(() => {
        const duration = getCurrentSessionDuration();
        const minutes = Math.floor(duration / 60);
        
        // Show warning every 30 minutes if session is running
        if (minutes > 0 && minutes % 30 === 0) {
          const lastNotif = lastMilestoneNotificationRef.current;
          const timeSinceLastNotif = Date.now() - lastNotif;
          
          if (timeSinceLastNotif > 25 * 60 * 1000) { // At least 25 min since last
            showWarningNotification(`You've been studying for ${minutes} minutes. Keep it up!`);
            lastMilestoneNotificationRef.current = Date.now();
          }
        }
      }, 60000); // Check every minute
      
      return () => clearInterval(checkMilestone);
    }
  }, [timerState.session?.isActive]);

  // Auto-save timer state every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (timerState.session?.isActive) {
        saveTimerState(timerState);
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [timerState]);

  // Handle page visibility changes (keep timer running, manage wake lock)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page hidden - release wake lock but keep timer running
        releaseWakeLock();
      } else if (document.visibilityState === 'visible') {
        // Page visible - reacquire wake lock
        reacquireWakeLock();
        
        // Check if daily progress needs reset (new day)
        const state = loadTimerState();
        const today = new Date().toDateString();
        const lastDate = new Date(state.lastActivity).toDateString();
        if (today !== lastDate) {
          setTimerState(prev => ({
            ...prev,
            dailyProgress: 0,
            lastActivity: Date.now()
          }));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle beforeunload to save state
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (timerState.session?.isActive) {
        saveTimerState(timerState);
      }
      releaseWakeLock();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [timerState]);

  const value: StudyContextType = {
    timerState,
    startStudySession,
    endStudySession,
    pauseStudySession,
    resumeStudySession,
    setDailyStudyGoal,
    getCurrentDuration,
    formatDuration,
    
    // Focus timer
    startFocusTimer,
    pauseFocusTimer,
    resumeFocusTimer,
    stopFocusTimer,
    getFocusTimeFormatted: () => {
      if (!timerState.focusTimer) return '00:00';
      return formatTime(timerState.focusTimer.timeRemaining);
    },
    isFocusRunning: timerState.focusTimer?.isRunning ?? false,
    focusMode: timerState.focusTimer?.mode ?? 'idle',
    focusCompletedCount: timerState.focusTimer?.completedFocus ?? 0,
    
    // Cards
    cards,
    todaysCards,
    cardStats,
    addCard,
    updateCard,
    refreshTodaysCards,
    
    // Notifications
    notificationPermission,
    requestNotificationPermissions,
    showNotification,
    showTimerCompleteAlert,
    showMilestoneAlert
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within StudyProvider');
  return context;
};
