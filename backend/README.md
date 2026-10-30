# Magasin de vélos — API pédagogique NestJS

API REST pour un cours de web M1. Le module `customers` fournit un exemple complet
avec CRUD et ventes. Le module `bikes` fournit une entité de catalogue complète ;
son controller, son service et son repository sont volontairement vides, mais
correctement enregistrés dans Nest. Aucune route `/bikes` n’est exposée.

## Installation et démarrage

Utiliser une version de Node compatible avec les dépendances NestJS 12
(notamment Node 24.15 ou ultérieur sur la branche 24), ainsi que npm.

Depuis le dossier `backend` :

```bash
npm ci
npm run seed
npm run start:dev
```

L’API écoute sur `http://localhost:3000`. `PORT` permet de changer le port.
`npm run seed` compile puis initialise les données ; cette commande ne lance pas
le serveur. Pour démarrer la version compilée :

```bash
npm run build
npm run start:prod
```

## Architecture

```text
src/
  customers/
    customers.module.ts
    customers.controller.ts
    customers.service.ts
    customers.repository.ts
    dto/
    models/
    entities/
  bikes/
    bikes.module.ts
    bikes.controller.ts
    bikes.service.ts
    bikes.repository.ts
    entities/
  database/
```

Les noms de fichiers suivent le kebab-case et indiquent leur rôle.

- **Controller** : validation des DTO d’entrée, conversion en modèles d’entrée,
  appel du service et conversion des modèles en DTO de réponse.
- **Service** : règles métier, erreurs HTTP et manipulation de modèles uniquement.
- **Repository** : accès TypeORM, transactions et conversion explicite des entités
  vers les modèles. Les entités ne sont jamais retournées aux services.
- **Entités** : schéma de persistance. Les tables et colonnes ont un nom SQL
  explicite en snake_case ; modèles et JSON utilisent le camelCase.

Les injections Nest et types de colonnes SQL sont explicites. Un `ValidationPipe`
global retrouve automatiquement les DTO à partir du type des paramètres `@Body()`.
Vitest utilise SWC avec émission des métadonnées de décorateurs, pour permettre
cette découverte dans les tests comme dans l’application compilée avec TypeScript.
SWC transforme le code des tests sans vérifier les types ; `npm run typecheck`
reste responsable de cette vérification.

## Base SQLite et données initiales

TypeORM utilise `better-sqlite3` et `synchronize: true` pour créer et synchroniser
le schéma au démarrage de cette application pédagogique, sans migrations.

`DatabaseModule` configure TypeORM avec `forRoot()`. Les entités sont découvertes
via `__dirname + "/../**/*.entity{.ts,.js}"`, adapté aux modules ES et
au code compilé. Le seed partage les mêmes options.

La base locale est `db.sqlite`, ignorée par Git. Le chemin est relatif au dossier
de lancement. Pour utiliser une autre base (son dossier doit déjà exister) :

```bash
DATABASE_PATH=exam.sqlite npm run seed
DATABASE_PATH=exam.sqlite npm run start:dev
```

Il faut utiliser le même `DATABASE_PATH` pour le seed et le serveur. Les tests
utilisent exclusivement une base SQLite en mémoire. Les tests e2e remplacent
la connexion `DataSource` par une connexion en mémoire ; les entités y sont référencées
explicitement pour être compilées par SWC.

Le seed est transactionnel et génère, avec Faker en français :

- **100 clients**, avec prénom, nom, email unique, téléphone, date de naissance et adresse.
- **100 modèles de vélos**, avec des tailles, équipements, poids et prix cohérents avec leur catégorie (route, VTT, gravel, ville ou VTC), dont des modèles électriques.
- **2 à 10 ventes par client**, choisies aléatoirement dans ce nouveau catalogue, avec une quantité de 1 à 3, une date dans les deux dernières années et le prix du vélo comme prix historique.

Toutes les ressources reçoivent un véritable UUID v4 aléatoire via
`crypto.randomUUID()`. Les emails fictifs utilisent le domaine `example.com`.
Les modèles de vélos et leurs caractéristiques sont des données de démonstration,
pas un catalogue officiel des marques.

Chaque exécution ajoute un nouveau lot, sans supprimer ni modifier les données
existantes ; ce seed n’est donc plus idempotent. La commande affiche le nombre
de clients, vélos et ventes ajoutés. Elle ne s’exécute jamais automatiquement au
démarrage.

