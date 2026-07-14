/**
 * Notification Utilities
 * Handles browser notifications, wake lock, audio alerts, and vibration
 * for keeping students aware of their study timer even when the app is backgrounded.
 */

export type NotificationPermission = 'default' | 'granted' | 'denied' | 'unsupported';

/**
 * Check if the Notification API is supported
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission as NotificationPermission;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'unsupported';
  
  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermission;
  } catch {
    return 'denied';
  }
}

/**
 * Show a browser notification
 * @param title Notification title
 * @param body Notification body text
 * @param iconPath Optional icon path
 */
export function showBrowserNotification(
  title: string,
  body: string,
  iconPath: string = '/icon-192x192.png'
): void {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== 'granted') return;
  
  try {
    const notification = new Notification(title, {
      body,
      icon: iconPath,
      badge: iconPath,
      tag: 'getsmart-timer',
      requireInteraction: false
    });
    
    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);
    
    // Focus window on click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.warn('Failed to show notification:', error);
  }
}

/**
 * Check if the Vibration API is supported
 */
export function isVibrationSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * Vibrate the device with a specific pattern
 * @param pattern Vibration pattern (array of milliseconds)
 */
export function vibrate(pattern: number | number[]): void {
  if (!isVibrationSupported()) return;
  try {
    navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Vibration failed:', error);
  }
}

/**
 * Play a sound notification using Web Audio API
 * @param frequency Sound frequency in Hz
 * @param duration Duration in milliseconds
 */
export function playSound(frequency: number = 800, duration: number = 300): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure sound
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // Configure volume envelope
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
    
    // Play sound
    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
    
    // Clean up
    setTimeout(() => {
      audioContext.close();
    }, duration + 1000);
  } catch (error) {
    console.warn('Sound playback failed:', error);
  }
}

/**
 * Play a multi-tone alert (for timer completion)
 */
export function playAlertSound(): void {
  // Play three ascending tones
  playSound(523, 150); // C5
  setTimeout(() => playSound(659, 150), 200); // E5
  setTimeout(() => playSound(784, 200), 400); // G5
}

/**
 * Play a soft notification sound (for milestones)
 */
export function playNotificationSound(): void {
  playSound(659, 200); // E5
  setTimeout(() => playSound(784, 200), 250); // G5
}

/**
 * Play a warning sound (for approaching deadline)
 */
export function playWarningSound(): void {
  playSound(440, 100); // A4
  setTimeout(() => playSound(440, 100), 200);
}

export interface WakeLockState {
  released: boolean;
  type: 'screen';
}

/**
 * Check if Screen Wake Lock API is supported
 */
export function isWakeLockSupported(): boolean {
  return 'wakeLock' in navigator;
}

let wakeLock: any = null;

/**
 * Request a screen wake lock to prevent screen from dimming/sleeping
 */
export async function requestWakeLock(): Promise<boolean> {
  if (!isWakeLockSupported()) return false;
  
  try {
    wakeLock = await (navigator as any).wakeLock.request('screen');
    return true;
  } catch (error) {
    console.warn('Wake lock request failed:', error);
    return false;
  }
}

/**
 * Release the screen wake lock
 */
export function releaseWakeLock(): void {
  if (wakeLock) {
    try {
      wakeLock.release();
      wakeLock = null;
    } catch (error) {
      console.warn('Wake lock release failed:', error);
    }
  }
}

/**
 * Check if wake lock is currently active
 */
export function isWakeLockActive(): boolean {
  return wakeLock !== null && !wakeLock.released;
}

/**
 * Re-acquire wake lock when page becomes visible again
 * (browsers release wake lock when page is hidden)
 */
export async function reacquireWakeLock(): Promise<boolean> {
  if (!isWakeLockSupported()) return false;
  if (!isWakeLockActive()) {
    return await requestWakeLock();
  }
  return true;
}

/**
 * Show a comprehensive timer alert
 * This uses all available notification methods
 * @param title Alert title
 * @param message Alert message
 */
export function showTimerAlert(title: string, message: string): void {
  // Show browser notification
  showBrowserNotification(title, message);
  
  // Play sound
  playAlertSound();
  
  // Vibrate
  vibrate([200, 100, 200, 100, 400]);
}

/**
 * Show a milestone notification
 * @param message Milestone message
 */
export function showMilestoneNotification(message: string): void {
  showBrowserNotification('Study Milestone! 🎯', message);
  playNotificationSound();
  vibrate([100, 50, 100]);
}

/**
 * Show a warning notification (for approaching deadlines)
 * @param message Warning message
 */
export function showWarningNotification(message: string): void {
  showBrowserNotification('Timer Warning ⏰', message);
  playWarningSound();
  vibrate(100);
}

/**
 * Request all necessary permissions for timer notifications
 */
export async function requestAllPermissions(): Promise<{
  notifications: NotificationPermission;
  wakeLock: boolean;
}> {
  const notifications = await requestNotificationPermission();
  const wakeLock = await requestWakeLock();
  
  return {
    notifications,
    wakeLock
  };
}

/**
 * Clean up all resources
 */
export function cleanupNotifications(): void {
  releaseWakeLock();
}
