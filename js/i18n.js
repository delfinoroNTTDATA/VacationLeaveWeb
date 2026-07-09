// ============================================
// i18n.js — Translate Italian / English
// ============================================

export const I18N = {
    it: {
        nav_dashboard:'Dashboard', nav_calendar:'Calendario', nav_report:'Report', nav_settings:'Impostazioni',
        logout:'Esci', sync_active:'Sincronizzazione Firebase attiva — i dati si aggiornano in tempo reale su tutti i dispositivi',
        recent_events:'Ultimi eventi', mode_label:'Modalità:', mode_single:'▶ Singolo', mode_range:'↦ Intervallo',
        incl_weekend:'Includi Sab/Dom', excl_holidays:'Escludi festivi',
        leave_left:'Ferie Residue', leave_hours_used:'Ore Ferie Usate', permit_hours_left:'Ore Permesso Residue',
        permit_days:'Giorni Permesso', office_days:'Giorni in Sede',
        rpt_months:'Mesi (selezione multipla)', rpt_all:'Tutti', rpt_none:'Nessuno', rpt_generate:'Genera',
        rpt_leave_tot:'Ferie totali', rpt_perm_tot:'Permesso totale', rpt_office:'Giorni in Sede', rpt_months_sel:'Mesi selezionati',
        rpt_no_event:'Nessun evento', rpt_select_month:'Seleziona almeno un mese.',
        t_leave:'Ferie', t_permit:'Permesso', t_office:'Sede', t_holiday:'Festivo',
        m_mark_day:'Segna giornata', m_type:'Tipo', m_duration:'Durata', m_full:'Intera', m_half:'Mezza', m_hours:'Ore',
        m_morning:'Mattina', m_afternoon:'Pomeriggio', m_save:'Salva', m_delete:'Rimuovi', m_cancel:'Annulla',
        login_sub:'Accedi per sincronizzare sito e app', login_email:'Email', login_pass:'Password',
        login_signin:'Accedi', login_or:'— oppure —', login_register:'Crea account',
        set_annual:'Configurazione annuale', set_leave_tot:'Giorni ferie totali', set_perm_ore:'Ore permesso / ROL totali',
        set_day_hours:'Ore lavorative per giornata', set_year:'Anno di riferimento', set_country:'Paese festività',
        months:['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
        months_short:['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'],
        weekdays:['Lun','Mar','Mer','Gio','Ven','Sab','Dom'], syncBadge: '🔄 Sincronizzato', name: 'Ferie & Permesso'
    },
    en: {
        nav_dashboard:'Dashboard', nav_calendar:'Calendar', nav_report:'Report', nav_settings:'Settings',
        logout:'Log out', sync_active:'Firebase sync active — data updates in real time on all your devices',
        recent_events:'Recent events', mode_label:'Mode:', mode_single:'▶ Single', mode_range:'↦ Range',
        incl_weekend:'Include Sat/Sun', excl_holidays:'Exclude holidays',
        leave_left:'Remaining Leave', leave_hours_used:'Leave Hours Used', permit_hours_left:'Remaining Permit Hours',
        permit_days:'Permit Days', office_days:'Office Days',
        rpt_months:'Months (multi-select)', rpt_all:'All', rpt_none:'None', rpt_generate:'Generate',
        rpt_leave_tot:'Total leave', rpt_perm_tot:'Total permit', rpt_office:'Office days', rpt_months_sel:'Selected months',
        rpt_no_event:'No events', rpt_select_month:'Select at least one month.',
        t_leave:'Leave', t_permit:'Permit', t_office:'Office', t_holiday:'Holiday',
        m_mark_day:'Mark day', m_type:'Type', m_duration:'Duration', m_full:'Full', m_half:'Half', m_hours:'Hours',
        m_morning:'Morning', m_afternoon:'Afternoon', m_save:'Save', m_delete:'Remove', m_cancel:'Cancel',
        login_sub:'Sign in to sync website and app', login_email:'Email', login_pass:'Password',
        login_signin:'Sign in', login_or:'— or —', login_register:'Create account',
        set_annual:'Annual configuration', set_leave_tot:'Total leave days', set_perm_ore:'Total permit / ROL hours',
        set_day_hours:'Working hours per day', set_year:'Reference year', set_country:'Holidays country',
        months:['January','February','March','April','May','June','July','August','September','October','November','December'],
        months_short:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        weekdays:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], syncBadge: '🔄 Synchronised', name: 'Leave & Permit'
    }
};

export let LANG = localStorage.getItem('leave_lang') || 'it';

export function t(key) {
    return ( I18N[LANG] && I18N[LANG][key]) || ( I18N.it[key] ) || key;
}

export function applyI28n(){
    document.querySelectorAll('[data-i18n]').forEach( el => {
        const val = t(el.dataset.i18n);
        if (val) el.textContent = val;
    });
    const lb = document.getElementById('langBtn');
    if (lb) lb.textContent = LANG === 'it' ? '🇮🇹 IT' : '🇬🇧 EN';
    document.querySelectorAll('cal_wday').forEach( (el , i ) => {
        if (I18N[LANG].weekdays[i]) el.textContent = I18N[LANG].weekdays[i];
    });
}

export function toggleLang(){
    LANG = LANG === 'it' ? 'en' : 'it';
    localStorage.setItem('leave_lang', LANG);
    applyI28n()
    document.dispatchEvent(new CustomEvent('langchange'));
}

window.toggleLang = toggleLang;