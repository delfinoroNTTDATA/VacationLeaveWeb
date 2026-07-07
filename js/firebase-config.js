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
  apiKey:            "PASTE HERE-apiKey",
  authDomain:        "PASTE HERE-authDomain",
  projectId:         "PASTE HERE-projectId",
  storageBucket:     "PASTE HERE-storageBucket",
  messagingSenderId: "PASTE HERE-messagingSenderId",
  appId:             "PASTE HERE-appId"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// ── Status UID shared ──
export const session = { uid: null };

// ── Firestore References ──
export const evRef  = () => collection(db, 'users', session.uid, 'events');
export const cfgRef = () => doc(db,        'users', session.uid, 'config', 'main');
export const ripRef = () => collection(db, 'users', session.uid, 'riporti');

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