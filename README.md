Quest'app è stata creata attraverso nextJs, come framework Fullstack, typescript come lingauggio, e Prisma ORM, come tramite tra BE e DB, il quale è postgreSQL.
L'app è hostata nella sua componente FE/BE su Vercel e Vercel blob, per le immagini, e su neon per la sua parte DB servless.

L'applicazioni presenta tutte le componenti richiesete:
-Tre pagine principali:
-una di "registrazione" per lo chef, contenente un pulsante sull'header per aprire un pop up di registrazione.
-una "personale", ovvero una pagina autogenerata, disponibile solo dopo il completamento del profilo dello chef, contenente la sua presentazione.
-una dashboard, ovvero una pagina in cui lo chef puo modificare le sue info, come biografia, piatti, menu, fatti e controllare i messaggi
-Un sistema di messaggistica: per testarlo, dopo aver creato un account del quale si ha accesso alla mail, e dopo averlo completato, si procede ad eseguire il log-out, per poi fare il login con l'utente di test, creato appositamente per lo scopo, con queste credenziali:email= giorgioneri@gmail.com password= password, si può ora procedere alla pagina di "registrazione" dove ci sarà un carosello contente i primi, e per ora unici, 7 chef, ovviamente è presente anche quello appena creato. Cliccando sul suo avatar, si viene reindirizzati alla sua pagina autogenerata, ed in basso a destra ci sarà l'icona per aprire la chat. Il destinatario del messaggio, che sia chef o user, riceverà una mail di notifca, contenente il testo del messaggio. Lo chef può molto più semplicemnte visualizzare e rispondere al messaggio dalla sua dashboard.
-Le pagine pubbliche e le corrispondenti chiamate API sono automaticamente cacheate attraverso le funzionalità di NextJs, così vale anche per le immagini, attraverso il component Image di next, esse vengono automaticamente impostate come lazy loading.
-L'autenticazione è gestita attraverso JWT e conseguenti coockies, inoltre le password sono sottoposte ad hashing attravero bcrypt.
-Lo chef ha possibilità di caricare foto di copertina, foto di profilo (avatar) e foto per la sua galleria. Queste vengono ottimizzate, venendo converite a webp e ridimensionate attraverso Sharp nel BE. Purtoppo in questo momento a causa delle limitatissime capacità di calcolo del profilo free di Vercel, questo processo necessità di diversi secondi.
-Gestione menù: è possibile creare dei menù, partendo da zero, o partendo dalla sezione piatti, i piatti sono filtrabili per portata o categoria.

Per quanto riguarda il database, tutte le tabelle hanno automaticamente indici sui propri id ed è stata impostata l'indicizzazione anche per chefId, ove presente.

Struttura:
Il progetto utilizza AppRouter di NextJs per l'indirizzamento delle pagine, quindi una pagina route.ts, contenuta in src/app/chef/chef-registration avrà un URL uguale https://host.qualcosa/chef/chef-registration, mentre una pagina route.ts contenuta in src/app/chef/[chefSlugId] avrà un URL uguale https://host.qualcosa/chef/idchef-mario-rossi
Analogamente per accedere ad un API, ad esempio quella per ottenere gli chef, questa sarà https://host.qualcosa/api/chef/ con metodo GET, mentre la stessa rotta con metodo POST invece creerà uno chef
Tutti i pezzi sono contenuti dentro la cartella src, eccezzione prisma, dentro la quale cartella sono presenti i modelli, rappresentanti il DB e le sue impostazioni
Dentro src, è presente actions, dentro la quale ci sono le server actions di Next, per velocizzare quando possible la richiesta dati dai componenti SSR,app, dove sono contenute le pagine, e quindi le rotte, le api, nella cartella api, e i layout, oltre che il global.css. Ci sono anche le cartelle components, a sua volta sottodivisa in altre cartelle, in base alla pagina in per la quale vengono utilizzate, context, in quale è presente l'unico context dell'applicazione, ovvero authContext, lib che contiene i file che inizializzano prisma e axios oltre auth.ts, che gestisce le funzioni di autenticazione. L'ultima cartella è utli, contente types, un file di interfaccie typescript, email, il file che gestisce l'invio di email e fonts, cartella contente il font Italiana, come richiesto.
è presente inoltre anche il file middleware.ts, può essere tranquillamente ignorato in quanto è necessario solo per il contesto di deploy su Vercel
