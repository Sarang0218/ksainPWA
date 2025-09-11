// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByXVeGaHRyIUSnnAbvRYSCIgU60aON5mU",
  authDomain: "ksain-gaonuri.firebaseapp.com",
  projectId: "ksain-gaonuri",
  storageBucket: "ksain-gaonuri.firebasestorage.app",
  messagingSenderId: "1070324804834",
  appId: "1:1070324804834:web:884d0fe2a5b4300fca42bb",
  measurementId: "G-GCGNRRHCV7"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  let notificationTitle = payload.notification?.title || 'ksain';
  let notificationOptions = {
    body: payload.notification?.body || '새로운 알림이 있습니다',
    icon: '/icons/Icon-192.png',
    badge: '/icons/badge-72x72.png',
    data: payload.data || {},
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: '보기'
      },
      {
        action: 'dismiss', 
        title: '닫기'
      }
    ]
  };

  // Customize notification based on type
  if (payload.data?.type) {
    switch (payload.data.type) {
      case 'class':
        notificationTitle = '🎓 ' + notificationTitle;
        break;
      case 'meal':
        if (payload.data.mealType === 'breakfast') {
          notificationTitle = '🌅 ' + notificationTitle;
        } else if (payload.data.mealType === 'lunch') {
          notificationTitle = '🌞 ' + notificationTitle;
        } else if (payload.data.mealType === 'dinner') {
          notificationTitle = '🌙 ' + notificationTitle;
        } else {
          notificationTitle = '🍽️ ' + notificationTitle;
        }
        break;
      case 'post':
        notificationTitle = '📝 ' + notificationTitle;
        break;
    }
  }

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Determine URL based on notification type
  let url = '/';
  const data = event.notification.data;
  
  if (data.type === 'class') {
    url = '/timetable';
  } else if (data.type === 'meal') {
    url = '/timetable?tab=meals';
  } else if (data.type === 'post') {
    url = data.postId ? `/board?postId=${data.postId}` : '/board';
  }

  // Focus existing window or open new one
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            return client.focus().then(() => {
              // Navigate to the appropriate page
              return client.postMessage({
                type: 'NAVIGATE',
                url: url,
                data: data
              });
            });
          }
        }
        // Open new window if no existing window found
        return clients.openWindow(url);
      })
  );
});