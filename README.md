# KSAin PWA - 한국과학영재학교 가온누리 모바일 프리뷰

Progressive Web App version of KSAin - Korean Science Academy student information system.

## 🌐 Live Demo

- **GitHub Pages**: https://sarang0218.github.io/ksainPWA/
- **Features**: 시간표, 급식, 게시판, 친구 시스템, 푸시 알림

## 📱 Features

### Core Functionality
- **시간표 (Timetable)**: Class schedules with notifications
- **급식 (Meals)**: Daily meal menus with reminders  
- **게시판 (Board)**: School community posts and discussions
- **친구 (Friends)**: Student networking and profiles
- **검색 (Search)**: Find students and content

### PWA Capabilities
- **📱 App-like Experience**: Install on any device
- **🔔 Push Notifications**: 
  - Class reminders (10 minutes before)
  - Meal alerts (10 minutes before breakfast/lunch/dinner)
  - New post notifications
- **⚡ Offline Support**: Works without internet connection
- **🎨 Native Look**: Responsive design for all screen sizes

## 🚀 Running Locally

### Prerequisites
- Python 3.x or Node.js
- Modern web browser

### Quick Start

#### Option 1: Python HTTP Server
```bash
# Clone the repository
git clone https://github.com/Sarang0218/ksainPWA.git
cd ksainPWA

# Start local server
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

#### Option 2: Node.js HTTP Server
```bash
# Install serve globally
npm install -g serve

# Clone and serve
git clone https://github.com/Sarang0218/ksainPWA.git
cd ksainPWA
serve -s . -l 8080

# Open in browser
open http://localhost:8080
```

#### Option 3: Any Static File Server
The PWA is a static web application - any HTTP server that can serve static files will work.

## 🔧 Development

### Building from Source
This PWA is built from the Flutter source code at the main KSAin repository:

```bash
# In the Flutter project directory
flutter clean
flutter build web --release --pwa-strategy=offline-first

# Copy build output to this repository
cp -r build/web/* /path/to/ksainPWA/
```

### File Structure
```
ksainPWA/
├── index.html              # Main PWA entry point
├── manifest.json           # PWA configuration
├── flutter_service_worker.js # Offline support
├── main.dart.js            # Flutter app compiled to JavaScript
├── assets/                 # App assets (images, fonts, etc.)
├── icons/                  # PWA icons (various sizes)
└── canvaskit/              # Flutter web renderer
```

## 🌍 Alternative Deployment Options

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd ksainPWA
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI  
npm i -g netlify-cli

# Deploy
cd ksainPWA
netlify deploy --prod --dir .
```

### Firebase Hosting
```bash
# Install Firebase CLI
npm i -g firebase-tools

# Initialize and deploy
firebase init hosting
firebase deploy
```

### Cloudflare Pages
1. Connect GitHub repository to Cloudflare Pages
2. Set build directory to root (`/`)
3. No build command needed (static files)

## 📋 Requirements for PWA Installation

For the "앱으로 설치하기" (Install as App) prompt to appear:

1. ✅ **HTTPS**: Required (provided by hosting platforms)
2. ✅ **Valid manifest.json**: Configured with Korean content
3. ✅ **Service Worker**: Handles offline functionality
4. ✅ **Icons**: Multiple sizes for different devices
5. ⏳ **User Engagement**: Chrome requires ~30 seconds of interaction

## 🔔 Push Notifications

The PWA includes Firebase Cloud Messaging for:

### Automatic Notifications
- **수업 알림**: 10분 전 (과목, 교실, 선생님)
- **급식 알림**: 조식/중식/석식 10분 전 (메뉴 포함)
- **게시글 알림**: 새 글 업로드 시 (제목, 게시판명)

### Configuration
Push notifications work through:
- **Web Push API**: For PWA installations
- **Firebase FCM**: For background notifications
- **Local Notifications**: For development/testing

## 🛠️ Troubleshooting

### PWA Not Installing
- Ensure HTTPS connection
- Wait 30+ seconds after page load
- Interact with the page (scroll, click)
- Clear browser cache if issues persist

### Notifications Not Working
- Allow notifications when prompted
- Check browser notification settings
- Ensure PWA is installed (better notification support)

### Loading Issues
- Check browser console for errors
- Ensure all assets are loading (especially main.dart.js)
- Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

## 📱 Supported Platforms

- **iOS**: Safari, Chrome, Firefox
- **Android**: Chrome, Firefox, Edge, Samsung Browser  
- **Desktop**: Chrome, Edge, Firefox, Safari
- **Install Support**: Chrome, Edge, Safari (iOS 16.4+)

## 🔗 Related Links

- **Main Repository**: Private Flutter source code
- **API Documentation**: Backend integration details
- **Firebase Console**: Push notification management

---

**Built with Flutter Web** • **한국과학영재학교** • **Progressive Web App Technology**