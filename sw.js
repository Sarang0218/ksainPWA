// Service Worker for ksain PWA
const CACHE_NAME = 'ksain-v1';
const CACHE_URLS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Your web push certificate public key
const VAPID_PUBLIC_KEY = 'BCaf15yCB0lICktGKfLdYdo7uEq0iIoBIGnrizwShSOP1lZhJ9XJiD0iAnV7cEywuUBU29ui0TSoa7pcCwgKZf8';

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app resources');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both cache and network fail, show offline page
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received:', event);
  
  let notificationData = {
    title: 'ksain',
    body: '새로운 알림이 있습니다',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    data: {}
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        data: data.data || {}
      };
      
      // Add Korean notification styling
      if (data.type === 'class') {
        notificationData.title = '🎓 ' + notificationData.title;
      } else if (data.type === 'meal') {
        notificationData.title = '🍽️ ' + notificationData.title;
      } else if (data.type === 'post') {
        notificationData.title = '📝 ' + notificationData.title;
      }
      
    } catch (error) {
      console.error('❌ Error parsing push data:', error);
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    data: notificationData.data,
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: '보기',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'dismiss',
        title: '닫기'
      }
    ],
    vibrate: [200, 100, 200],
    tag: notificationData.data.type || 'general'
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Handle notification click based on type
  let url = '/';
  const data = event.notification.data;
  
  switch (data.type) {
    case 'class':
      url = '/timetable';
      break;
    case 'meal':
      url = '/timetable?tab=meals';
      break;
    case 'post':
      url = `/board?postId=${data.postId}`;
      break;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Try to focus existing window
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            client.focus();
            client.postMessage({
              type: 'NAVIGATE',
              url: url
            });
            return;
          }
        }
        // Open new window if none exists
        return clients.openWindow(url);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync offline actions when connection is restored
      syncOfflineActions()
    );
  }
});

// Periodic background sync for notifications (experimental)
self.addEventListener('periodicsync', (event) => {
  console.log('⏰ Periodic sync triggered:', event.tag);
  
  if (event.tag === 'check-notifications') {
    event.waitUntil(
      checkForNewNotifications()
    );
  }
});

// Helper function to sync offline actions
async function syncOfflineActions() {
  try {
    console.log('📤 Syncing offline actions...');
    // Implementation for syncing offline actions
    // This would sync any actions taken while offline
  } catch (error) {
    console.error('❌ Error syncing offline actions:', error);
  }
}

// Helper function to check for new notifications
async function checkForNewNotifications() {
  try {
    console.log('🔍 Checking for new notifications...');
    
    // Check for upcoming classes
    await checkUpcomingClasses();
    
    // Check for meal reminders
    await checkMealReminders();
    
  } catch (error) {
    console.error('❌ Error checking notifications:', error);
  }
}

// Check for upcoming classes (10 minutes before)
async function checkUpcomingClasses() {
  try {
    // This would call your API to check for upcoming classes
    const response = await fetch('/api/check-upcoming-classes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.hasUpcomingClass) {
        await self.registration.showNotification('🎓 다음 수업 알림', {
          body: `${data.subject} • ${data.room} • ${data.teacher}`,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-96x96.png',
          data: { type: 'class' },
          tag: 'class-reminder'
        });
      }
    }
  } catch (error) {
    console.error('❌ Error checking upcoming classes:', error);
  }
}

// Check for meal reminders (10 minutes before meals)
async function checkMealReminders() {
  try {
    const response = await fetch('/api/check-meal-reminders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.hasMealReminder) {
        let mealIcon = '🍽️';
        if (data.mealType === 'breakfast') mealIcon = '🌅';
        else if (data.mealType === 'lunch') mealIcon = '🌞';
        else if (data.mealType === 'dinner') mealIcon = '🌙';
        
        await self.registration.showNotification(`${mealIcon} ${data.mealName} 알림`, {
          body: data.menuPreview,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-96x96.png',
          data: { type: 'meal', mealType: data.mealType },
          tag: 'meal-reminder'
        });
      }
    }
  } catch (error) {
    console.error('❌ Error checking meal reminders:', error);
  }
}

// Message event - handle messages from main app
self.addEventListener('message', (event) => {
  console.log('📨 Message received in service worker:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});