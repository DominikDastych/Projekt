CineVault – Movie Dashboard

Webová aplikace pro vyhledávání filmů a seriálů s využitím TMDB API. Školní projekt v rámci předmětu programování.

O projektu

CineVault umožňuje uživatelům vyhledávat filmy a seriály, zobrazovat jejich hodnocení, popis a plakát. Data jsou načítána z TMDB (The Movie Database) API přes vlastní backend server.

Funkce

Vyhledávání filmů a seriálů podle názvu
Zobrazení plakátu, hodnocení a popisu
Přidávání filmů do Watchlistu
Historie vyhledávání
Srovnávání filmůser
Uživatelské účty (registrace/přihlášení)
Admin panel (správa uživatelů, logy, nastavení API)
Tým

Project Manager: Dastych Backend Developer: Hajda Backend Developer: Vojta Frontend Developer: Horáček QA & Dokumentace: Filgas, Dastych

Technologie

Frontend: HTML, CSS, JavaScript Backend: Node.js, Express.js API: TMDB (The Movie Database) Databáze: připravována

Jak spustit projekt

Požadavky

Nainstalovaný Node.js (https://nodejs.org)
Klonování repozitáře git clone https://github.com/DominikDastych/Projekt.git cd Projekt

Instalace závislostí cd backend npm install

Spuštění serveru node server.js

Otevření aplikace Otevři prohlížeč a jdi na: http://localhost:3000

Struktura projektu

Projekt/ ├── Frontend/ │ ├── index.html hlavní stránka │ ├── main.js logika vyhledávání a renderování │ └── style.css styly ├── backend/ │ ├── server.js Express server + TMDB API │ ├── package.json │ └── node_modules/ └── README.md
