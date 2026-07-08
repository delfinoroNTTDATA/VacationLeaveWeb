// ================================================
// state.js — Local shared state + costants
// ================================================

export const MESI = ['', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
                        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Decembre'];

// Application state (cache of Firestore data)
export const S = {
    cfg: { vacationTotal:28, permitHours: 104, dayHours: 8, year: 2026,
           aCOEnabled: false, maxACOVacation: 0, maxACOPerm: 0, monthDeadline: 0 },
    ev: {},
    amountCOManual: {"2026": { vacationHours: 29, permHours: 42 } },
    vm: { y: 2026, m: new Date().getMonth() },
    sel: { dates: [], tipo: null, qty: 'intero', half: 'mattina', hours: 1 },
    mode: 'singolo'
}

// State calendar option
export const CAL = {
    inclWE: false,
    exclFest: true,
    paese: 'IT',
    rangeStart: null
}