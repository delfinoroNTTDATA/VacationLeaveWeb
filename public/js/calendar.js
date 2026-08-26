import { S, CAL, MONTHS} from "./state.js";
import {
    holidaysForYear,
    holidayName,
    extraHolidayFor,
    clearHolidayCache,
    rangeDays,
    currentCountry,
    COUNTRY_FLAG,
    countryName,
    isWeekend
} from "./holidays.js";
import { saveEvents, deleteEvents, saveDayEntries } from "./data.js";
import { calcStats } from "./calc.js";
import { currentLang } from "./i18n.js";
import { guardPage } from "./app-shell.js";

const $ = id => document.getElementById(id);

function dpSyncSelectors () {
    const mS = $('dpMonth'), yS = $( 'dpYear');
    if (!mS || !yS) return;

    const year = [];

    for (let i = S.vm.y - 5; i <= S.vm.y + 5; i++) {
        year.push(i);
    }

    yS.innerHTML = year.map( y => `<option value="${y}" ${y === S.vm.y ? 'selected' : ''}>${y}</option>`).join('');
    mS.value = String(S.vm.m);
}

function shiftMonth(d) {
    S.vm.m += d;

    if (S.vm.m < 0) {
        S.vm.m = 11;
        S.vm.y--;
    }

    if (S.vm.m > 11){
        S.vm.m = 0;
        S.vm.y++;
    }

    clearMultiSelection();
    dpSyncSelectors();
    renderCal();
}

function dpChange() {
    S.vm.m = parseInt($('dpMonth').value);
    S.vm.y = parseInt($('dpYear').value);

    clearMultiSelection();
    renderCal();
}

function dpToday() {
    const t = new Date();

    S.vm.y = t.getFullYear();
    S.vm.m = t.getMonth();

    clearMultiSelection();
    dpSyncSelectors();
    renderCal()
}

function renderCal() {
    const {y , m} = S.vm;

    dpSyncSelectors();

    const first = new Date(y, m, 1).getDay();
    const offset = first === 0 ? 6 : first - 1;
    const dim = new Date(y,m+1, 0).getDate();
    const today = new Date();
    const holidays = holidaysForYear(y);

    let rStart = null, rEnd = null;

    if (S.mode === 'range') {
        if (S.sel.dates.length > 0) {
            const sortedSel = [...S.sel.dates].sort();
            rStart = sortedSel[0];
            rEnd = sortedSel[sortedSel.length - 1];
        } else if (CAL.rangeStart) {
            rStart = CAL.rangeStart;
        }
    }

    let html = '';

    for (let i = 0; i < offset; i++){
        html += `<div class="cal-day empty"></div>`;
    }

    for (let d = 1; d <= dim; d++){
        const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const entries = S.ev[ds] || [];
        const dow= new Date(y,m,d).getDay();
        const isWeekend = dow === 0 || dow === 6;
        const isHoliday =  holidays.has(ds);
        const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
        const isSelected = S.sel.dates.includes(ds);

        let cls = 'cal-day';

        if (isWeekend) cls += ' weekend';
        if (isHoliday) cls += ' holiday';
        if (isToday) cls += ' today';
        if (isSelected && S.mode !== 'range') cls += ' selected-multi';
        if (S.mode === 'range'){
            if (rStart && rEnd) {
                if (ds === rStart) cls += ' range-start';
                else if (ds === rEnd) cls += ' range-end';
                else if (ds > rStart && ds < rEnd) cls += ' range-mid';
            }else if (rStart && ds === rStart) cls += ' range-start';
        }

        let tag = '';

        entries.forEach(ev => {
            const icon = ev.type === 'leave' ? '🌴' : ev.type === 'permit' ? '⏰':'🏢';
            const lbl = ev.type === 'leave' ? 'Ferie' : ev.type === 'permit' ? 'Permesso' : 'Sede';
            let qNote= '';

            if (ev.type !== 'office') {
                if (ev.qty === 'half') {
                    qNote = ` ½${ev.half==='morning'? 'M' : 'P'}`;
                } else if (ev.qty === 'hours') {
                    qNote = ` ${ev.hours}h`;
                }
            }

            tag += `<div class="dtag dtag-${ev.type}" data-i18n="calendar_add_${ev.type}"> ${icon} ${lbl} <span data-i18n="m_${ev.type === 'office' ? '' : ev.half}_short">${qNote}</span></div>`
        });

        if (isHoliday){
             const name = holidayName(ds) || 'Festivo';
             tag += `<div class="dtag dtag-holiday" title="${name}">🎉 ${name}</div>`
        }

        extraHolidayFor(ds).forEach((d) => {
            tag += `<div class="dtag dtag-extra" title="${countryName(d.country, currentLang())}: ${d.name}">
                    ${COUNTRY_FLAG[d.country]} ${d.name}</div>`
        })

        html += `<div class="${cls}" id="cd-${ds}" data-ds="${ds}"><div class="dn">${d}</div>
                 <div class="day-tags">${tag}</div></div>`
    }

    $('calDays').innerHTML = html;

    $('calDays').querySelectorAll('.cal-day[data-ds]').forEach(el =>{
        el.onclick= () => dayClick(el.dataset.ds);
    });

    updateLegendStats();
}

