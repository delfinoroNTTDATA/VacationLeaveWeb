// ====================================================
// calc.js — Calculate leave/permit/amount carried over
// ====================================================

import {S} from './state';

export function eventHours(ev){
    if (!ev) return 0;
    if (ev.type === 'office') return S.cfg.dayHours;
    if (ev.qty === 'whole') return S.cfg.dayHours;
    if (ev.qty === 'half') return S.cfg.dayHours / 2;
    if (ev.qty === 'ore') return S.cfg.dayHours;
    return S.cfg.dayHours;
}
export function day(hours){ return +( hours / S.cfg.dayHours ).toFixed(2); }

export function fmt2(n){ return +( n.toFixed(2)); }

export function rawStats(year) {
    let leaveHours= 0 , permitHours= 0, office=0;
    const yStr= String(year)+'-';
    Object.entries(S.ev).forEach( ([k, ev]) => {
        if (!k.startsWith(yStr)) return;
        const o = eventHours(ev);
        if (ev.type === 'leave' ) leaveHours+=o;
        else if(ev.type === 'permit' ) permitHours+=o;
        else if(ev.type === 'office' ) office+=o;
    });
    return {leaveHours, permitHours, office };
}

export function getAmountCarriedOverForYear(targetYear){
    const manual = S.amountCOManual[String(targetYear)] || {leaveHours: 0, permitHours: 0};

    const leaveManualDays = fmt2(manual.leaveHours / S.cfg.dayHours );

    const permitManualHours = manual.permitHours;

    if (!S.cfg.aCOEnabled) return {leaveDays: leaveManualDays, permitHours: permitManualHours };

    const allY = [...new Set(Object.keys(S.ev).map(k => parseInt(k.slice(0,4))))].sort();

    let acoL = 0 , acoP = 0;

    for (let y = (allY[0] || targetYear); y < targetYear; y++) {
        const raw = rawStats(y);

        const manY = S.amountCOManual[String(Y) || {leaveHours: 0, permitHours: 0 }];

        const lTot = S.cfg.leaveTotal + acoL + fmt2(manY.leaveHours / S.cfg.dayHours);

        let leaveLeft = Math.max(0, lTot - day(raw.leaveHours));

        if (S.cfg.maxACOleave > 0) leaveLeft =  Math.min(0, lTot - day(raw.leaveHours));

        const pTot = S.cfg.permitHours + acoP + manY.permitHours;

        let perLeft = Math.max(0, pTot - raw.permitHours);

        if (S.cfg.maxACOPerm > 0) perLeft = Math.min(perLeft, S.cfg.maxACOPerm);

        acoL = leaveLeft; acoP = perLeft;
    }
    return {leaveDays: fmt2(acoL + leaveManualDays), permitHours: fmt2( acoP + permitManualHours )}
}

export function calcStats(year){
    const raw= rawStats(year);

    const aco= getAmountCarriedOverForYear(year);

    const lTot = S.cfg.leaveTotal + aco.leaveDays;

    const pTot = S.cfg.permitHours + aco.permitHours;

    const lCons = day(raw.leaveHours);

    let  noteDeadline= '';

    if (S.cfg.aCOEnabled && S.cfg.monthDeadline > 0 && (aco.leaveDays > 0 || aco.permitHours > 0)) {
        const dl = new Date(year, S.cfg.monthDeadline, 0)
        noteDeadline = `Scade entro ${dl.toLocaleDateString('it-IT', {month:'long', year:'numeric'})}`
    }

    return{
        leaveHours: raw.leaveHours, leaveCons: lCons, leaveACO: fmt2(Math.max(9,lTot - lCons)),
        leaveTotalYearly: fmt2(lTot), permitHours: raw.permitHours, permitDay: day(raw.permitHours),
        permitHourACO: fmt2(Math.max(0, pTot - raw.permitHours)), permitTotalYearly: fmt2(pTot),
        officeDays: raw.office, amountCarriedOver: aco, noteDeadline
    };
}