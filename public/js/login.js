import { auth, cfgRef, tradErr, session } from "./firebase-config.js";
import { S } from './state.js'
import {
    signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'
import { setDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'
import { applyI18n, t } from './i18n.js'

onAuthStateChanged(auth, (user) => {
    if(user) window.location.href = 'dashboard.html';
});

const $ = id => document.getElementById(id);

async function doLogin() {
    const email = $('loginEmail').value.trim();
    const pass = $('loginPass').value;

    $('authError').textContent = '';

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = 'dashboard.html';
    } catch (error) {
        $('authError').textContent = tradErr(error.code);
    }
}

async function doRegister() {
    const email = $('loginEmail').value.trim();
    const pass = $('loginPass').value;

    $('authError').textContent = '';

    if(pass.length < 6) {
        $('authError').textContent = t('login_err_pass_length');
        return;
    }

    try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        session.uid = cred.user.uid;
        await setDoc(cfgRef(), { ...S.cfg });
        localStorage.setItem('ferie_new_user', '1');
    }catch (e) {
        $('authError').textContent = tradErr(e.code);
    }
}

$('btnLogin').onclick = doLogin;
$('btnRegister').onclick = doRegister;
$('loginPass').addEventListener('keydown', e => {
    if(e.key === 'Enter') doLogin();
});

applyI18n();