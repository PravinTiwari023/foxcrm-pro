import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  apiKey: "AIzaSyAVmNR67FS1vFEbImTzXxvHzGt8mdsVG3M",
  authDomain: "foxcrm-pro.firebaseapp.com",
  projectId: "foxcrm-pro",
  storageBucket: "foxcrm-pro.firebasestorage.app",
  messagingSenderId: "810511154398",
  appId: "1:810511154398:web:64f3b0f7dcbb0085d2164f",
  measurementId: "G-5WREFWS72R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
import { getFirestore } from 'firebase/firestore';
export const db = getFirestore(app);

// Initialize Analytics (only in browser)
let analytics: ReturnType<typeof getAnalytics> | null = null;
let performance: ReturnType<typeof getPerformance> | null = null;

export const initializeAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(app);
      performance = getPerformance(app);
    }
  }
  return { analytics, performance };
};

// Track page views
export const trackPageView = (pageName: string, pageLocation?: string) => {
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_title: pageName,
      page_location: pageLocation || window.location.href,
      page_path: window.location.pathname
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

export { app, analytics, performance };
