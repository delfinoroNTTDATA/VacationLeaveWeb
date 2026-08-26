// =================================================================================================
// report.js - Report Functions
// =================================================================================================

import { S } from './state.js'
import { eventHours, day, fmt2 } from './calc.js'
import { guardPage } from './app-shell.js'
import { t, tn, monthNames } from './i18n.js'

const $ = id => document.getElementById(id);

function getSelectedMonth() { return [...document.querySelectorAll('.month-chip.active')].map( b => parseInt(b.dataset.m)); }

function getSelectedYears() { return [...document.querySelectorAll('.year-chip.active')].map( b => parseInt(b.dataset.y)).sort((a,b) => a-b); }

function toggleYear(btn) { btn.classList.toggle('active'); }

function updateMonthsAllNoneVisibility(){
    const total = document.querySelectorAll('.month-chip').length;
    const selected = getSelectedMonth().length;

    const btnAll = $('btnMonthsAll');
    const btnNone = $('btnMonthsNone');

    if (btnAll) btnAll.style.display = selected === total ? 'none' : '';
    if (btnNone) btnNone.style.display = selected === 0 ? 'none' : '';
}

function flattenEv(evObj) {
    return Object.entries(evObj).flatMap(([k, entries]) =>
        (Array.isArray(entries) ? entries : [entries]).map(ev => [k, ev])
    );
}

function toggleMonth(btn) { btn.classList.toggle('active'); updateMonthsAllNoneVisibility(); }

function selAllMonths(tutti) { document.querySelectorAll('.month-chip').forEach( b => {
     if(tutti){
        b.classList.add('active');
    } else {
        b.classList.remove('active');
    }
});
    updateMonthsAllNoneVisibility();
}

function initReport() {
    const yr = S.cfg.year;
    const allY = [ ...new Set([yr-2, yr-1, yr, yr+1, ...Object.keys(S.ev).map( y => parseInt(y.slice(0, 4)))])].sort((a,b) => b-a);

    $('yearGrid').innerHTML = allY.map( y => `<button class="year-chip${y===yr?' active':''}" data-y="${y}" onclick="toggleYear(this)">${y}</button>`).join('');

    const prevSelected = new Set(getSelectedMonth());
    const names = monthNames();

    $('monthGrid').innerHTML = names.map((name, i) => {
        const m = i + 1;
        const active = prevSelected.size ? prevSelected.has(m) : true;
        return `<button class="month-chip${active ? ' active' : ''}" data-m="${m}" onclick="toggleMonth(this)">${name.slice(0,3)}</button>`;
    }).join('');

    updateMonthsAllNoneVisibility();
}

