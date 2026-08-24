# leave & Leave — Web (Modular Structure)
  Multi-page web app. Each page has its own HTML, CSS, and JS, with shared JavaScript modules.

## Structure
```
  ferie-web/
  ├── index.html            ← Login (initial page)
  ├── dashboard.html        ← Dashboard
  ├── calendario.html       ← Calendar + event modal
  ├── report.html           ← Reports and CSV
  ├── impostazioni.html     ← Configuration and carryovers
  │
  ├── css/
  │   ├── common.css        ← variables, header, auth, modal, sync (SHARED)
  │   ├── dashboard.css
  │   ├── calendario.css
  │   ├── report.css
  │   └── impostazioni.css
  │
  ├── js/
  │   ├── firebase-config.js  ← credentials + Firebase init (SHARED)
  │   ├── state.js            ← S and CAL state (SHARED)
  │   ├── holidays.js         ← public holidays for 10 countries (SHARED)
  │   ├── calc.js             ← leave/leave calculations (SHARED)
  │   ├── data.js             ← load/save Firestore + listeners (SHARED)
  │   ├── i18n.js             ← IT/EN translations (SHARED)
  │   ├── app-shell.js        ← header + login guard (SHARED)
  │   │
  │   ├── login.js            ← index.html logic
  │   ├── dashboard.js        ← dashboard.html logic
  │   ├── calendario.js       ← calendario.html logic
  │   ├── report.js           ← report.html logic
  │   └── impostazioni.js     ← impostazioni.html logic
  │
  └── firebase.json         ← hosting config
```
## How It Works
  - Each HTML page loads common.css + its specific CSS file.
  - Each page loads its JS file as <script type="module">.
  - Page-specific JS files import the shared modules (Firebase, state, calculations...).
  - app-shell.js injects the header and protects the page: if you are not logged in, it redirects you to index.html.
  - Page navigation happens via standard <a href="..."> links (true multi-page application).
  - The state is reloaded from Firestore on every page (data is stored in the cloud).

## Configuration
  Open js/firebase-config.js
  Paste your Firebase credentials in place of the INCOLLA-QUI-... (PASTE-HERE-...) placeholders.

## Deploying to Firebase
 ```bash
    cd <name of your project>
    firebase use --add
    firebase deploy --only hosting --project <name of your Firebase project>
    index.html is the initial page (login), so Firebase automatically serves it as the home page.
```
## Language
  The 🇮🇹/🇬🇧 button in the header switches the language (IT/EN). The preference is saved in localStorage and applies across all pages.
