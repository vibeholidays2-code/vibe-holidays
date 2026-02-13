// TypeScript declarations for Google Analytics gtag

interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}
