// ============================================
// i18n.js — Translate Italian / English
// ============================================
import { LOCALES, getLocal, setLocal } from "./locales.js";

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
    },
    de: {
        nav_dashboard:'Dashboard', nav_calendar:'Kalender', nav_report:'Bericht', nav_settings:'Einstellungen',
        logout:'Abmelden', sync_active:'Firebase-Synchronisierung aktiv — Daten werden in Echtzeit auf allen Geräten aktualisiert',
        recent_events:'Letzte Ereignisse', mode_label:'Modus:', mode_single:'▶ Einzeln', mode_range:'↦ Zeitraum',
        incl_weekend:'Sa/So einschließen', excl_holidays:'Feiertage ausschließen',
        leave_left:'Verbleibender Urlaub', leave_hours_used:'Genutzte Urlaubsstunden', permit_hours_left:'Verbleibende Erlaubnisstunden',
        permit_days:'Erlaubnistage', office_days:'Bürotage',
        rpt_months:'Monate (Mehrfachauswahl)', rpt_all:'Alle', rpt_none:'Keine', rpt_generate:'Erstellen',
        rpt_leave_tot:'Urlaub gesamt', rpt_perm_tot:'Erlaubnis gesamt', rpt_office:'Bürotage', rpt_months_sel:'Ausgewählte Monate',
        rpt_no_event:'Keine Ereignisse', rpt_select_month:'Wählen Sie mindestens einen Monat aus.',
        t_leave:'Urlaub', t_permit:'Erlaubnis', t_office:'Büro', t_holiday:'Feiertag',
        m_mark_day:'Tag markieren', m_type:'Typ', m_duration:'Dauer', m_full:'Ganz', m_half:'Halb', m_hours:'Stunden',
        m_morning:'Morgen', m_afternoon:'Nachmittag', m_save:'Speichern', m_delete:'Entfernen', m_cancel:'Abbrechen',
        login_sub:'Anmelden, um Website und App zu synchronisieren', login_email:'E-Mail', login_pass:'Passwort',
        login_signin:'Anmelden', login_or:'— oder —', login_register:'Konto erstellen',
        set_annual:'Jährliche Konfiguration', set_leave_tot:'Urlaubstage gesamt', set_perm_ore:'Erlaubnis-/ROL-Stunden gesamt',
        set_day_hours:'Arbeitsstunden pro Tag', set_year:'Bezugsjahr', set_country:'Land der Feiertage',
        months:['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
        months_short:['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'],
        weekdays:['Mo','Di','Mi','Do','Fr','Sa','So'], syncBadge: '🔄 Synchronisiert', name: 'Urlaub & Erlaubnis'
    },
    fr: {
        nav_dashboard:'Tableau de bord', nav_calendar:'Calendrier', nav_report:'Rapport', nav_settings:'Paramètres',
        logout:'Déconnexion', sync_active:"Synchronisation Firebase active — les données se mettent à jour en temps réel sur tous vos appareils",
        recent_events:'Événements récents', mode_label:'Mode :', mode_single:'▶ Simple', mode_range:'↦ Intervalle',
        incl_weekend:'Inclure Sam/Dim', excl_holidays:'Exclure les jours fériés',
        leave_left:'Congés restants', leave_hours_used:'Heures de congé utilisées', permit_hours_left:'Heures de permission restantes',
        permit_days:'Jours de permission', office_days:'Jours au bureau',
        rpt_months:'Mois (sélection multiple)', rpt_all:'Tous', rpt_none:'Aucun', rpt_generate:'Générer',
        rpt_leave_tot:'Congés totaux', rpt_perm_tot:'Permission totale', rpt_office:'Jours au bureau', rpt_months_sel:'Mois sélectionnés',
        rpt_no_event:'Aucun événement', rpt_select_month:'Sélectionnez au moins un mois.',
        t_leave:'Congé', t_permit:'Permission', t_office:'Bureau', t_holiday:'Jour férié',
        m_mark_day:'Marquer la journée', m_type:'Type', m_duration:'Durée', m_full:'Complète', m_half:'Demi', m_hours:'Heures',
        m_morning:'Matin', m_afternoon:'Après-midi', m_save:'Enregistrer', m_delete:'Supprimer', m_cancel:'Annuler',
        login_sub:"Connectez-vous pour synchroniser le site et l'application", login_email:'E-mail', login_pass:'Mot de passe',
        login_signin:'Se connecter', login_or:'— ou —', login_register:'Créer un compte',
        set_annual:'Configuration annuelle', set_leave_tot:'Jours de congé totaux', set_perm_ore:'Heures de permission / ROL totales',
        set_day_hours:'Heures de travail par jour', set_year:'Année de référence', set_country:'Pays des jours fériés',
        months:['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
        months_short:['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Août','Sep','Oct','Nov','Déc'],
        weekdays:['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'], syncBadge: '🔄 Synchronisé', name: 'Congés & Permission'
    },
    es: {
        nav_dashboard:'Panel', nav_calendar:'Calendario', nav_report:'Informe', nav_settings:'Configuración',
        logout:'Cerrar sesión', sync_active:'Sincronización Firebase activa — los datos se actualizan en tiempo real en todos tus dispositivos',
        recent_events:'Eventos recientes', mode_label:'Modo:', mode_single:'▶ Único', mode_range:'↦ Rango',
        incl_weekend:'Incluir Sáb/Dom', excl_holidays:'Excluir festivos',
        leave_left:'Vacaciones restantes', leave_hours_used:'Horas de vacaciones usadas', permit_hours_left:'Horas de permiso restantes',
        permit_days:'Días de permiso', office_days:'Días en oficina',
        rpt_months:'Meses (selección múltiple)', rpt_all:'Todos', rpt_none:'Ninguno', rpt_generate:'Generar',
        rpt_leave_tot:'Vacaciones totales', rpt_perm_tot:'Permiso total', rpt_office:'Días en oficina', rpt_months_sel:'Meses seleccionados',
        rpt_no_event:'Sin eventos', rpt_select_month:'Selecciona al menos un mes.',
        t_leave:'Vacaciones', t_permit:'Permiso', t_office:'Oficina', t_holiday:'Festivo',
        m_mark_day:'Marcar día', m_type:'Tipo', m_duration:'Duración', m_full:'Completo', m_half:'Medio', m_hours:'Horas',
        m_morning:'Mañana', m_afternoon:'Tarde', m_save:'Guardar', m_delete:'Eliminar', m_cancel:'Cancelar',
        login_sub:'Inicia sesión para sincronizar el sitio y la app', login_email:'Correo electrónico', login_pass:'Contraseña',
        login_signin:'Iniciar sesión', login_or:'— o —', login_register:'Crear cuenta',
        set_annual:'Configuración anual', set_leave_tot:'Días de vacaciones totales', set_perm_ore:'Horas de permiso / ROL totales',
        set_day_hours:'Horas laborales por día', set_year:'Año de referencia', set_country:'País de festivos',
        months:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
        months_short:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
        weekdays:['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'], syncBadge: '🔄 Sincronizado', name: 'Vacaciones y Permiso'
    },
    nl: {
        nav_dashboard:'Dashboard', nav_calendar:'Kalender', nav_report:'Rapport', nav_settings:'Instellingen',
        logout:'Uitloggen', sync_active:'Firebase-synchronisatie actief — gegevens worden in realtime bijgewerkt op al je apparaten',
        recent_events:'Recente gebeurtenissen', mode_label:'Modus:', mode_single:'▶ Enkel', mode_range:'↦ Bereik',
        incl_weekend:'Za/Zo opnemen', excl_holidays:'Feestdagen uitsluiten',
        leave_left:'Resterend verlof', leave_hours_used:'Gebruikte verlofuren', permit_hours_left:'Resterende verlofuren',
        permit_days:'Verlofdagen', office_days:'Kantoordagen',
        rpt_months:'Maanden (meervoudige selectie)', rpt_all:'Alle', rpt_none:'Geen', rpt_generate:'Genereren',
        rpt_leave_tot:'Totaal verlof', rpt_perm_tot:'Totaal verlof (permit)', rpt_office:'Kantoordagen', rpt_months_sel:'Geselecteerde maanden',
        rpt_no_event:'Geen gebeurtenissen', rpt_select_month:'Selecteer ten minste één maand.',
        t_leave:'Verlof', t_permit:'Permit', t_office:'Kantoor', t_holiday:'Feestdag',
        m_mark_day:'Dag markeren', m_type:'Type', m_duration:'Duur', m_full:'Volledig', m_half:'Half', m_hours:'Uren',
        m_morning:'Ochtend', m_afternoon:'Middag', m_save:'Opslaan', m_delete:'Verwijderen', m_cancel:'Annuleren',
        login_sub:'Log in om site en app te synchroniseren', login_email:'E-mail', login_pass:'Wachtwoord',
        login_signin:'Inloggen', login_or:'— of —', login_register:'Account aanmaken',
        set_annual:'Jaarlijkse configuratie', set_leave_tot:'Totaal aantal verlofdagen', set_perm_ore:'Totaal permit-/ROL-uren',
        set_day_hours:'Werkuren per dag', set_year:'Referentiejaar', set_country:'Land feestdagen',
        months:['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'],
        months_short:['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
        weekdays:['Ma','Di','Wo','Do','Vr','Za','Zo'], syncBadge: '🔄 Gesynchroniseerd', name: 'Verlof & Permit'
    },
    pt: {
        nav_dashboard:'Painel', nav_calendar:'Calendário', nav_report:'Relatório', nav_settings:'Definições',
        logout:'Sair', sync_active:'Sincronização Firebase ativa — os dados são atualizados em tempo real em todos os dispositivos',
        recent_events:'Eventos recentes', mode_label:'Modo:', mode_single:'▶ Único', mode_range:'↦ Intervalo',
        incl_weekend:'Incluir Sáb/Dom', excl_holidays:'Excluir feriados',
        leave_left:'Férias restantes', leave_hours_used:'Horas de férias usadas', permit_hours_left:'Horas de licença restantes',
        permit_days:'Dias de licença', office_days:'Dias no escritório',
        rpt_months:'Meses (seleção múltipla)', rpt_all:'Todos', rpt_none:'Nenhum', rpt_generate:'Gerar',
        rpt_leave_tot:'Férias totais', rpt_perm_tot:'Licença total', rpt_office:'Dias no escritório', rpt_months_sel:'Meses selecionados',
        rpt_no_event:'Sem eventos', rpt_select_month:'Selecione pelo menos um mês.',
        t_leave:'Férias', t_permit:'Licença', t_office:'Escritório', t_holiday:'Feriado',
        m_mark_day:'Marcar dia', m_type:'Tipo', m_duration:'Duração', m_full:'Inteiro', m_half:'Meio', m_hours:'Horas',
        m_morning:'Manhã', m_afternoon:'Tarde', m_save:'Guardar', m_delete:'Remover', m_cancel:'Cancelar',
        login_sub:'Inicie sessão para sincronizar o site e a app', login_email:'E-mail', login_pass:'Palavra-passe',
        login_signin:'Iniciar sessão', login_or:'— ou —', login_register:'Criar conta',
        set_annual:'Configuração anual', set_leave_tot:'Total de dias de férias', set_perm_ore:'Total de horas de licença / ROL',
        set_day_hours:'Horas de trabalho por dia', set_year:'Ano de referência', set_country:'País dos feriados',
        months:['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
        months_short:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
        weekdays:['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'], syncBadge: '🔄 Sincronizado', name: 'Férias & Licença'
    }
};

export function currentLang() { return LOCALES[getLocal()].lang;}

export function t(key) {
    const LANG = currentLang();
    return ( I18N[LANG] && I18N[LANG][key]) || ( I18N.it[key] ) || key;
}

export function applyI28n(){
    const lang = currentLang();
    document.querySelectorAll('[data-i18n]').forEach(el=>{
        const val = t(el.dataset.i18n);
        if(val) el.textContent = val;
    });
    // Bottone locale nell'header
    const lb = document.getElementById('langBtn');
    if(lb){ const loc = LOCALES[getLocale()]; lb.textContent = `${loc.flag} ${getLocale().split('-')[0].toUpperCase()}`; }
    // Giorni della settimana nel calendario
    document.querySelectorAll('.cal-wday').forEach((el,i)=>{
        if(I18N[lang].weekdays[i]) el.textContent = I18N[lang].weekdays[i];
    });
}

export function changeLocal(code){
    setLocal(code);
    applyI28n();
    document.dispatchEvent(new CustomEvent('localchange'));
}

window.changeLocal = changeLocal;