// frontend/src/utils/notifications.ts
// Utility functions for displaying notifications to the player

// Notification types
type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'event' | 'moon' | 'season' | 'market' | 'ritual';

// Notification options
interface NotificationOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  onClick?: () => void;
}

// Show a notification to the player
export function showNotification(
  title: string,
  message: string,
  type: NotificationType = 'info',
  options: NotificationOptions = {}
): void {
  // Default options
  const defaultOptions: NotificationOptions = {
    duration: 5000, // 5 seconds
    position: 'top-right'
  };
  
  // Merge with provided options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Create notification element
  const notification = document.createElement('div');
  notification.classList.add('game-notification', `notification-${type}`);
  
  // Set position class
  notification.classList.add(`position-${mergedOptions.position}`);
  
  // Create notification content
  notification.innerHTML = `
    <div class="notification-icon">${getNotificationIcon(type)}</div>
    <div class="notification-content">
      <h4 class="notification-title">${title}</h4>
      <p class="notification-message">${message}</p>
    </div>
    <button class="notification-close">×</button>
  `;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Add click listener if provided
  if (mergedOptions.onClick) {
    notification.addEventListener('click', (e) => {
      if (!(e.target as Element).classList.contains('notification-close')) {
        mergedOptions.onClick?.();
      }
    });
  }
  
  // Add close button listener
  const closeButton = notification.querySelector('.notification-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      closeNotification(notification);
    });
  }
  
  // Show notification with animation
  setTimeout(() => {
    notification.classList.add('visible');
  }, 10);
  
  // Auto-close after duration
  if (mergedOptions.duration && mergedOptions.duration > 0) {
    setTimeout(() => {
      closeNotification(notification);
    }, mergedOptions.duration);
  }
  
  // Play notification sound if available
  playNotificationSound(type);
}

// Close a notification
function closeNotification(notification: HTMLElement): void {
  // Start exit animation
  notification.classList.remove('visible');
  notification.classList.add('closing');
  
  // Remove element after animation completes
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300); // Animation duration
}

// Get appropriate icon for notification type
function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    case 'event': return '📜';
    case 'moon': return '🌙';
    case 'season': return getSeasonIcon();
    case 'market': return '💰';
    case 'ritual': return '✨';
    default: return 'ℹ️';
  }
}

// Get season icon based on current season
function getSeasonIcon(): string {
  // If we can access game state, get current season
  const currentMonth = new Date().getMonth();
  
  // Approximate seasons based on month
  if (currentMonth >= 2 && currentMonth <= 4) return '🌱'; // Spring
  if (currentMonth >= 5 && currentMonth <= 7) return '☀️'; // Summer
  if (currentMonth >= 8 && currentMonth <= 10) return '🍂'; // Fall
  return '❄️'; // Winter
}

// Play notification sound effect
function playNotificationSound(type: NotificationType): void {
  // Check if sounds are enabled in settings
  const soundsEnabled = localStorage.getItem('soundsEnabled') !== 'false';
  if (!soundsEnabled) return;
  
  // Get volume from settings (0.0 to 1.0)
  const volume = parseFloat(localStorage.getItem('soundVolume') || '0.5');
  
  // Create audio element for appropriate sound
  const audio = new Audio();
  
  switch (type) {
    case 'success':
      audio.src = '/sounds/notification-success.mp3';
      break;
    case 'error':
      audio.src = '/sounds/notification-error.mp3';
      break;
    case 'warning':
      audio.src = '/sounds/notification-warning.mp3';
      break;
    case 'moon':
      audio.src = '/sounds/notification-moon.mp3';
      break;
    case 'ritual':
      audio.src = '/sounds/notification-ritual.mp3';
      break;
    default:
      audio.src = '/sounds/notification-default.mp3';
      break;
  }
  
  // Set volume
  audio.volume = volume;
  
  // Play sound
  audio.play().catch(error => {
    // Some browsers require user interaction before playing audio
    console.log('Could not play notification sound:', error);
  });
}

// Clear all notifications
export function clearAllNotifications(): void {
  const notifications = document.querySelectorAll('.game-notification');
  notifications.forEach(notification => {
    closeNotification(notification as HTMLElement);
  });
}

