// ================================
// setting.js - Setting page logic
// ================================

import { S } from "./state.js";
import { calcStats, fmt2 } from "./calc.js";
import { saveConfig, saveAmountCarriedOver, removeAmountCarriedOver } from "./data.js";
import { evRef, db } from "./firebase-config.js";
import { getDocs, writeBatch } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { guardPage } from "./app-shell.js";
import { t } from "./i18n.js";

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

    if($('toggleAmountCarriedOverLabel')) $('toggleAmountCarriedOverLabel').textContent = S.cfg.aCOEnabled ? t('set_enabled') : t('set_disabled');

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

    $('toggleAmountCarriedOverLabel').textContent = checked ? t('set_enabled') : t('set_disabled');

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


    } catch(e) { alert(t('set_error_prefix') + e.message); }
}

async function remuoveAmoubtCarriedOverManual(yr) {
    try{
        await removeAmountCarriedOver(yr);
        renderTabAmountCarriedOverManual();
        $('yearsHistory').innerHTML = buildHistory();
    }catch(e) { alert(t('set_error_prefix') + e.message); }  
}

function renderTabAmountCarriedOverManual(){
    const entries = Object.entries(S.amountCOManual || {}).filter(([,v]) => v.leaveHours > 0 || v.permitHours > 0).sort(([a],[b]) => parseInt(a) - parseInt(b));

    const tab = $('tabAmountCarriedOverManual'); 

    if(!tab) return;

    if(!entries.length) {
        tab.innerHTML = `<p style="font-size:.82rem;color:var(--muted)"> ${t('set_no_manual_carryover')}</p>`;
        return;
    }

    tab.innerHTML = `<table class="history-tab">
            <thead>
                <tr>
                    <th>${t('rpt_year_label')}</th>
                    <th>${t('set_leave_hours_word')}</th>
                    <th>${t('set_col_leave_days_equiv')}</th>
                    <th>${t('set_permit_hours_word')}</th>
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
                        <button data-yr="${y}" class="btn-rim-amountCarriedOver" style="background:#fee2e2;border:none;color:var(--danger);padding:4px 10px;border-radius:6px;cursor:pointer;font-size:.78rem;font-weight:600">${t('m_delete')}</button>
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

    if(!all.length) return `<p style="color:var(--muted);font-size:.85rem;padding:8px 0">${t('set_no_years')}</p>`;

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
                <th>${t('rpt_year_label')}</th>
                <th>${t('set_col_leave_used')}</th>
                <th>${t('set_col_residual')}</th>
                <th>${t('set_col_permit_used')}</th>
                <th>${t('set_col_residual')}</th>
            </tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>`
}

async function clearAll() {
    if(!confirm(t('set_confirm_clear'))) return;

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