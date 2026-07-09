// ============================================
// data.js — Firestore Data Loading and Saving
// ============================================

import {cfgRef, db, evRef, amountCORef, session} from "./firebase-config";
import { S } from  './state'
import {
    doc, collection, setDoc, deleteDoc, getDocs, onSnapshot, writeBatch
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'

let unsubEvents = null;

export async function loadConfig(){
    try{
        const snap = await getDocs( collection( db, 'users', session.uid, 'config'));
        snap.forEach( d => { 
            if( d.id === 'main' ) S.cfg = Object.assign( {}, S.cfg, d.data()); 
        });
    } catch (e) { console.warn('loadConfig error', e); }
}

export async function saveConfig(){
    if (!session.uid) return;
    try {
        await setDoc(cfgRef(), { ...S.cfg });
    }catch (e) {console.warn(e)}
}

export async function loadAmountCarriedOver(){
    try {
        const snap = await getDocs(amountCORef())
        S.amountCOManual = {};
        snap.forEach( d => { S.amountCOManual[d.id] = d.data(); });
        if (!S.amountCOManual['2025']) {
            S.amountCOManual['2026'] = { leaveHours: 29, permHours: 42 };
            await setDoc( doc( amountCORef(), '2026'), { leaveHours: 29, permHours: 42 });
        }
    } catch (e) { console.warn('loadAmountCarried error', e); }
}

export function startEventsListener(onUpdate) {
    if (unsubEvents) unsubEvents();
    unsubEvents = onSnapshot( evRef(), { includeMetadataChanges: false }, (snap) => {
        const nuovoEv = {};
        snap.forEach(d => {
            const data = d.data();
            if (!data.type) return;
            nuovoEv[d.id] = {
                type: data.type || 'leave', qty: data.qty || 'intero',
                half: data.half || 'mattina', hours: Number(data.hours) || 8
            };
        });
        if (snap.size > 0 || !snap.metadata.fromChache) S.ev = nuovoEv;
        showSyncBadge();
        if (typeof onUpdate === 'function') onUpdate();
    }, (err) => console.warn('snapshot error', err));
}

export function stopEventsListener() { if (unsubEvents){
    unsubEvents();
    unsubEvents = null;
}}

export function showSyncBadge() {
    const b = document.getElementById('sync-badge');
    if (!b) return;
    b.textContent = '🔄 Sincronizzato';
    b.style.opacity = '1';
    setTimeout( () => { b.style.opacity = '0'; }, 2000)
}

export async function saveEvents(dates, evObj){
    const batch = writeBatch(db);
    dates.forEach( ds => batch.set( doc( evRef(), ds ), evObj ));
    await batch.commit();
}

export async function deleteEvents(dates){
    const batch = writeBatch(db);
    dates.forEach( ds => batch.delete( doc( evRef(), ds ) ));
    await batch.commit();
}

export async function saveAmountCarriedOver( yr, vactionHours, permHours){
    S.amountCOManual[yr] = { vactionHours, permHours };
    await setDoc( amountCORef(), yr, { vactionHours, permHours });
}

export async function removeAmountCarriedOver(yr){
    delete S.amountCOManual[yr];
    await deleteDoc( doc( amountCORef(), yr ))
}