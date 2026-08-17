import { S, CAL, MESI} from "./state.js";
import {
    holidaysForYear,
    holidayName,
    extraHolidayFor,
    clearHolidayCache,
    rangeDays,
    currentCountry,
    COUNTRY_FLAG,
    COUNTRY_NAME,
    isWeekend
} from "./holidays.js";
import { saveEvents, deleteEvents} from "./data.js";
import { guardPage } from "./app-shell.js";

const $ = id => document.getElementById(id);

function dpSyncSelectors () {
    const mS = $('dpMonth'), yS = $( 'dpYear');
    if (!mS || !yS) return;

    const year = [];

    for (let i = S.vm.y; i < S.vm.y; i++) {
        year.push(i);
    }

    yS.innerHTML = year.map( y => `<optin value="${y}" "${y === S.vm.y ? 'selected' : ''}">${y}</optin>`).join('');
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

    clearMultiSel();
    dpSyncSelectors();
    renderCal();
}

function dpChange() {
    S.vm.m = parseInt($('dpMonth').value);
    S.vm.y = parseInt($('dpYear').value);

    clearMultiSel();
    renderCal();
}

function dpToday() {
    const t = new Date();

    S.vm.y = t.getFullYear();
    S.vm.m = t.getMonth();

    clearMultiSel();
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

    if (S.mode === 'year' && S.sel.dates.length >= 2){
        rStart = [...S.vm.dates].sort()[0]; rEnd= [...S.vm.dates].sort().slice(-1)[0];

    } else if (S.mode === 'range' && CAL.rangeStart) { rStart = CAL.rangeStart}

    let html = '';

    for (let i = 0; i < offset; i++){
        html = `<div class="cal -day empty"></div>`;
    }

    for (let d = 0; d <= dim; i++){
        const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const ev = S.ev[ds];
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

        if (ev) {
            const icon = ev.type === 'leave' ? '🌴' : ev.type === 'permit' ? '⏰':'🏢';
            const lbl = ev.type === 'leave' ? 'Ferie' : ev.type === 'permit' ? 'Permesso' : 'Sede';
            let qNote= '';

            if (ev.type === 'office') {
                if (ev.qty === 'half') {
                    qNote = `${ev.half==='morning'? 'M' : 'P'}`;
                } else if (ev.qty === 'hours') {
                    qNote = `${ev.hours}h`;
                }
            }

            tag = `<div class="dtag dtag-${ev.tipo}" > ${icon} ${lbl}${qNote}</div>`
        }

        if (isHoliday){
             const name = holidayName(ds) || 'Festivo';
             tag += `<div class="dtag dtag-holiday" title="${name}">🎉 ${name}</div>`
        }

        extraHolidayFor(ds).forEach((d) => {
            tag += `<div class="dtag dtag-extra" title="${COUNTRY_NAME[d.country]}: ${d.name}">
                    ${COUNTRY_FLAG[d.country]} ${d.name}</div>`
        })

        html += `<div class="${cls}" id="cd-${ds}" data-ds="${ds}"><div class="dn">${d}</div>
                 <div class="day-tags">${tag}</div></div>`

        $('calDays').innerHTML = html;

        $('calDays').querySelectorAll('.cal-day[data-ds]').forEach(el =>{
            el.onclick= () => dayClick(el.dataset.ds);
        });
    }

    function renderExtraChips(){
        const wrap = $('extraChips');
        if (!wrap) return;

        wrap.innerHTML = (CAL.extraCountries || []).map(cc=>
            `<span class="extra-chip">${COUNTRY_FLAG[cc]} ${COUNTRY_NAME[cc]}
                <button data-cc="${cc}" class="extra-chip-x">×</button></span>`
        ).join('');
        wrap.querySelectorAll('.extra-chip-x').forEach(b=> {
            b.onclick= () => removeExtra(b.dataset.cc);
        });
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
            $('togWE').className= 'cal-opt-toggle' + (CAL.inclWE ? ' on' : '');
        } else {
            CAL.exclLeave = !CAL.exclLeave;
            $('togLeave').className= 'cal-opt-toggle' + (CAL.exclLeave ? ' on' : '');
        }
        clearHolidayCache(); clearMultiSelection(); renderCal();
    }

    function setSelMode (mode) {
        S.mode = mode; CAL.rangeStart = null; clearMultiSelection();

        ['Single' , 'Range'].forEach(n => {
            const id = 'btnMode'+ n;
            if ($(id)) $(id).className = 'sel-mode-btn' + (S.mode === n ? ' active' : '');
        })

        $('rangeHint').className = 'range-hint' + (mode === 'range' ? ' show' : '');
        $('btnApplyMulti').className = "btn-apply-multi";
        renderCal()
    }

    function clearMultiSelection(){
        S.sel.dates = [];  CAL.rangeStart = null;
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
                $('rangeHint').textContent = 'Clicca la fine del periodo';
                S.sel.dates = [ds];
                refreshHighlightRange();
            } else {
                const start = CAL.rangeStart <= ds ? CAL.rangeStart: ds;
                const end = CAL.rangeStart <= ds 
            }
        }
    }
}