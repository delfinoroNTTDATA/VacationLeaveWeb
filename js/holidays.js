// =========================================================================
// holidays.js - Holiday for country ( based on keys )
// The name are translated on the interface's language ( holiday-names.js )
// The primary country derives from local; Extra countries can be added.
// =========================================================================

import { CAL } from './state.js';
import { LOCALES, getLocal } from "./locales.js";
import { labelForKey } from "./holiday-names.js";
import { currentLang } from "./i18n.js";

export function getHolidayKeys(year, country) {
    const h = new Map();
    const add = (m,d,key) => h.set(`${year}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`, key);
    const addDate = (dt, key) => h.set(`${year}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`,key)

    function easter(y) {
        const a= y % 19, b = Math.floor(y / 100), c = y % 100;
        const d= Math.floor( b / 4 ), e = b % 4, f = Math.floor( (b + 8) / 25);
        const g= Math.floor( (b - f + 1) / 3), h2= (19 * a + b - d - g + 15) % 30;
        const i= Math.floor(c / 4), k= c % 4;
        const l= (32 + 2 * e + 2 * i - h2 - k) % 7;
        const m= Math.floor((a + 11 * h2 + 22 * l) / 451);
        const mo= Math.floor(( h2 + l - 7 + m + 114) / 31) + 1;
        const day= ((h2 + l - 7 + m + 114) % 31) + 1;

        return new Date(y, mo, day);
    }

    const eD = easter(year);

    const eM = new Date(eD);
    eM.setDate(eM.getDate() + 1)

    const asc = new Date(eD);
    asc.setDate(asc.getDate() + 39);

    const pen = new Date(asc);
    pen.setDate(asc.getDate() + 10);

    const penL = new Date(pen);
    penL.setDate(penL.getDate() + 1);

    switch (country) {
        case 'IT':
            add(1,1,'new_year'); add(1,6,'epiphany'); add(4,25,'it_liberation'); add(5,1,'labor_day');
            add(6,2,'it_republic'); add(8,15,'it_ferragosto'); add(11,1,'all_saints'); add(12,8,'immaculate');
            add(12,25,'christmas'); add(12,26,'st_stephen');
            addDate(eD,'easter'); addDate(eM,'easter_monday');
            break;
        case 'DE':
            add(1,1,'new_year'); add(1,6,'epiphany'); add(5,1,'labor_day');
            add(10,3,'de_unity'); add(11,1,'all_saints'); add(12,25,'christmas'); add(12,26,'st_stephen');
            addDate(eD,'easter'); addDate(eM,'easter_monday');
            addDate(asc,'ascension'); addDate(pen,'pentecost'); addDate(penL,'pentecost_monday');
            break;
        case 'FR':
            add(1,1,'new_year'); add(5,1,'labor_day'); add(5,8,'fr_victory_1945'); add(7,14,'fr_bastille');
            add(8,15,'assumption'); add(11,1,'all_saints'); add(11,11,'fr_armistice'); add(12,25,'christmas');
            addDate(eM,'easter_monday'); addDate(asc,'ascension'); addDate(pen,'pentecost');
            break;
        case 'ES':
            add(1,1,'new_year'); add(1,6,'epiphany'); add(5,1,'labor_day');
            add(8,15,'assumption'); add(10,12,'es_national'); add(11,1,'all_saints');
            add(12,6,'es_constitution'); add(12,8,'immaculate'); add(12,25,'christmas');
            addDate(eD,'good_friday');
            break;
        case 'UK':
            add(1,1,'new_year'); add(5,1,'uk_may_bank'); add(8,28,'uk_summer_bank');
            add(12,25,'christmas'); add(12,26,'boxing_day'); add(12,27,'uk_christmas_sub');
            addDate(eD,'good_friday'); addDate(eM,'easter_monday');
            break;
        case 'US':
            add(1,1,'new_year'); add(7,4,'us_independence'); add(11,11,'us_veterans'); add(12,25,'christmas');
        { let dt=new Date(year,0,1),cnt=0; while(dt.getDay()!==1||++cnt<3) dt.setDate(dt.getDate()+1); addDate(dt,'us_mlk'); }
        { let dt=new Date(year,4,31); while(dt.getDay()!==1) dt.setDate(dt.getDate()-1); addDate(dt,'us_memorial'); }
        { let dt=new Date(year,8,1); while(dt.getDay()!==1) dt.setDate(dt.getDate()+1); addDate(dt,'us_labor'); }
        { let dt=new Date(year,10,1),cnt=0; while(dt.getDay()!==4||++cnt<4) dt.setDate(dt.getDate()+1); addDate(dt,'us_thanksgiving'); }
            break;
        case 'CH':
            add(1,1,'new_year'); add(1,2,'ch_berchtold'); add(5,1,'labor_day'); add(8,1,'ch_national');
            add(11,1,'all_saints'); add(12,25,'christmas'); add(12,26,'st_stephen');
            addDate(eD,'easter'); addDate(eM,'easter_monday'); addDate(asc,'ascension'); addDate(pen,'pentecost');
            break;
        case 'NL':
            add(1,1,'new_year'); add(4,27,'nl_kings_day'); add(5,5,'nl_liberation'); add(12,5,'nl_sinterklaas');
            add(12,25,'christmas'); add(12,26,'st_stephen');
            addDate(eD,'easter'); addDate(eM,'easter_monday');
            addDate(asc,'ascension'); addDate(pen,'pentecost'); addDate(penL,'pentecost_monday');
            break;
        case 'BE':
            add(1,1,'new_year'); add(5,1,'labor_day'); add(7,21,'be_national'); add(8,15,'assumption');
            add(11,1,'all_saints'); add(11,11,'fr_armistice'); add(12,25,'christmas'); add(12,26,'st_stephen');
            addDate(eM,'easter_monday'); addDate(asc,'ascension'); addDate(pen,'pentecost'); addDate(penL,'pentecost_monday');
            break;
        case 'PT':
            add(1,1,'new_year'); add(2,28,'pt_carnival'); add(4,25,'pt_freedom'); add(5,1,'labor_day');
            add(6,10,'pt_portugal_day'); add(8,15,'assumption'); add(10,5,'pt_republic');
            add(11,1,'all_saints'); add(12,1,'pt_restoration'); add(12,8,'immaculate'); add(12,25,'christmas');
            addDate(eD,'easter');
            break;
    }
    return h;
}