function updateLegendStats(){
    const st = calcStats(S.vm.y);

    const leaveEl = $('legStatLeave');
    if (leaveEl) leaveEl.textContent = `${st.leaveCons}gg usate · ${st.leaveACO}gg residue`;

    const permitEl = $('legStatPermit');
    if (permitEl) permitEl.textContent = `${st.permitHours}h usate · ${st.permitHourACO}h residue`;

    const officeEl = $('legStatOffice');
    if (officeEl) officeEl.textContent = `${st.officeDays}gg`;
}

function renderExtraChips(){
        const wrap = $('extraChips');
        if (!wrap) return;

        wrap.innerHTML = (CAL.extraCountries || []).map(cc=>
            `<span class="extra-chip">${COUNTRY_FLAG[cc]} ${countryName(cc, currentLang())}
                <button data-cc="${cc}" class="extra-chip-x">×</button></span>`
        ).join('');
        wrap.querySelectorAll('.extra-chip-x').forEach(b=> {
            b.onclick= () => removeExtra(b.dataset.cc);
        });

        const sel = $('extraCountry');
        if (sel) {
            const cur = currentCountry();
            const lang = currentLang();
            sel.innerHTML = `<option value="">+ Aggiungi festività di un altro paese</option>` +
                Object.keys(COUNTRY_FLAG)
                    .filter(cc => cc !== cur && !(CAL.extraCountries || []).includes(cc))
                    .map(cc => `<option value="${cc}">${COUNTRY_FLAG[cc]} ${countryName(cc, lang)}</option>`)
                    .join('');
        }
}

function addExtra(cc){
        if (!cc) return;

        if ( cc === currentCountry()) return;

        if (!CAL.extraCountries.includes(cc)) CAL.extraCountries.push(cc);

        const sel = $('extraCountry');
        if (sel) sel.value = '';

        renderExtraChips(); renderCal();
}

function removeExtra(cc){
        CAL.extraCountries = CAL.extraCountries.filter(x => x !== cc);
        renderExtraChips(); renderCal();
}

function toggleOptions(option){
        if (option === 'we'){
            CAL.inclWE = !CAL.inclWE;
            $('togWe').className= 'cal-opt-toggle' + (CAL.inclWE ? ' on' : '');
        } else {
            CAL.exclLeave = !CAL.exclLeave;
            $('togLeave').className= 'cal-opt-toggle' + (CAL.exclLeave ? ' on' : '');
        }
        clearHolidayCache(); clearMultiSelection(); renderCal();
}

const RANGE_HINT_DEFAULT = 'Seleziona il primo giorno';

function setSelMode (mode) {
        S.mode = mode; clearMultiSelection();

        ['single' , 'range'].forEach(n => {
            const id = 'btnMode'+ n.charAt(0).toUpperCase() + n.slice(1);
            if ($(id)) $(id).className = 'sel-mode-btn' + (S.mode === n ? ' active' : '');
        })

        $('rangeHint').className = 'range-hint' + (mode === 'range' ? ' show' : '');
        renderCal()
}

function clearMultiSelection(){
        S.sel.dates = [];
        CAL.rangeStart = null;

        const hint = $('rangeHint');
        if (hint) hint.textContent = RANGE_HINT_DEFAULT;

        const applyBtn = $('btnApplyMulti');
        if (applyBtn) applyBtn.className = 'btn-apply-multi';

        const cancelBtn = $('btnCancelMulti');
        if (cancelBtn) cancelBtn.className = 'btn-cancel-multi';
}