Pour tester rapidement, utiliser `GET /customers` pour récupérer un identifiant
client, puis `GET /customers/:id/bikes` pour récupérer les identifiants des vélos.
Les identifiants changent à chaque génération. Dans les exemples ci-dessous,
remplacer `<customer-id>` et `<bike-id>` par les UUID récupérés.

Un vélo représente un **modèle de catalogue**, sans numéro de série ni stock.
Chaque ligne `bike_sells` possède son propre UUID, une quantité, une date UTC et
un prix unitaire en centimes figé lors de la vente. Supprimer un client supprime
ses ventes par cascade SQL et conserve les vélos.

## Routes REST

| Méthode | Route                  | Réponse                                                |
| ------- | ---------------------- | ------------------------------------------------------ |
| GET     | `/customers`           | 200, liste non paginée des clients                     |
| POST    | `/customers`           | 201, client créé                                       |
| GET     | `/customers/:id`       | 200, détail du client                                  |
| PATCH   | `/customers/:id`       | 200, client modifié                                    |
| DELETE  | `/customers/:id`       | 204, aucun corps                                       |
| GET     | `/customers/:id/bikes` | 200, liste non paginée des ventes avec le vélo associé |
| POST    | `/customers/:id/bikes` | 201, vente créée                                       |

La liste des clients est triée par nom, prénom et UUID. Les réponses client
contiennent `id`, `firstName`, `lastName`, `email`, `phone`, `birthDate`, `address`,
`postalCode`, `city` et `country`, sans relations imbriquées.

Prénom, nom et email sont obligatoires à la création. L’email est unique,
normalisé en minuscules et sans espaces périphériques. Les autres champs sont
facultatifs et valent `null` en leur absence. Une date de naissance doit être
une date réelle au format `YYYY-MM-DD`, non future. Les champs d’adresse et le
téléphone sont des chaînes libres.

PATCH modifie uniquement les champs fournis. `null` efface un champ facultatif ;
il est interdit pour prénom, nom et email. Un PATCH vide est refusé.

Créer un client :

```bash
curl -X POST http://localhost:3000/customers \
  -H 'Content-Type: application/json' \
  -d '{"firstName":"Zoé","lastName":"Moreau","email":"zoe@example.com","city":"Paris"}'
```

Modifier un client et effacer son téléphone :

```bash
curl -X PATCH "http://localhost:3000/customers/<customer-id>" \
  -H 'Content-Type: application/json' \
  -d '{"city":"Nantes","phone":null}'
```

Enregistrer une vente :

```bash
curl -X POST "http://localhost:3000/customers/<customer-id>/bikes" \
  -H 'Content-Type: application/json' \
  -d '{"bikeId":"<bike-id>","quantity":2}'
```

La réponse contient `id`, `customerId`, `bikeId`, `quantity`, `soldAt` (ISO UTC)
et `unitPriceCents`. Le serveur choisit la date et copie le prix catalogue dans
une transaction ; le client ne peut pas fournir ces valeurs. `quantity` doit
être un entier strictement positif et représentable sans perte de précision.

Consulter les achats :

```bash
curl "http://localhost:3000/customers/<customer-id>/bikes"
```

Une entrée est retournée **par vente**, même pour plusieurs achats du même
modèle, triée par date puis UUID. Elle contient les champs de vente et `bike`,
avec toutes ses caractéristiques actuelles : `id`, `brand`, `model`,
`description`, `category`, `frameMaterial`, `frameSizeCm`, `wheelSizeInches`,
`gearCount`, `weightKg`, `electric`, `priceCents`.
Le prix catalogue actuel peut différer du prix historique de la vente.
Un client sans achat reçoit `[]`.

Les corps sont validés par `class-validator` avec une liste blanche et rejet
des propriétés inconnues. Aucune conversion implicite des nombres n’est faite.

| Code | Situation                                                |
| ---- | -------------------------------------------------------- |
| 400  | UUID ou corps invalide, propriété inconnue, PATCH vide   |
| 404  | Client ou vélo inexistant                                |
| 409  | Email déjà utilisé, y compris conflit détecté par SQLite |

Aucune authentification, pagination, gestion des stocks, modification ou
suppression individuelle des ventes n’est implémentée.
