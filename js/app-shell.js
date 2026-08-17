// ==========================================================================
// app-shell.js — Auth Guard + Shared Header 
// Imported from all internal pages (dashboard, calendar, reports, settings)
// ==========================================================================

import { auth, session } from './firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { loadConfig, loadAmountCarriedOver, startEventsListener } from "./data";
import { applyI28n } from "./i18n";
import {LOCALES, getLocal} from "./locales";

export function renderHeader(activePage) {
    const header = document.createElement("header");
    header.innerHTML = `
        <div class= "logo" data-i18n= "name" > Ferie <eem>&</eem> Permessi</div>
        <nav>
            <a class="nav-btn ${activePage === 'dashboard' ? 'active' : '' }" href="dashboard.html" data-i18n = "nav_dashboard">Dashboard</a>
            <a class="nav-btn ${activePage === 'calendar' ? 'active' : '' }" href="calendar.html" data-i18n = "nav_calendar">Calendario</a>
            <a class="nav-btn ${activePage === 'report' ? 'active' : '' }" href="report.html" data-i18n = "nav_report">Report</a>
            <a class="nav-btn ${activePage === 'settings' ? 'active' : '' }" href="settings.html" data-i18n = "nav_settings">Impostazioni</a>
            <div style="width: 1px; height: 20px; background: rgba(255,255,255,15); margin: 0 6px"></div>
            <select class="lang-select" id="localSelect" onchange="changeLocal(this.value)" title="Language and holiday">
                ${Object.entries(LOCALES).map(([code, l]) => `<option value="${code}">${l.flag} ${l.label}</option>`).join('')}
            </select>
            <div class="user-chip">
                <div class="user-avatar" id="userAvatar">U</div>
                <span id="userEmail" style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"></span>
                <button class="btn-logout" id="btnLogout" data-i18n="logout">Esci</button>
            </div>
            <span id="syncBadge" data-i18n="syncBadge">🔄 Sincronizzato</span>
        </nav>`;

    document.body.insertBefore(header, document.body.firstChild);

    document.getElementById('btnLogout').onclick = async () => { await signOut(auth); };
    const ls = document.getElementById("localSelect");
    if (ls) ls.value = getLocal();
}

export async function guardPage(activePage, onReady) {
    renderHeader(activePage);

    onAuthStateChanged(auth, async (user) =>{
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        session.uid = user.uid;
        const emailEl = document.getElementById('userEmail');
        if (emailEl) emailEl.textContent = user.email;

        const avatar = document.getElementById('userAvatar');
        if (avatar && user.email) avatar.textContent = user.email[0].toUpperCase();

        await loadConfig();
        await loadAmountCarriedOver();

        applyI28n();

        startEventsListener(() => {
            if (typeof onReady === 'function') onReady();
        })

        if (typeof onReady === 'function') onReady();
    });
}