// ================================================
// state.js — Local shared state + costants
// ================================================

export const MONTHS = ['', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Decembre'];

// Application state (cache of Firestore data)
export const S = {
    cfg: { leaveTotal:28, permitHours: 104, dayHours: 8, year: 2026,
           aCOEnabled: false, maxACOleave: 0, maxACOPerm: 0, monthDeadline: 0 },
    ev: {},
    amountCOManual: {"2026": { leaveHours: 29, permitHours: 42 } },
    vm: { y: 2026, m: new Date().getMonth() },
    sel: { dates: [], tipo: null, qty: 'whole', half: 'morning', hours: 1 },
    mode: 'single'
}

// State calendar option
export const CAL = {
    inclWE: false,
    exclLeave: true,
    paese: 'IT',
    rangeStart: null,
    extraCountries: []
}