// Create notification CSS styles
export function injectNotificationStyles(): void {
  // Check if styles already exist
  if (document.getElementById('notification-styles')) return;
  
  // Create style element
  const style = document.createElement('style');
  style.id = 'notification-styles';
  
  // Add CSS
  style.textContent = `
    .game-notification {
      position: fixed;
      display: flex;
      align-items: center;
      min-width: 300px;
      max-width: 500px;
      padding: 15px 20px;
      background-color: #f5f5f5;
      border-left: 4px solid #555;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateX(120%);
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
      z-index: 9999;
      font-family: sans-serif;
    }
    
    .game-notification.visible {
      transform: translateX(0);
      opacity: 1;
    }
    
    .game-notification.closing {
      transform: translateX(120%);
      opacity: 0;
    }
    
    .notification-icon {
      font-size: 24px;
      margin-right: 15px;
    }
    
    .notification-content {
      flex: 1;
    }
    
    .notification-title {
      margin: 0 0 5px 0;
      font-size: 16px;
      font-weight: bold;
    }
    
    .notification-message {
      margin: 0;
      font-size: 14px;
    }
    
    .notification-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 0 5px;
      color: #777;
      transition: color 0.2s;
    }
    
    .notification-close:hover {
      color: #333;
    }
    
    /* Positions */
    .position-top-right {
      top: 20px;
      right: 20px;
    }
    
    .position-top-left {
      top: 20px;
      left: 20px;
      transform: translateX(-120%);
    }
    
    .position-top-left.visible {
      transform: translateX(0);
    }
    
    .position-top-left.closing {
      transform: translateX(-120%);
    }
    
    .position-bottom-right {
      bottom: 20px;
      right: 20px;
    }
    
    .position-bottom-left {
      bottom: 20px;
      left: 20px;
      transform: translateX(-120%);
    }
    
    .position-bottom-left.visible {
      transform: translateX(0);
    }
    
    .position-bottom-left.closing {
      transform: translateX(-120%);
    }
    
    .position-top-center {
      top: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(-120%);
    }
    
    .position-top-center.visible {
      transform: translateX(-50%) translateY(0);
    }
    
    .position-top-center.closing {
      transform: translateX(-50%) translateY(-120%);
    }
    
    .position-bottom-center {
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%) translateY(120%);
    }
    
    .position-bottom-center.visible {
      transform: translateX(-50%) translateY(0);
    }
    
    .position-bottom-center.closing {
      transform: translateX(-50%) translateY(120%);
    }
    
    /* Types */
    .notification-success {
      background-color: #e7f7ed;
      border-left-color: #28a745;
    }
    
    .notification-error {
      background-color: #f8e7e7;
      border-left-color: #dc3545;
    }
    
    .notification-warning {
      background-color: #fff8e1;
      border-left-color: #ffc107;
    }
    
    .notification-info {
      background-color: #e7f2fa;
      border-left-color: #17a2b8;
    }
    
    .notification-moon {
      background-color: #f0e6f5;
      border-left-color: #9c6ab7;
    }
    
    .notification-season {
      background-color: #e7f5e9;
      border-left-color: #4caf50;
    }
    
    .notification-market {
      background-color: #f5efe7;
      border-left-color: #ff9800;
    }
    
    .notification-ritual {
      background-color: #f9f0ff;
      border-left-color: #9c27b0;
    }
    
    /* Stack multiple notifications */
    .game-notification:nth-child(1) {
      z-index: 9999;
    }
    
    .game-notification:nth-child(2) {
      z-index: 9998;
    }
    
    .game-notification:nth-child(3) {
      z-index: 9997;
    }
    
    /* Responsive */
    @media (max-width: 600px) {
      .game-notification {
        min-width: auto;
        max-width: calc(100% - 40px);
        width: calc(100% - 40px);
      }
      
      .position-top-center,
      .position-bottom-center {
        width: calc(100% - 40px);
        left: 20px;
        transform: translateX(0) translateY(-120%);
      }
      
      .position-top-center.visible,
      .position-bottom-center.visible {
        transform: translateX(0) translateY(0);
      }
      
      .position-top-center.closing {
        transform: translateX(0) translateY(-120%);
      }
      
      .position-bottom-center.closing {
        transform: translateX(0) translateY(120%);
      }
    }
  `;
  
  // Add to DOM
  document.head.appendChild(style);
}

// Initialize notifications when loaded
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    injectNotificationStyles();
  });
}