function cancelSelection(){
        clearMultiSelection();
        renderCal();
}

function dayClick(ds){
        if (S.mode === 'single') {
            S.sel.dates = [ds];
            openModal([ds]);
            return;
        }

        if (S.mode === 'range') {
            if (!CAL.rangeStart){
                CAL.rangeStart = ds;
                S.sel.dates = [ds];
                $('rangeHint').textContent = 'Clicca la fine del periodo';
                $('btnCancelMulti').className = 'btn-cancel-multi show';
            } else {
                const start = CAL.rangeStart <= ds ? CAL.rangeStart: ds;
                const end = CAL.rangeStart <= ds ? ds : CAL.rangeStart;
                S.sel.dates = rangeDays(start, end);
                CAL.rangeStart = null;

                const n = S.sel.dates.length;
                $('rangeHint').textContent = `${n} giorn${n === 1 ? 'o' : 'i'} selezionat${n === 1 ? 'o' : 'i'} - clicca Segna`;

                const btn = $('btnApplyMulti');
                btn.className = 'btn-apply-multi' + (n > 0 ? ' show' : '');
                if (n > 0) btn.textContent = `Segna ${n} giorn${n === 1 ? 'o' : 'i'} ▶`;

                $('btnCancelMulti').className = 'btn-cancel-multi' + (n > 0 ? ' show' : '');
            }
            renderCal();
        }
}

function applyMulti(){
        if (S.sel.dates.length > 0) openModal(S.sel.dates);
}

function describeType(t){
        return t === 'leave' ? 'Ferie' : t === 'permit' ? 'Permesso' : 'Sede';
}

function openModal(dates){
        const existing = dates.length === 1 ? (S.ev[dates[0]] || []) : [];
        const halfEntries = existing.filter(e => e.qty === 'half');
        const existingInfo = $('mExisting');

        if (halfEntries.length === 2) {
            const morning = halfEntries.find(e => e.half === 'morning');
            const afternoon = halfEntries.find(e => e.half === 'afternoon');

            existingInfo.textContent = `Mattina: ${describeType(morning.type)} · Pomeriggio: ${describeType(afternoon.type)}`;
            existingInfo.style.display = 'block';

            S.sel.type = morning.type; S.sel.qty = 'half';
            S.sel.half = 'morning'; S.sel.hours = 1;

        } else if (halfEntries.length === 1) {
            const ev = halfEntries[0];
            const missingHalf = ev.half === 'morning' ? 'afternoon' : 'morning';

            existingInfo.textContent = `Già segnato: ${ev.half === 'morning' ? 'Mattina' : 'Pomeriggio'} – ${describeType(ev.type)}. Scegli il tipo per l'altra metà.`;
            existingInfo.style.display = 'block';

            S.sel.type = null; S.sel.qty = 'half';
            S.sel.half = missingHalf; S.sel.hours = 1;

        } else {
            const firstEv = existing[0] || null;

            existingInfo.textContent = ''; existingInfo.style.display = 'none';

            S.sel.type = firstEv?.type || null; S.sel.qty = firstEv?.qty || 'whole';
            S.sel.half = firstEv?.half || 'morning'; S.sel.hours = firstEv?.hours || 1;
        }

        $('mTitle').textContent = dates.length === 1 ? `Segna giornata` : `Segna ${dates.length} giorni`;

        if (dates.length === 1) {
            const [y, m, d] = dates[0].split('-');
            $('mSub').textContent = `${d} ${MONTHS[parseInt(m)]} ${y}`;
        } else {
            const s = [...dates].sort();
            const f = ds => {
                const [,m, d] = ds.split('-');
                return `${d}/${m}`;
            };

            $('mSub').textContent = s.slice(0,5).map(f).join(', ') + (s.length > 5 ? ` + ${s.length - 5} altri` : '');
        }

        $('hoursDayLabel').textContent = S.cfg.dayHours;
        $('hoursInput').value = S.sel.hours;

        refreshOptions(); refreshQty(); $('ovl').classList.add('open');
}

function closeModal(){ $('ovl').classList.remove('open'); }

