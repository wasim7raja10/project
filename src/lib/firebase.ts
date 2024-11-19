// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMvgw43kN2Rj4e7YRXLqweM6Yls8CK0Cw",
  authDomain: "gemini-extraction.firebaseapp.com",
  projectId: "gemini-extraction",
  storageBucket: "gemini-extraction.firebasestorage.app",
  messagingSenderId: "955193136520",
  appId: "1:955193136520:web:5359f95dfb2c438e24d63d"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize the Vertex AI service
const vertexAI = getVertexAI(firebaseApp);

// Initialize the generative model with a model that supports your use case
// Gemini 1.5 models are versatile and can be used with all API capabilities
export const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });