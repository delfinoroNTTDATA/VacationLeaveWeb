// ================================
// setting.js - Setting page logic
// ================================

import { S } from "./state.js";
import { calcStats, fmt2 } from "./calc.js";
import { saveConfig, saveAmountCarriedOver, removeAmountCarriedOver } from "./data.js";
import { evRef, db } from "./firebase-config.js";
import { getDocs, writeBatch } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { guardPage } from "./app-shell.js";

const $ = id => document.getElementById(id);

function renderSettings(){
    ['leaveTotal', 'permitHours', 'dayHours', 'year'].forEach( k => {
        if($('v-'+ k)) $('v-'+ k).textContent = S.cfg[k];
    });

    ['maxACOleave', 'maxACOPerm', 'monthDeadline'].forEach(k => {
        if($('v-'+ k)) $('v-'+ k).textContent = S.cfg[k];
    });

    const tog = $('toggleAmountCarriedOver');

    if(tog) tog.checked = S.cfg.aCOEnabled;

    if($('toggleAmountCarriedOverLabel')) $('toggleAmountCarriedOverLabel').textContent = S.cfg.aCOEnabled ? 'Abilitato' : 'Disabilitato';

    if($('amountCarriedOverCfg')) $('amountCarriedOverCfg').className = 'amountCarriedOver-cfg' + (S.cfg.aCOEnabled ? ' show' : '');

    if($('yearsHistory')) $('yearsHistory').innerHTML = buildHistory();

    renderManYear(); renderTabAmountCarriedOverManual();
}

function adj(k, d){
    S.cfg[k] = Math.max(0, S.cfg[k] + d);

    $('v-' + k).textContent = S.cfg[k];

    saveConfig();
}

function adjR(k, d){
    S.cfg[k] = Math.max(0, S.cfg[k] + d);

    $('v-' + k).textContent = S.cfg[k];

    saveConfig();

    $('yearsHistory').innerHTML = buildHistory();
}

function onToggleAmountCarriedOver(checked){
    S.cfg.aCOEnabled = checked;

    $('toggleAmountCarriedOverLabel').textContent = checked ? 'Abilitato' : 'Disabilitato';

    $('amountCarriedOverCfg').className = 'amountCarriedOver-cfg' + (checked ? ' show' : '');

    saveConfig();

    $('yearsHistory').innerHTML = buildHistory();
}

function renderManYear(){
    const yr = S.cfg.year;
    const years = [ yr - 2, yr - 1, yr, yr + 1].filter(y => y > 2000);
    const sel = $('manYear');

    if(!sel) return;

    sel.innerHTML = years.map(y => `<option value="${y}" ${y === yr ? 'selected' : ''}>${y}</option>`).join('');

    onManYearChange(String(yr));
}

function onManYearChange(yr){
    const m = S.amountCOManual[yr] || {leaveHours: 0 , permitHours: 0};

    $('manLeaveHours').value = m.leaveHours;
    $('manPermitHours').value = m.permitHours;
}

async function saveAmountCarriedOverManual() {
    const yr = $('manYear').value;
    const lHours = parseFloat($('manLeaveHours').value) || 0;
    const pHours = parseFloat($('manPermitHours').value) || 0;

    try{
        await saveAmountCarriedOver(yr, lHours, pHours);
        renderTabAmountCarriedOverManual();
        $('yearsHistory').innerHTML = buildHistory();
        const btn = $('btnSaveAmountCarriedOver');


    } catch(e) { alert('Errore: ' + e.message); }
}

async function remuoveAmoubtCarriedOverManual(yr) {
    try{
        await removeAmountCarriedOver(yr);
        renderTabAmountCarriedOverManual();
        $('yearsHistory').innerHTML = buildHistory();
    }catch(e) { alert('Errore: ' + e.message); }  
}

function renderTabAmountCarriedOverManual(){
    const entries = Object.entries(S.amountCOManual || {}).filter(([,v]) => v.leaveHours > 0 || v.permitHours > 0).sort(([a],[b]) => parseInt(a) - parseInt(b));

    const tab = $('tabAmountCarriedOverManual'); 

    if(!tab) return;

    if(!entries.length) {
        tab.innerHTML = `<p style="font-size:.82rem;color:var(--muted)"> Nessun riporto manuale salvato.</p>`;
        return;
    }

    tab.innerHTML = `<table class="history-tab">
            <thead>
                <tr>
                    <th>Anno</th>
                    <th>Ore ferie</th>
                    <th>Equiv. giorni</th>
                    <th>Ore permesso</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            ${entries.map(([y,v]) => `
                <tr>
                    <td>
                        <strong>${y}</strong>
                    </td>
                    <td class="ht-amountCarriedOver">${v.leaveHours}h</td>
                    <td style="color:var(--muted);font-size:.8rem">${fmt2(v.leaveHours / S.cfg.dayHours)}gg</td>
                    <td class="ht-amountCarriedOver">${v.permitHours}h</td>
                    <td>
                        <button data-yr="${y}" class="btn-rim-amountCarriedOver" style="background:#fee2e2;border:none;color:var(--danger);padding:4px 10px;border-radius:6px;cursor:pointer;font-size:.78rem;font-weight:600">Rimuovi</button>
                    </td>
                </tr>`                    
             ).join('')}
            </tbody>
        </table>`;
    tab.querySelectorAll('.btn-rim-amountCarriedOver').forEach(b =>{
        b.onclick = () => removeAmountCarriedOver(b.dataset.yr);
    });  
}

function buildHistory(){
    const yE = Object.keys(S.ev).map(k => parseInt(k.slice(0,4)));
    const yR = Object.keys(S.amountCOManual || {}).map(k => parseInt(k));
    const all = [...new Set([...yE, ...yR])].sort();

    if(!all.length) return `<p style="color:var(--muted);font-size:.85rem;padding:8px 0">Nessun anno con eventi o riporti.</p>`;

    let rows='';

    all.forEach(y => {
        const st = calcStats(y);  const riL = st.amountCarriedOver.leaveDays; const riP = st.amountCarriedOver.permitHours;
        rows += `<tr>
            <td>
                <strong>${y}</strong>
            </td>
            <td> ${st.leaveCons}gg / ${st.leaveTotalYearly}gg
                ${riL > 0 ? `<span class = "ht-amountCarriedOver">(+${riL}gg)</span>` : ''}
            </td>
            <td class="${st.leaveACO > 0? 'ht-amountCarriedOver' : 'ht-zero'}">${st.leaveACO > 0 ? '+' + st.leaveACO + 'gg' : '-'}</td>
            <td>${st.permitHours}h / ${st.permitTotalYearly}h
                ${riP > 0 ? ` <span class="ht-amountCarriedOver">(+${riP}h)</span>` : ''}
            </td>
            <td class="${st.permitHourACO > 0 ? 'ht-amountCarriedOver' : 'ht-zero'}">${st.permitHourACO > 0 ? '+'+ st.permitHourACO + 'h' : '-'}</td>
        </tr>`
    });

    return `<table class="history-table">
        <thead>
            <tr>
                <th>Anno</th>
                <th>Ferie usate</th>
                <th>Residuo</th>
                <th>Permesso usato</th>
                <th>Residuo</th>
            </tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>`
}

async function clearAll() {
    if(!confirm('Cancellare tutti gli eventi? Azione irreversibile.')) return;

    const snap = await getDocs(evRef());
    const batch = writeBatch(db);

    snap.forEach(d => batch.delete(d.ref));
    await batch.commit();
    $('yearsHistory').innerHTML = buildHistory();
}

Object.assign(window, {
    adj,
    adjR,
    onToggleAmountCarriedOver,
    onManYearChange,
    saveAmountCarriedOverManual,
    clearAll
});

guardPage('settings', renderSettings);