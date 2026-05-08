/** Razorpay checkout.js attaches to window — single global augmentation for the app */
export {};

declare global {
  interface Window {
    Razorpay: any;
  }
}
