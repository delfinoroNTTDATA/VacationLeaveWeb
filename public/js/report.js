// =================================================================================================
// report.js - Report Functions
// =================================================================================================

import { S } from './state.js'
import { eventHours, day, fmt2 } from './calc.js'
import { guardPage } from './app-shell.js'

const $ = id => document.getElementById(id);
const NAME = ['', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

function getSelectedMonth() { return [...document.querySelectorAll('.month-chip.active')].map( b => parseInt(b.dataset.m)); }

function toggleMonth(btn) { btn.classList.toggle('active'); }

function selAllMonths(tutti) { document.querySelectorAll('.month-chip').forEach( b => {
     if(tutti){
        b.classList.add('active');
    } else {
        b.classList.remove('active');
    }
});
}

function initReport() {
    const yr = S.cfg.year;
    const allY = [ ...new Set([yr-2, yr-1, yr, yr+1, ...Object.keys(S.ev).map( y => parseInt(y.slice(0, 4)))])].sort((a,b) => b-a);

    $('rYears').innerHTML = allY.map( y => `<option value="${y}" ${y===yr?'selected':''}>${y}</option>`).join('');
}

function fmtDay(ds, ev) {
    const [, m, d] = ds.split('-');
    let note = '';

    if(ev.type !== 'office') {
        if(ev.qty === 'half'){
            note = ev.half === 'morning' ? '½ M' : '½ P';
        }else if (ev.qty === 'hours') {
            note = `${ev.hours}h`;
        }
    }
    return `${d}/${m} ${note}`;
}

function buildReport() {
    const yr = parseInt($('rYears').value);
    const months = getSelectedMonth();

    if (months.length === 0) {
        $('reportOut').innerHTML = ` <div class="empty-msg">
            <span>📅</span> Seleziona almeno un mese
        </div>`;
        return;
    }

    const evYear = Object.entries(S.ev).filter(([k]) => k.startsWith(String(yr) + '-')).sort(([a], [b]) => a.localeCompare(b));

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
        if(!evM.length) badges = `<span style="font-size:.78rem;color:var(--muted)">Nessun evento</span>`;

        function typeRow(arr,ico,type) {
            if(!arr.length) return '';

            const chips = arr.map(([k,ev]) => `<div class="rpt-chip rpt-chip-${type}">${fmtDay(k,ev)}</div>`).join('');

            return `<div class="rpt-type-row">
                <div class="rpt-type-ico">${ico}</div>
                <div class="rpt-type-content">
                    <div class="rpt-type-label">${type === 'leave' ? "Ferie" : type === 'permit' ? 'Permesso' : 'Sede'}</div>
                    <div class="rpt-chips-wrap">${chips}</div>
                </div>
            </div>`;
        }

        const rows = typeRow(leave, '🌴', 'leave') + typeRow(permit, '⏰', 'permit') + typeRow(office, '🏢', 'office');
        return `<div class="rpt-month-block">
            <div class="rpt-month-header">
                <div class="rpt-month-name>${NAME[m]} ${yr}</div>
                <div class="rpt-month-badges">${badges}</div>
            </div>
            ${rows ? `<div class="rpt-days>${rows}</div>` : ''}
        </div>`
    });

    const total = `<div class="rpt-total">
        <div class="rpt-tot-item">
            <div class="rpt-tot-val" style="color:var(--leave)">${fmt2(totLGG)}gg</div>
            <div class="rpt-tot-lbl"> Ferie totali (${fmt2(totLH)}h)</div>
        </div>
        <div class="rpt-tot-item">
            <div class="rpt-tot-val" style="color:var(--permit)>${fmt2(totPGG)}gg</div>
            <div class='rpt-tot-lbl"> Permessi totali (${fmt2(totPH)}h)</div>
        </div>
        <div class="rpt-tot-item">
            <div class="rpt-tot-val" style="color:var(--office)">${totO}</div>
            <div class="rpt-tot-lbl"> Giorni in Sede</div>
        </div>`

    $('reportOut').innerHTML = total + blocks.join('');
}

function doCSV(){
    const yr = parseInt($('rYears').value);
    const months = getSelectedMonth();
    const evL = Object.entries(S.ev).filter(([k]) => {
        if(!k.startsWith(String(yr) + '-')) return false; return months.includes(parseInt(k.slice(5,7)));
    }).sort(([a],[b]) => a.localeCompare(b));

    let csv = 'Mese,Data,Tipo,Durata,Dettaglio,Ore\n';

    evL.forEach(([k,ev]) => {
        const [y,m,d] = k.split('-');
        const month = NAME[parseInt(m)];
        const dur = ev.type === 'office' ? 'whole' : ev.qty || 'whole';
        const det = ev.qty === 'half' ? ev.half : (ev.qty === 'hours' ? `${ev.hours}h` : '');
        csv += `${month},${d}/${m}/${y},${ev.type},${dur},${det},${eventHours(ev)}\n`;
    });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
    a.download = `leave_${yr}_report.csv`;
    a.click();
}

Object.assign(window, {
    toggleMonth,
    selAllMonths,
    buildReport,
    doCSV
});

guardPage('report', () => { initReport(); });