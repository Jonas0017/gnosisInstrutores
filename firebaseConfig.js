import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAJwTE_5lajcClq-RYP8OvcO6m4xsrTvZY",
  authDomain: "instrutores-2ae1b.firebaseapp.com",
  projectId: "instrutores-2ae1b",
  storageBucket: "instrutores-2ae1b.firebasestorage.app",
  messagingSenderId: "171421264705",
  appId: "1:171421264705:android:762c47a20dcf60e88f8fc0",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços do Firebase
const firestore = getFirestore(app);

// Inicializa o Auth com AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Inicializa o Storage
const storage = getStorage(app);

// Exporta as instâncias
export { app, firestore, auth, storage };