function fmtDay(ds, ev) {
    const [, m, d] = ds.split('-');
    let note = '';

    if(ev.type !== 'office') {
        if(ev.qty === 'half'){
            note = t(ev.half === 'morning' ? 'm_morning_short' : 'm_afternoon_short');
        }else if (ev.qty === 'hours') {
            note = `${ev.hours}h`;
        }
    }
    return `${d}/${m} ${note}`;
}
function buildYearBlock(yr, months, showYearHeading) {
    const evYear = flattenEv(S.ev).filter(([k]) => k.startsWith(String(yr) + '-')).sort(([a], [b]) => a.localeCompare(b));

    let totLGG = 0, totLH = 0, totPGG= 0, totPH = 0, totO= 0;

    const blocks = months.sort((a,b) => a - b).map( m => {
        const mm = String(m).padStart(2, '0');
        const evM = evYear.filter(([k]) => k.slice(5,7) === mm);
        const leave = evM.filter(([,ev]) => ev.type === 'leave');
        const permit = evM.filter(([,ev]) => ev.type === 'permit');
        const office = evM.filter(([,ev]) => ev.type === 'office');
        const oL = leave.reduce((a,[,ev]) => a + eventHours(ev), 0);
        const oP = permit.reduce((a,[,ev]) => a + eventHours(ev), 0);
        const lGG = day(oL) , pGG= day(oP);

        totLGG += lGG; totLH += oL; 
        totPGG += pGG; totPH += oP; totO += office.length;

        let badges = '';

        if(leave.length) badges += `<div class="rpt-badge rpt-badge-leave"> 🌴 ${lGG}gg (${oL}h)</div>`;
        if(permit.length) badges += `<div class="rpt-badge rpt-badge-permit"> ⏰ ${pGG}gg (${oP}h)</div>`;
        if(office.length) badges += `<div class="rpt-badge rpt-badge-office"> 🏢 ${office.length}gg</div>`;
        if(!evM.length) badges = `<span style="font-size:.78rem;color:var(--muted)">${t('rpt_no_event')}</span>`;

        function typeRow(arr,ico,type) {
            if(!arr.length) return '';

            const chips = arr.map(([k,ev]) => `<div class="rpt-chip rpt-chip-${type}">${fmtDay(k,ev)}</div>`).join('');

            return `<div class="rpt-type-row">
                <div class="rpt-type-ico">${ico}</div>
                <div class="rpt-type-content">
                    <div class="rpt-type-label">${t(type === 'leave' ? 't_leave' : type === 'permit' ? 't_permit' : 't_office')}</div>
                    <div class="rpt-chips-wrap">${chips}</div>
                </div>
            </div>`;
        }

        const rows = typeRow(leave, '🌴', 'leave') + typeRow(permit, '⏰', 'permit') + typeRow(office, '🏢', 'office');
        return `<div class="rpt-month-block">
            <div class="rpt-month-header">
                <div class="rpt-month-name">${monthNames()[m-1]} ${yr}</div>
                <div class="rpt-month-badges">${badges}</div>
            </div>
            ${rows ? `<div class="rpt-days">${rows}</div>` : ''}
        </div>`
    });

    const total = `<div class="rpt-total">
        <div class="rpt-tot-item">
            <div class="rpt-tot-val" style="color:var(--leave)">${fmt2(totLGG)}gg</div>
            <div class="rpt-tot-lbl"> ${t('rpt_leave_tot')} (${fmt2(totLH)}h)</div>
        </div>
        <div class="rpt-tot-item">
            <div class="rpt-tot-val" style="color:var(--permit)">${fmt2(totPGG)}gg</div>
            <div class="rpt-tot-lbl"> ${t('rpt_perm_tot')} (${fmt2(totPH)}h)</div>
        </div>
        <div class="rpt-tot-item">
            <div class="rpt-tot-val" style="color:var(--office)">${totO}</div>
            <div class="rpt-tot-lbl"> ${t('rpt_office')}</div>
        </div>
    </div>`

    const heading = showYearHeading ? `<div class="rpt-year-heading">${tn('rpt_year_heading', {yr})}</div>` : '';

    return `${heading}${total}${blocks.join('')}`;
}

function buildReport() {
    const years = getSelectedYears();
    const months = getSelectedMonth();

    if (years.length === 0) {
        $('reportOut').innerHTML = ` <div class="empty-msg">
            <span>📅</span> ${t('rpt_select_year')}
        </div>`;
        return;
    }

    if (months.length === 0) {
        $('reportOut').innerHTML = ` <div class="empty-msg">
            <span>📅</span> ${t('rpt_select_month')}
        </div>`;
        return;
    }

    $('reportOut').innerHTML = years.map(yr => buildYearBlock(yr, months, years.length > 1)).join('');
}

function doExcel(){
    const years = getSelectedYears();
    const months = getSelectedMonth();

    if (years.length === 0 || months.length === 0) return;

    const wb = XLSX.utils.book_new();

    years.forEach(yr => {
        const evL = flattenEv(S.ev).filter(([k]) => {
            if(!k.startsWith(String(yr) + '-')) return false; return months.includes(parseInt(k.slice(5,7)));
        }).sort(([a],[b]) => a.localeCompare(b));

        const rows = [[t('rpt_col_month'), t('rpt_col_date'), t('m_type'), t('m_duration'), t('rpt_col_detail'), t('m_hours')]];

        evL.forEach(([k,ev]) => {
            const [y,m,d] = k.split('-');
            const month = monthNames()[parseInt(m)-1];
            const dur = ev.type === 'office' ? t('m_full') : ev.qty === 'half' ? t('m_half') : ev.qty === 'hours' ? t('m_hours') : t('m_full');
            const det = ev.qty === 'half' ? t(ev.half === 'morning' ? 'hb_morning' : 'hb_afternoon') : (ev.qty === 'hours' ? `${ev.hours}h` : '');
            rows.push([month, `${d}/${m}/${y}`, t(ev.type === 'leave' ? 't_leave' : ev.type === 'permit' ? 't_permit' : 't_office'), dur, det, eventHours(ev)]);
        });

        const ws = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, String(yr));
    });

    const label = years.length > 1 ? `${years[0]}-${years[years.length - 1]}` : String(years[0]);
    XLSX.writeFile(wb, `leave_${label}_report.xlsx`);
}

Object.assign(window, {
    toggleMonth,
    toggleYear,
    selAllMonths,
    buildReport,
    doExcel
});

guardPage('report', () => { initReport(); });