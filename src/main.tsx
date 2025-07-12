import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    console.log('New version available. Please refresh.');
  },
  onOfflineReady() {
    console.log('App ready to work offline.');
  }
});

createRoot(document.getElementById('root')!).render(<App />);
