// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { fireConfig } from "./fireconfig";

// Initialize Firebase
const app = initializeApp(fireConfig);

// Initialize Analytics only on client-side
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export const auth = getAuth();
export { analytics };
