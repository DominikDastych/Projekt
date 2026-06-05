# CineVault – Movie Dashboard

Webová aplikace pro vyhledávání filmů a seriálů s využitím TMDB API. Školní projekt v rámci předmětu programování.

---

## O projektu

CineVault umožňuje uživatelům vyhledávat filmy a seriály, zobrazovat jejich hodnocení, popis a plakát. Data jsou načítána z TMDB (The Movie Database) API přes vlastní backend server.

---

## Funkce

- Vyhledávání filmů a seriálů podle názvu
- Zobrazení plakátu, hodnocení a popisu
- Přehrávání trailerů přímo v aplikaci
- Přidávání filmů do oblíbených
- Historie vyhledávání
- Uživatelské účty (registrace / přihlášení)
- Tmavý a světlý režim

---

## Tým

| Role | Člen |
|---|---|
| Project Manager | Dastych |
| Backend Developer | Hajda |
| Backend Developer | Vojta |
| Frontend Developer | Horáček |
| QA & Dokumentace | Filgas, Dastych |

---

## Technologie

| Vrstva | Technologie |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| API | TMDB (The Movie Database) |
| Databáze | users.json (lokální soubor) |

---

## Jak spustit projekt

### Požadavky

- Nainstalovaný [Node.js](https://nodejs.org)

### 1. Klonování repozitáře

```
git clone https://github.com/DominikDastych/Projekt.git
cd Projekt
```

### 2. Instalace závislostí

```
npm install
```

### 3. Spuštění serveru

```
node backend/server.js
```

### 4. Otevření aplikace

Otevři prohlížeč a jdi na: **http://localhost:3000**

---

## Struktura projektu

```
Projekt/
├── Frontend/
│   ├── index.html          hlavní stránka
│   ├── frontend-main.js    logika vyhledávání a renderování
│   └── style.css           styly
├── backend/
│   ├── server.js           Express server + TMDB API
│   ├── users.json          uložení uživatelů
│   └── package.json
└── README.md
```
