Stack Tecnologico
Frontend

Framework: Next.js 14+ (App Router)
Linguaggio: TypeScript
Styling: Tailwind CSS
UI Components: Lucide React (icone)
Drag & Drop: @dnd-kit
Map Integration: Leaflet

Backend

Runtime: Next.js API Routes
ORM: Prisma
Database: PostgreSQL (Neon - serverless)
Autenticazione: JWT + HTTP-only cookies
Password Hashing: bcrypt
Image Processing: Sharp

Hosting & Storage

Applicazione: Vercel
Immagini: Vercel Blob Storage
Database: Neon (PostgreSQL serverless)

Funzionalità Principali

1. Gestione Profilo Chef

Registrazione completa: form multi-step per la creazione del profilo
Informazioni personali: bio, contatti, località
Selezione geografica: mappa interattiva con Leaflet per definire area operativa e raggio
Upload immagini:

Foto profilo (avatar)
Foto copertina
Galleria foto piatti
Ottimizzazione automatica (conversione WebP + ridimensionamento con Sharp)

2. Gestione Menu e Piatti

Creazione menu personalizzati con numero massimo di persone
Gestione piatti:

Organizzazione per portata (Antipasto, Primo, Secondo, Contorno, Dolce)
Categorizzazione con tag multipli
Riordino drag & drop con @dnd-kit
Assegnazione piatti a menu specifici

Fatti interessanti: sezione dedicata per evidenziare premi, riconoscimenti o particolarità

3. Sistema di Messaggistica

Chat in tempo reale tra chef e utenti
Notifiche email per nuovi messaggi
Interfaccia conversazionale con cronologia completa
Dashboard messaggi per gli chef

4. Pagine e Routing
   Pagine Pubbliche

/chef/chef-registration - Pagina di registrazione e carosello chef
/chef/[chefSlugId] - Pagina profilo pubblico dello chef (formato: {id}-{slug})

Pagine Private (Autenticate)

/chef/dashboard/[chefId] - Dashboard completa dello chef con sezioni:

Profilo
Menu
Piatti
Foto
Fatti
Recensioni
Messaggi

Schema Database
prisma- User (utenti base e chef)

- Chef (profili chef estesi)
- Menu (menu personalizzati)
- Dish (piatti)
- Category (categorie piatti)
- Photo (immagini)
- Facts (fatti interessanti)
- Review (recensioni)
- Chat (conversazioni)
- Message (messaggi)
  Ottimizzazioni Database

Indici automatici su tutti gli ID primari
Indici personalizzati su chefId per query veloci
Relazioni cascade per mantenere l'integrità referenziale

Sicurezza e Autenticazione

JWT tokens con HTTP-only cookies
Password hashing con bcrypt
Protezione route tramite middleware
Validazione input su tutti gli endpoint API

Performance e Ottimizzazioni
Caching

Cache automatica di pagine pubbliche (Next.js ISR)
Cache API routes per dati statici
Image optimization con Next.js Image component
Lazy loading automatico per tutte le immagini

Ottimizzazione Immagini

Conversione automatica a WebP
Ridimensionamento con Sharp
Storage su Vercel Blob con CDN integrato

Nota: Sul piano gratuito di Vercel, l'elaborazione delle immagini può richiedere diversi secondi a causa delle limitazioni di compute.

Struttura del Progetto
src/
├── app/ # App Router (pagine e API)
│ ├── api/ # API Routes
│ │ ├── auth/ # Autenticazione
│ │ ├── chefs/ # Gestione chef
│ │ ├── dishes/ # Gestione piatti
│ │ ├── menus/ # Gestione menu
│ │ ├── messages/ # Sistema messaggi
│ │ └── photos/ # Upload immagini
│ ├── chef/
│ │ ├── [chefSlugId]/ # Pagina profilo pubblico (dinamica)
│ │ ├── chef-registration/ # Registrazione chef
│ │ └── dashboard/[chefId]/ # Dashboard chef (protetta)
│ ├── layout.tsx # Layout principale
│ └── globals.css # Stili globali
│
├── components/ # Componenti React
│ ├── dashboard/ # Componenti dashboard
│ │ ├── ProfileComponent.tsx
│ │ ├── MenuComponent.tsx
│ │ ├── DishesComponent.tsx
│ │ ├── PhotosComponent.tsx
│ │ ├── FactsComponent.tsx
│ │ ├── MessagesComponent.tsx
│ │ ├── CityMapSelector.tsx # Selezione mappa
│ │ └── SortableDishRow.tsx # Drag & drop
│ └── codes/ # Pagine errore
│
├── context/ # React Context
│ └── AuthContext.tsx # Gestione autenticazione
│
├── lib/ # Librerie e utility
│ ├── prisma.ts # Client Prisma
│ ├── axios.ts # Configurazione Axios
│ └── auth.ts # Utility autenticazione
│
├── util/ # Utility e types
│ ├── types.ts # TypeScript interfaces
│ ├── email.ts # Invio email
│ └── fonts/ # Font personalizzati (Italiana)
│
└── actions/ # Server Actions Next.js
└── category.ts # Azioni categorie

prisma/
└── schema.prisma # Schema database

middleware.ts # Middleware Next.js (Vercel)

Testing dell'App
Setup Account Test

Creare un nuovo chef:

Andare su /chef/chef-registration
Cliccare il pulsante "diventa uno dei nostri chef"
Compilare il form di registrazione
Completare il profilo nella dashboard

Testare il sistema di messaggistica:

Fare logout dal nuovo account
Login con account test:

Email: giorgioneri@gmail.com
Password: password

Navigare al carosello chef su /chef/chef-registration
Selezionare lo chef creato
Utilizzare l'icona chat in basso a destra

Verificare notifiche:

Controllare la mail del destinatario
Rispondere dalla dashboard dello chef