function pick(t){ S.sel.type = S.sel.type === t ? null : t; refreshOptions(); }

function refreshOptions(){ 
    ['leave', 'permit', 'office'].forEach(t => {
        $('opt-' + t).className = 'type-opt' + (S.sel.type === t ? ` sel-${t}` : '');
    });
}

function setQty(q){ S.sel.qty = q; refreshQty(); }

function setHalf(h){ 
    S.sel.half = h;

    const cls = S.sel.type === 'permit' ? 'active-p' : 'active';

    $('hbMorning').className = 'half-btn' + (h === 'morning' ? ` ${cls}` : '');
    $('hbAfternoon').className = 'half-btn' + (h === 'afternoon' ? ` ${cls}` : '');
}

function refreshQty(){
    const isOffice = S.sel.type === 'office';

    $('qtySec').style.display = isOffice ? 'none' : 'block';
    if (isOffice) return;

    const cls = S.sel.type === 'permit' ? 'active-p' : 'active';

    ['whole', 'half', 'hours'].forEach(q => {
        const id = 'qb' + q.charAt(0).toUpperCase() + q.slice(1);
        $(id).className = 'qty-btn' + (S.sel.qty === q.toLowerCase() ? ` ${cls}` : '');
    });

    $('halfRow').style.display = S.sel.qty === 'half' ? 'grid' : 'none';
    $('hoursRow').style.display = S.sel.qty === 'hours' ? 'flex' : 'none';

    const hcls = S.sel.type === 'permit' ? 'active-p' : 'active';

    $('hbMorning').className = 'half-btn' + (S.sel.half === 'morning' ? ` ${hcls}` : '');
    $('hbAfternoon').className = 'half-btn' + (S.sel.half === 'afternoon' ? ` ${hcls}` : '');

    if (S.sel.qty === 'hours') {
        const h = parseInt($('hoursInput').value) || 1;

        $('hoursNote').textContent = `Equivale a ${(h/S.cfg.dayHours).toFixed(2)} giorni`;
    }else {
        $('hoursNote').textContent = '';
    }
}

async function saveDay(){
    if (!S.sel.type || S.sel.dates.length === 0){
        closeModal();
        return;
    }

    const hoursCustom = Math.max(1, parseInt($('hoursInput').value) || 1);
    const newEntry = {
        type: S.sel.type,
        qty: S.sel.type === 'office' ? 'whole' : S.sel.qty,
        half: S.sel.half,
        hours: hoursCustom
    };

    try {
        if (S.sel.dates.length === 1 && newEntry.qty === 'half') {
            const ds = S.sel.dates[0];
            const otherHalf = (S.ev[ds] || []).find(e => e.qty === 'half' && e.half !== newEntry.half);
            await saveDayEntries(ds, otherHalf ? [otherHalf, newEntry] : [newEntry]);
        } else {
            await saveEvents(S.sel.dates, newEntry);
        }
    }
    catch(e) { 
        alert('Errore salvataggio: ' + e.message); 
        return; 
    } 

    closeModal(); clearMultiSelection(); renderCal();
}

async function delDay() {
    if(S.sel.dates.length === 0) { 
        closeModal();
        return;
    }

    try { await deleteEvents(S.sel.dates); }
    catch (e) {
        alert('Errore eliminazione: ' + e.message);
        return;
    }

    closeModal(); clearMultiSelection(); renderCal();
}

Object.assign(window,{
    shiftMonth, dpChange, dpToday, toggleOptions, addExtra,
    setSelMode, applyMulti, cancelSelection, pick, setQty, setHalf, closeModal
});

guardPage('calendar', () => {
    dpSyncSelectors(); 
    renderExtraChips();
    renderCal();
})

document.addEventListener('localechange', () => {
    renderExtraChips();
    renderCal();
});

document.addEventListener('DOMContentLoaded', () => {
    $('btnSave').onclick = saveDay;
    $('btnDel').onclick = delDay;
    $('ovl').addEventListener('click', e => {
        if(e.target === $('ovl')) closeModal();
    });
    $('hoursInput').addEventListener('input', () => {
        const h = parseInt($('hoursInput').value) || 0;
        $('hoursNote').textContent = h > 0 ? `Equivale a ${(h/S.cfg.dayHours).toFixed(2)} giorni` : ''
    });
});