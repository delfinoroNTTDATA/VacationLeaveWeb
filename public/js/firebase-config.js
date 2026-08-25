// ============================================
// firebase-config.js — Configuration and init Firebase
// Shared form imported from all pages
// ============================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore, doc, collection } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ══════════════════════════════════════════════════════════
// 🔧 CONFIGURE HERE YOUR FIREBASE CREDENTIALS
//    Firebase Console → Project → Settings → Web App
// ══════════════════════════════════════════════════════════
export const firebaseConfig = {
  apiKey: "AIzaSyDaMfI_WpuzAl47lD7oiq27R_MhkfkcTmg",
  authDomain: "ferie-roberto-delfino.firebaseapp.com",
  projectId: "ferie-roberto-delfino",
  storageBucket: "ferie-roberto-delfino.firebasestorage.app",
  messagingSenderId: "35801687279",
  appId: "1:35801687279:web:31eb60dc4def11976fe71a"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// ── Status UID shared ──
export const session = { uid: null };

// ── Firestore References ──
export const evRef  = () => collection(db, 'users', session.uid, 'events');
export const cfgRef = () => doc(db,        'users', session.uid, 'config', 'main');
export const amountCORef = () => collection(db, 'users', session.uid, 'amountCarriedOver');

// ── Translation of error messages ──
export function tradErr(code) {
  const m = {
    'auth/user-not-found':       'Email non trovata. Crea un account.',
    'auth/wrong-password':       'Password errata.',
    'auth/invalid-email':        'Email non valida.',
    'auth/email-already-in-use': 'Email già registrata. Fai login.',
    'auth/invalid-credential':   'Credenziali non valide.',
  };
  return m[code] || 'Errore: ' + code;
}