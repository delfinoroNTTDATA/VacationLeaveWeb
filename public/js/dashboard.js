import { S } from './state.js';
import { calcStats } from './calc.js';
import { guardPage } from './app-shell.js';
import { t } from './i18n.js'

function renderDah(){
    const yr = S.cfg.year, st = calcStats(yr), aCO = st.amountCarriedOver;

    const banner = document.getElementById('amountCarriedOverBanner');

    if(banner){
        if(aCO.leaveDays > 0 || aCO.permitHours > 0){
            let parts = [];
            if(aCO.leaveDays > 0) parts.push(`<strong>+${aCO.leaveDays}gg ferie</strong> (${aCO.leaveDays * S.cfg.dayHours}h)`);
            if(aCO.permitHour > 0) parts.push(`<strong>+${aCO.permitHours}h permesso</strong>`);
            const from = S.cfg.aCOEnabled ? `da ${yr-1} + riporto manuale` : 'riporto manuale';
            banner.innerHTML = `<div class="card-amountCarriedOver-banner">
                <div class="crb-icon">&#128257;</div>
                <div class="crb-text">
                    <div class="crb-title">Residui riportati - ${from}</div>
                    <div class="crb-detail">${parts.join(' e ')}${st.noteDeadline ? ' &mdash; '+st.noteDeadline : ''}</div>
                </div>
            </div>`
        }else banner.intterHTML='' ;
        
        document.getElementById('statsGrid').innerHTML = [
            {   
                lbl: t('leave_left'), 
                val: st.leaveACO+'g',
                sub: `= ${st.leaveCons} giorni`,
                amountCarriedOver: aCO.leaveDays > 0 ? `+${aCO.leaveDays}gg` : '',
                pct: (st.leaveCons / st.leaveTotalYearly) * 100,
                acc: 'var(--leave)'

            },
            {
                lbl: t('leave_hours_used'),
                val: st.leaveHours + 'h',
                sub: `= ${st.leaveCons} giorni`,
                amountCarriedOver: '',
                pct: (st.leaveCons / st.leaveTotalYearly) * 100,
                acc: 'var(--leave)'
            },
            {
                lbl: t('permit_hours_left'),
                val: st.permitHourACO + 'h',
                sub: `${st.permitHours}h / ${st.permitTotalYearly}h`,
                amountCarriedOver: aCO.permitHours > 0 ? `+${aCO.permitHours}h` : '',
                pct: (st.permitHours / st.permitTotalYearly) * 100,
                acc: 'var(-permit)'
            },
            {
                lbl: t('permit_days'),
                val: st.permitDay + 'g',
                sub: `=${st.permitHours}h`,
                amountCarriedOver: '',
                pct: (st.permitHours / st.permitTotalYearly) * 100,
                acc: 'var(--permit)'
            },
            {
                lbl: t('office_days'),
                val: st.officeDays,
                sub: `${t('nav_dashboard') ? '' : ''}${yr}`,
                amountCarriedOver: '',
                pct: 0,
                acc: 'var(--office)'
            }
        ].map(c => `<div class="card" style="--accent:${c.acc}>
                <div class="card-label">${c.lbl}</div>
                <div class="card-value">${c.val}</div>
                <div class="card-sub">${c.sub}</div>
                ${c.amountCarriedOver ? `<div class="card-amountCarriedOver">&#128257; ${c.amountCarriedOver}</div>`: ''}
                ${c.pct ? `<div class="bar"><div class="bar-fill" style="width:${Math.min(100,c.pct)}%"></div></div>`: ''}
            </div>`
        ).join('');

        const recent = Object.entries(S.ev).sort(([a], [b]) => b.localeCompare(a)).slice(0,8);
        const list = document.getElementById('recentList');

        if(!recent.length){ list.innerHTML = `<div class="empty-msg">
                <span style="font-size:1.2.rem">&#128269;</span>
                Nessun evento. Apri il Calendario per aggiungerne.
            </div>`;
            return;
        }

        list.innerHTML= recent.map(([d, ev]) => {
            const [y, m, dd] = d.split('-');
            const ico = ev.type === 'leave' ? '🌴' : ev.type === 'permit' ? '⏰' : '🏢';
            const lbl = ev.type === 'leave' ? t('t_leave') : ev.type === 'permit' ? t('t_permit') : t('t_office');
            let qNote = '';

            if(ev.type !== 'office'){
                if(ev.qty === 'half'){
                    qNote = ` — ½ ${ev.half === 'morning' ? 'Mattina' : 'Pomeriggio'}`;
                } else if (ev.qty === 'hours') qNote = ` - ${ev.hours}h`;
            }
            return `<div class="recent-row">
                <span style="font-size:1.2rem">${ico}</span>
                <span style="flex:1; font-weight:500">${dd}/${m}/${y}<span style="font-size:.74rem; color:var(--muted)">${qNote}</span></span>
                <span class="badge badge-${ev.type}">${lbl}</span>
            </div>`
        }).join('');
    }
}

guardPage('dashboard', renderDah);

document.addEventListener('localechange', renderDah);