export function currentCountry() { return LOCALES[getLocal()].country; }

let _keyCachw = {};

export function clearHolidayCache() { _keyCachw = {}; }

function keysFor(year, country) {
    const k = `${year}-${country}`;
    if (!_keyCachw[k]) _keyCachw[k] = getHolidayKeys();
    return _keyCachw[k];
}

export function holidaysForYear(year) { return keysFor(year, currentCountry()); }

export function isHoliday(ds) { const [y] = ds.split('-'); return holidaysForYear(parseInt(y)).has(ds)}

export function holidayName(ds) {
    const [y] = ds.split('-');
    const out = [];
    (CAL.extraCountries || []).forEach(country => {
        if (country === currentCountry()) return;
        const key  = keysFor(parseInt(y), country).get(ds);
        if (key) out.push({ country, name: labelForKey(key, currentLang()) });
    });
    return out;
}

export function isWeekend(ds) {
    const [year, month, day] = ds.split('-');
    const dow = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).getDay();
    return dov === 0 || dow === 6;
}

export function isExcluded(ds) {
    if (isWeekend(ds) && !CAL.inclWE) return true;
    if (isHoliday(ds) && !CAL.exclLeave) return true;
    return false;
}

export function rangeGiorn( start, end) {
    const days= [];

    const [sy, sm, sd] = start.split('-').map(Number);
    const [ey, em, ed] = end.split('-').map(Number);

    let curDate= new Date(sy,sm - 1, sd);
    let endDate= new Date(ey,em - 1, ed);

    while (curDate <= endDate){
        const ds=`${curDate.getFullYear()}-${String(curDate.getMonth()+1).padStart(2,'0')}-${String(curDate.getDate()).padStart(2,'0')}`;
        if (!isExcluded(ds)) days.push(ds)
        curDate.setDate(curDate.getDate()+1);
    }

    return days;
}

export const COUNTRY_FLAG = { IT:'🇮🇹',DE:'🇩🇪',FR:'🇫🇷',ES:'🇪🇸',UK:'🇬🇧',US:'🇺🇸',CH:'🇨🇭',NL:'🇳🇱',BE:'🇧🇪',PT:'🇵🇹' };
export const COUNTRY_NAME = { IT:'Italia',DE:'Germania',FR:'Francia',ES:'Spagna',UK:'UK',US:'USA',CH:'Svizzera',NL:'Paesi Bassi',BE:'Belgio',PT:'Portogallo' };